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


@router.put("/comments/{comment_id}/approve")
async def approve_comment(
    comment_id: UUID, db: Database, current_user: CurrentUser
):
    comment_db = db.query(models.Comment).get(comment_id)
    if comment_db is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment_db.conversation.author != current_user:
        raise HTTPException(status_code=404, detail="Comment not found")
    comment_db.approved = True
    db.commit()
    return {"success": True}