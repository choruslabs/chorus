import { useQuery } from "@tanstack/react-query";
import { getApi } from "../api/base";
import { useOutletContext, useParams } from "react-router";
import CommentsTable from "../admin/comments/CommentsTable";
import type { Conversation, ModerationComment } from "../../app/core/dashboard";

export default function ManageComments() {
  const params = useParams();
  const { conversation } = useOutletContext<{ conversation: Conversation }>();

  const convoId = params.conversationId;
  const comments = useQuery<ModerationComment[]>({
    queryKey: [`comment-query-${convoId}`],
    queryFn: () => getApi(`/moderation/conversations/${convoId}/comments`),
  });

  const onFormComplete = () => {
    comments.refetch();
  };

  return (
    <CommentsTable
      conversation={conversation}
      comments={comments.data ?? []}
      onComplete={onFormComplete}
    />
  );
}
