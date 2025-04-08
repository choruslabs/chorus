from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from polis import models
from polis.auth.user import CurrentUser
from polis.database import Database
from pydantic import BaseModel


router = APIRouter(prefix="/analysis")


class CommentStatistics(BaseModel):
    id: UUID
    content: str
    consensus: float


class Group(BaseModel):
    group_id: int
    user_ids: list[UUID]
    comment_vote_counts: dict[UUID, int]


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

        if not group_id in groups:
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

    return [{"group_id": i, **group} for i, group in groups.items()]


@router.get("/conversation/{conversation_id}/groups", response_model=list[Group])
async def read_conversation_groups(
    conversation_id: UUID, db: Database, current_user: CurrentUser
):
    conversation = db.query(models.Conversation).get(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if conversation.author != current_user:
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
    if conversation.author != current_user:
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
