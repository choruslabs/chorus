from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from chorus import models
from chorus.auth.user import RegisteredUser
from chorus.database import Database
from pydantic import BaseModel
from typing import Optional
from chorus.routers.conversation import Conversation, get_conversation_details

router = APIRouter(prefix="/moderation")


class Comment(BaseModel):
    id: UUID
    content: str
    user_id: UUID
    approved: Optional[bool] = None


@router.get("/conversations", response_model=list[Conversation])
async def read_conversations(db: Database, current_user: RegisteredUser):
    conversations = (
        db.query(models.Conversation)
        .where(models.Conversation.author == current_user)
        .all()
    )

    return [
        get_conversation_details(conversation, db, current_user)
        for conversation in conversations
    ]


@router.get("/conversations/{conversation_id}/comments", response_model=list[Comment])
async def read_comments(
    conversation_id: UUID, db: Database, current_user: RegisteredUser
):
    conversation: models.Conversation | None = db.query(models.Conversation).get(
        conversation_id
    )
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if conversation.author != current_user:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return conversation.comments


def get_comment(comment_id: UUID, db: Database):
    comment = db.query(models.Comment).get(comment_id)
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment


def get_comment_for_moderation(
    comment_id: UUID, db: Database, current_user: RegisteredUser
):
    comment = get_comment(comment_id, db)
    if comment.conversation.author != current_user:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment


@router.put("/comments/{comment_id}/approve")
async def approve_comment(comment_id: UUID, db: Database, current_user: RegisteredUser):
    comment_db = get_comment_for_moderation(comment_id, db, current_user)
    comment_db.approved = True
    db.commit()
    return {"success": True}


@router.put("/comments/{comment_id}/reject")
async def reject_comment(comment_id: UUID, db: Database, current_user: RegisteredUser):
    comment_db = get_comment_for_moderation(comment_id, db, current_user)
    comment_db.approved = False
    db.commit()
    return {"success": True}
