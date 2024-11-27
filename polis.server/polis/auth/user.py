from typing import Annotated
from fastapi import Cookie, Depends, HTTPException
from sqlalchemy.orm import Session
from polis import models
from polis.database import get_db


def get_current_user(
    access_token: Annotated[str, Cookie(include_in_schema=False)],
    db: Annotated[Session, Depends(get_db)],
) -> models.User:
    current_user = (
        db.query(models.User).filter(models.User.username == access_token).first()
    )

    if current_user is None:
        raise HTTPException(status_code=401)

    return current_user


CurrentUser = Annotated[models.User, Depends(get_current_user)]
