from typing import Annotated
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session
from psqto.settings import settings


class Base(DeclarativeBase):
    pass


db = create_engine(settings.database_url)


def get_db():
    with Session(db) as session:
        yield session


Database = Annotated[Session, Depends(get_db)]
