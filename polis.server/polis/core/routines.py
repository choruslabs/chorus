from typing import Annotated, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from polis import models
from polis.auth.user import CurrentUser
from polis.database import Database
import numpy as np
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score


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

    transformed = pca.fit_transform(vote_matrix)

    total_votes = np.sum(np.abs(vote_matrix))
    vote_scale = np.sum(np.abs(vote_matrix), axis=1)
    vote_scale = np.sqrt(total_votes / vote_scale)

    return transformed * vote_scale[:, None]


def get_kmeans(reduced: np.ndarray):
    best_silhouette = -1
    best_kmeans = None
    for n_clusters in range(2, min(6, len(reduced))):
        kmeans = KMeans(n_clusters=n_clusters)
        kmeans.fit(reduced)
        silhouette = silhouette_score(reduced, kmeans.labels_)
        if silhouette > best_silhouette:
            best_silhouette = silhouette
            best_kmeans = kmeans

    return best_kmeans


def update_conversation_analysis(conversation: models.Conversation, db: Session):
    vote_matrix, user_index, _ = get_vote_matrix(conversation)
    if min(vote_matrix.shape) < 2:
        return

    pca = get_pca(vote_matrix)
    cluster = get_kmeans(pca)

    index_to_user = {i: user for user, i in user_index.items()}

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

    if cluster is None:
        db.commit()
        return

    for i, label in enumerate(cluster.labels_):
        user_cluster = (
            db.query(models.UserCluster)
            .filter(
                models.UserCluster.user == index_to_user[i],
                models.UserCluster.conversation == conversation,
            )
            .first()
        )
        if user_cluster is None:
            user_cluster = models.UserCluster(
                user=index_to_user[i], conversation=conversation
            )
            db.add(user_cluster)
        user_cluster.cluster = int(label)

    db.commit()
