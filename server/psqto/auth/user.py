from typing import Annotated
from fastapi import Cookie, Depends, HTTPException
import jwt
from sqlalchemy.orm import Session
from psqto import models
from psqto.settings import SettingsDep
from psqto.database import Database


def get_current_user(
    access_token: Annotated[str, Cookie(include_in_schema=False)],
    db: Database,
    settings: SettingsDep,
) -> models.User:
    try:
        payload = jwt.decode(
            access_token, settings.secret_key, algorithms=[settings.algorithm]
        )
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    current_user = (
        db.query(models.User).filter(models.User.username == username).first()
    )
    if current_user is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    return current_user


CurrentUser = Annotated[models.User, Depends(get_current_user)]
