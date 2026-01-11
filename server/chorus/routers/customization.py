import re
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from chorus import models
from chorus.auth.user import CurrentUser, RegisteredUser
from chorus.database import Database


class ConversationCustomization(BaseModel):
    theme_color: Optional[str] = None
    header_name: Optional[str] = None
    knowledge_base_content: Optional[str] = None


router = APIRouter()


@router.get(
    "/conversations/{conversation_id}/customization",
    response_model=ConversationCustomization,
)
def get_conversation_customization(
    conversation_id: UUID, db: Database, current_user: CurrentUser
):
    conversation_db = (
        db.query(models.Conversation)
        .filter(models.Conversation.id == conversation_id)
        .first()
    )
    if not conversation_db:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return ConversationCustomization.model_validate(
        conversation_db, from_attributes=True
    )


@router.put(
    "/conversations/{conversation_id}/customization",
    response_model=ConversationCustomization,
)
def update_conversation_customization(
    conversation_id: UUID,
    customization: ConversationCustomization,
    db: Database,
    current_user: RegisteredUser,
):
    conversation_db = (
        db.query(models.Conversation)
        .filter(models.Conversation.id == conversation_id)
        .first()
    )
    if not conversation_db:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if not conversation_db.author_id == current_user.id:
        raise HTTPException(status_code=404, detail="Conversation not found")

    for field, value in customization.model_dump().items():
        if field == "theme_color" and value is not None:
            if value == "":
                value = None
            else:
                if not re.match(r"^#[0-9A-Fa-f]{6}$", value):
                    raise HTTPException(
                        status_code=422, detail="Invalid hex color code"
                    )
                value = value.lower()

        setattr(conversation_db, field, value)

    db.add(conversation_db)
    db.commit()
    db.refresh(conversation_db)

    return ConversationCustomization.model_validate(
        conversation_db, from_attributes=True
    )
