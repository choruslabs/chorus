from typing import Annotated
from uuid import UUID
from fastapi import Cookie, Depends, HTTPException
import jwt
from sqlalchemy.orm import Session
from chorus import models
from chorus.settings import SettingsDep
from chorus.database import Database


def get_current_user(
    access_token: Annotated[str, Cookie(include_in_schema=False)],
    db: Database,
    settings: SettingsDep,
) -> models.User:
    try:
        payload = jwt.decode(
            access_token, settings.secret_key, algorithms=[settings.algorithm]
        )
        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    current_user = db.query(models.User).filter(models.User.username == sub).first()
    if current_user is None:
        current_user = (
            db.query(models.User).filter(models.User.session_id == UUID(sub)).first()
        )
    if current_user is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    return current_user


def get_current_registered_user(
    current_user: Annotated[models.User, Depends(get_current_user)],
) -> models.User:
    if current_user.is_anonymous:
        raise HTTPException(
            status_code=401, detail="Anonymous users cannot access this resource"
        )
    return current_user


CurrentUser = Annotated[models.User, Depends(get_current_user)]
RegisteredUser = Annotated[models.User, Depends(get_current_registered_user)]
