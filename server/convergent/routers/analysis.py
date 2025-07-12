from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from convergent import models
from convergent.auth.user import CurrentUser
from convergent.database import Database
from pydantic import BaseModel
import numpy as np
from convergent_engine.math import get_comment_consensus
from convergent.core.routines import get_vote_matrix


router = APIRouter(prefix="/analysis")


class CommentStatistics(BaseModel):
    id: UUID
    content: str
    consensus: float


class Group(BaseModel):
    group_id: int
    user_ids: list[UUID]
    comment_vote_counts: dict[UUID, int]
    variance: float = None
    top_comments: list[CommentStatistics] = None


class Conversation(BaseModel):
    id: UUID
    user_ids: list[UUID]
    comment_ids: list[UUID]

    groups: list[Group] = None

    num_votes: int = None
    participation_rate: float = None
    voting_rate: float = None


def get_conversation_groups(conversation: models.Conversation, db: Database):
    user_clusters = conversation.clusters
    comments = conversation.comments

    groups = {}
    for user_cluster in user_clusters:
        group_id = user_cluster.cluster

        if group_id not in groups:
            groups[group_id] = {
                "user_ids": [],
                "comment_vote_counts": {comment.id: 0 for comment in comments},
            }

        votes = (
            db.query(models.Vote)
            .filter(
                models.Vote.comment_id.in_([comment.id for comment in comments]),
                models.Vote.user_id == user_cluster.user_id,
            )
            .all()
        )

        groups[group_id]["user_ids"].append(user_cluster.user_id)
        for vote in votes:
            groups[group_id]["comment_vote_counts"][vote.comment_id] += vote.value

    for group_id, group in groups.items():
        group["variance"] = np.var(list(group["comment_vote_counts"].values()), ddof=1)

        top_comment_ids = list(
            map(
                lambda item: item[0],
                sorted(
                    group["comment_vote_counts"].items(),
                    key=lambda item: item[1],
                    reverse=True,
                ),
            )
        )[:3]

        top_comments = [
            db.query(models.Comment).get(comment_id) for comment_id in top_comment_ids
        ]

        group["top_comments"] = [
            {
                "id": comment.id,
                "content": comment.content,
                "consensus": group["comment_vote_counts"][comment.id]
                / len(user_clusters),
            }
            for comment in top_comments
        ]

    return [{"group_id": i, **group} for i, group in groups.items()]


@router.get("/conversation/{conversation_id}/groups", response_model=list[Group])
async def read_conversation_groups(
    conversation_id: UUID, db: Database, current_user: CurrentUser
):
    conversation = db.query(models.Conversation).get(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return get_conversation_groups(conversation, db)


@router.get(
    "/conversation/{conversation_id}",
    response_model=Conversation,
    response_model_exclude_none=True,
)
async def read_conversation(
    conversation_id: UUID,
    db: Database,
    current_user: CurrentUser,
    include_groups: bool = False,
    include_stats: bool = False,
):
    conversation = db.query(models.Conversation).get(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    voter_ids = set(cluster.user_id for cluster in conversation.clusters)
    participant_ids = set(comment.user_id for comment in conversation.comments)
    user_ids = list(voter_ids | participant_ids)

    comment_ids = [comment.id for comment in conversation.comments]

    response = {
        "id": conversation_id,
        "user_ids": user_ids,
        "comment_ids": comment_ids,
    }

    if include_groups:
        response["groups"] = get_conversation_groups(conversation, db)

    if include_stats:
        num_votes = (
            db.query(models.Vote)
            .filter(models.Vote.comment_id.in_(comment_ids))
            .count()
        )

        response["num_votes"] = num_votes
        response["num_participants"] = len(participant_ids)

        response["participation_rate"] = len(participant_ids) / len(user_ids)
        response["voting_rate"] = num_votes / (len(user_ids) * len(comment_ids))

    return response


@router.get(
    "/conversation/{conversation_id}/comments",
    response_model=list[CommentStatistics],
)
async def read_comments_with_consensus(
    conversation_id: UUID, db: Database, current_user: CurrentUser
):
    conversation = db.query(models.Conversation).get(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    votes_matrix, user_index, comment_index = get_vote_matrix(conversation)

    user_clusters = np.zeros(len(user_index), dtype=int)
    for cluster in conversation.clusters:
        user_clusters[user_index[cluster.user]] = cluster.cluster

    consensus_comments = []
    for comment in conversation.comments:
        comment_idx = comment_index.get(comment.id)
        consensus = get_comment_consensus(votes_matrix, comment_idx, user_clusters)
        consensus_comments.append(
            {
                "id": comment.id,
                "content": comment.content,
                "consensus": consensus,
            }
        )

    return sorted(consensus_comments, key=lambda x: x["consensus"], reverse=True)
