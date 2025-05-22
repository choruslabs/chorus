from uuid import uuid4, UUID
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from convergent.database import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column()
    author_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    display_unmoderated: Mapped[bool] = mapped_column(default=False)

    author = relationship("User")
    comments = relationship("Comment", backref="conversation")
    pcas = relationship("UserPca", backref="conversation")
    clusters = relationship("UserCluster", backref="conversation")


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    conversation_id: Mapped[UUID] = mapped_column(ForeignKey("conversations.id"))
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    content: Mapped[str] = mapped_column()
    approved: Mapped[bool] = mapped_column(nullable=True)

    user = relationship("User")
    votes = relationship("Vote", backref="comment")


class Vote(Base):
    __tablename__ = "votes"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    comment_id: Mapped[UUID] = mapped_column(ForeignKey("comments.id"))
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    value: Mapped[int] = mapped_column()

    user = relationship("User")


class UserPca(Base):
    __tablename__ = "user_pca"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    conversation_id: Mapped[UUID] = mapped_column(ForeignKey("conversations.id"))
    x: Mapped[float] = mapped_column()
    y: Mapped[float] = mapped_column()

    user = relationship("User")


class UserCluster(Base):
    __tablename__ = "user_cluster"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    conversation_id: Mapped[UUID] = mapped_column(ForeignKey("conversations.id"))
    cluster: Mapped[int] = mapped_column()

    user = relationship("User")
