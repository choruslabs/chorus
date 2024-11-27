from typing import Annotated, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from polis import models
from polis.auth.user import CurrentUser
from polis.database import Database
import numpy as np
from sklearn.decomposition import PCA


def get_vote_matrix(conversation: models.Conversation):
    comments = conversation.comments

    users = set()
    for comment in comments:
        for vote in comment.votes:
            users.add(vote.user)

    vote_matrix = np.zeros((len(users), len(comments)))
    user_index = {user: i for i, user in enumerate(users)}
    comment_index = {comment: i for i, comment in enumerate(comments)}

    for comment in comments:
        for vote in comment.votes:
            vote_matrix[user_index[vote.user], comment_index[comment]] = vote.value

    return vote_matrix, user_index, comment_index


def get_pca(vote_matrix: np.ndarray):
    pca = PCA(n_components=2)
    return pca.fit_transform(vote_matrix)


def update_conversation_pca(conversation: models.Conversation, db: Session):
    vote_matrix, user_index, _ = get_vote_matrix(conversation)
    if min(vote_matrix.shape) < 2:
        return

    index_to_user = {i: user for user, i in user_index.items()}
    pca = get_pca(vote_matrix)

    for i, pca_values in enumerate(pca):
        user_pca = (
            db.query(models.UserPca)
            .filter(
                models.UserPca.user == index_to_user[i],
                models.UserPca.conversation == conversation,
            )
            .first()
        )
        if user_pca is None:
            user_pca = models.UserPca(user=index_to_user[i], conversation=conversation)
            db.add(user_pca)
        user_pca.x, user_pca.y = pca_values.astype(float).tolist()

    db.commit()
