from typing import Annotated, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import false
from sqlalchemy.orm import Session
from polis import models
from polis.auth.user import CurrentUser
from polis.core.routines import update_conversation_analysis
from polis.database import Database
from pydantic import BaseModel


router = APIRouter()


class Conversation(BaseModel):
    id: UUID
    name: str
    description: str = None


class Comment(BaseModel):
    id: UUID
    content: str


class Vote(BaseModel):
    value: int


class CommentDetail(Comment):
    pass


class CommentWithUserInfo(CommentDetail):
    vote: Optional[int] = None


class ConversationDetail(Conversation):
    author_id: UUID
    comments: list[CommentDetail]


@router.get("/conversations", response_model=list[Conversation])
async def read_conversations(db: Database, current_user: CurrentUser):
    conversations = (
        db.query(models.Conversation)
        .filter(models.Conversation.author_id == current_user.id)
        .all()
    )

    return conversations


@router.get("/conversations/{conversation_id}", response_model=ConversationDetail)
async def read_conversation(
    conversation_id: UUID, db: Database, current_user: CurrentUser
):
    conversation_db = db.query(models.Conversation).get(conversation_id)
    if conversation_db is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return conversation_db


def get_comment_user_info(
    comment: models.Comment, db: Database, current_user: CurrentUser
):
    vote = (
        db.query(models.Vote)
        .filter(models.Vote.comment == comment, models.Vote.user == current_user)
        .first()
    )
    return {
        "id": comment.id,
        "content": comment.content,
        "vote": vote.value if vote else None,
    }


@router.get(
    "/conversations/{conversation_id}/comments",
    response_model=list[CommentDetail] | list[CommentWithUserInfo],
)
async def read_comments(
    conversation_id: UUID,
    db: Database,
    current_user: CurrentUser,
    include_user_info: bool = false,
):
    comments = (
        db.query(models.Comment)
        .filter(models.Comment.conversation_id == conversation_id)
        .all()
    )

    if include_user_info:
        return [
            get_comment_user_info(comment, db, current_user) for comment in comments
        ]
    else:
        return comments


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
