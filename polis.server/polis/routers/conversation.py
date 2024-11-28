from typing import Annotated, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from polis import models
from polis.auth.user import CurrentUser
from polis.core.routines import update_conversation_analysis
from polis.database import Database
from pydantic import BaseModel


router = APIRouter()


class Conversation(BaseModel):
    name: str
    description: str = None


class Comment(BaseModel):
    content: str


class Vote(BaseModel):
    value: int


class CommentDetail(BaseModel):
    id: UUID
    content: str
    vote: Optional[int] = None


class ConversationDetail(BaseModel):
    id: UUID
    name: str
    description: str = None
    author_id: UUID
    comments: list[CommentDetail]
    graph: Optional[list] = None


@router.get("/conversations/{conversation_id}")
async def read_conversation(
    conversation_id: UUID, db: Database, current_user: CurrentUser
):
    conversation_db = db.query(models.Conversation).get(conversation_id)
    if conversation_db is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    comments = []
    for comment in conversation_db.comments:
        if comment.user == current_user:
            continue
        vote = (
            db.query(models.Vote)
            .filter(models.Vote.comment == comment, models.Vote.user == current_user)
            .first()
        )
        comments.append(
            CommentDetail(
                id=comment.id,
                content=comment.content,
                vote=vote.value if vote else None,
            )
        )

    graph = list(
        [
            {"x": pca.x, "y": pca.y, "cluster": cluster.cluster}
            for pca, cluster in zip(conversation_db.pcas, conversation_db.clusters)
        ]
    )

    detail = ConversationDetail(
        id=conversation_db.id,
        name=conversation_db.name,
        description=conversation_db.description,
        author_id=conversation_db.author_id,
        comments=comments,
        graph=graph,
    )

    return detail


@router.post("/conversations")
async def create_conversation(
    conversation: Conversation, db: Database, current_user: CurrentUser
):
    db_conversation = models.Conversation(
        **conversation.model_dump(), author=current_user
    )
    db.add(db_conversation)
    db.commit()

    return {"id": db_conversation.id}


@router.post("/conversations/{conversation_id}/comments")
async def create_comment(
    conversation_id: UUID, comment: Comment, db: Database, current_user: CurrentUser
):
    conversation = db.query(models.Conversation).get(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    db_comment = models.Comment(
        **comment.model_dump(), conversation=conversation, user=current_user
    )
    db.add(db_comment)
    db.commit()

    return {"id": db_comment.id}


@router.post("/comments/{comment_id}/vote")
async def vote_on_comment(
    comment_id: UUID, vote: Vote, db: Database, current_user: CurrentUser
):
    comment = db.query(models.Comment).get(comment_id)
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")

    db_vote = (
        db.query(models.Vote)
        .filter(models.Vote.comment == comment, models.Vote.user == current_user)
        .first()
    )

    if db_vote is not None:
        db_vote.value = vote.value
    else:
        db_vote = models.Vote(**vote.model_dump(), comment=comment, user=current_user)
        db.add(db_vote)
    db.commit()

    update_conversation_analysis(comment.conversation, db)

    return {"id": db_vote.id}
