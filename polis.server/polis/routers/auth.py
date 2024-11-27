from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from polis import models
from polis.database import Database
from polis.auth.user import CurrentUser


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


router = APIRouter()


class User(BaseModel):
    username: str
    password: str


@router.post("/token")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Database,
    response: Response,
):
    response.set_cookie(key="access_token", value=form_data.username, httponly=True)
    return {"access_token": form_data.username, "token_type": "bearer"}


@router.post("/register")
async def register(user: User, db: Database):
    user = models.User(username=user.username, hashed_password=user.password)
    db.add(user)
    db.commit()

    return {"username": user.username}


@router.get("/users/me")
async def read_users_me(current_user: CurrentUser):
    return {"username": current_user.username}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out"}
