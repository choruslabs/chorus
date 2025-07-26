import { useParams } from "react-router";
import {
  createVote,
  getConversation,
  getConversationIdByFriendlyName,
  getNextComment,
} from "../../components/api/conversation";
import { useCallback, useEffect, useMemo } from "react";
import type { Conversation, ParticipationComment } from "./dashboard";
import { useQuery } from "@tanstack/react-query";
import { getApi } from "../../components/api/base";
import { ParticipationSpa } from "../../components/participation/ParticipationSpa";

const ConversationPage = () => {
  const params = useParams<{ conversationId: string }>();

  // This controls max. time (in s) the user need to wait before they can see the new comment(s)
  // TODO: make it configurable (server level? conversation level?)
  const autoRefetchInterval = 15;

  const friendlyId = useQuery({
    queryKey: ["conversation-id", params.conversationId || ""],
    queryFn: () => getConversationIdByFriendlyName(params.conversationId || ""),
    retry: false,
    enabled: !!params.conversationId,
  });

  const conversationId = useMemo(() => {
    return friendlyId.data || params.conversationId;
  }, [friendlyId.data, params.conversationId]);

  const conversation = useQuery<Conversation>({
    queryKey: ["current-conversation", conversationId],
    queryFn: () => getConversation(conversationId ?? ""),
    retry: false,
    refetchInterval: autoRefetchInterval * 1000,
  });

  const currentComment = useQuery<{
    comment: ParticipationComment;
    num_votes: number;
  }>({
    queryKey: ["current-comment", conversationId],
    queryFn: () => getNextComment(conversationId ?? ""),
    retry: false,
    refetchInterval: autoRefetchInterval * 1000,
  });

  const nextComment = useCallback(async () => {
    if (!conversationId) return;

    await currentComment.refetch();
  }, [conversationId, currentComment]);

  const fetchConversation = useCallback(async () => {
    if (!conversationId) return;
    await conversation.refetch();
  }, [conversationId, conversation]);

  // dialog logic
  useEffect(() => {
    const fetchData = async () => {
      await fetchConversation();
      await nextComment();
    };
    fetchData();
  }, []);

  const onFormComplete = () => {
    comments.refetch();
  };
  // end of dialog logic

  const onVote = async (
    commentId: string,
    vote: "agree" | "disagree" | "skip",
  ) => {
    const voteNum = vote === "agree" ? 1 : vote === "disagree" ? -1 : 0;

    if (!conversationId) return;
    await createVote(commentId, voteNum);
    await nextComment();
  };

  const allCommentsVoted = useMemo(() => {
    return !!currentComment.error?.message;
  }, [currentComment]);

  const comments = useQuery<[]>({
    queryKey: [`comment-query-${conversationId}`],
    queryFn: () => getApi(`/conversations/${conversationId}/comments`),
  });
  return (
    <ParticipationSpa
      conversation={conversation.data}
      currentComment={allCommentsVoted ? undefined : currentComment.data}
      comments={comments.data}
      onVoteComplete={onVote}
      onComplete={onFormComplete}
    />
  );
};

export default ConversationPage;
