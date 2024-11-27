from uuid import uuid4, UUID
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from polis.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)