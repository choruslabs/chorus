import { useParams } from "react-router";
import {
  createVote,
  getConversation,
  getNextComment,
} from "../../components/api/conversation";
import { useEffect } from "react";
import { Conversation, ParticipationComment } from "./dashboard";
import { useQuery } from "@tanstack/react-query";
import { getApi } from "../../components/api/base";
import { ParticipationSpa } from "../../components/participation/ParticipationSpa";

const ConversationPage = () => {
  const { conversationId } = useParams<{ conversationId: string }>();

  const conversation = useQuery<Conversation>({
    queryKey: ["current-conversation", conversationId],
    queryFn: () => getConversation(conversationId ?? ""),
  });

  const currentComment = useQuery<{
    comment: ParticipationComment;
    num_votes: number;
  }>({
    queryKey: ["current-comment", conversationId],
    queryFn: () => getNextComment(conversationId ?? ""),
  });

  const nextComment = async () => {
    if (!conversationId) return;

    await currentComment.refetch();
  };

  const fetchConversation = async () => {
    if (!conversationId) return;
    await conversation.refetch();
  };

  // dialog logic
  useEffect(() => {
    const fetchData = async () => {
      await fetchConversation();
      await nextComment();
    };
    fetchData();
  }, [conversationId]);

  const onFormComplete = () => {
    comments.refetch();
  };
  // end of dialog logic

  const onVote = async (
    commentId: string,
    vote: "agree" | "disagree" | "skip"
  ) => {
    const voteNum = vote === "agree" ? 1 : vote === "disagree" ? -1 : 0;

    if (!conversationId) return;
    await createVote(commentId, voteNum);
    await nextComment();
  };

  const comments = useQuery<[]>({
    queryKey: [`comment-query-${conversationId}`],
    queryFn: () => getApi(`/conversations/${conversationId}/comments`),
  });
  return (
    <ParticipationSpa
      conversation={conversation.data}
      currentComment={currentComment.data}
      comments={comments.data}
      onVoteComplete={onVote}
      onComplete={onFormComplete}
    />
  );
};

export default ConversationPage;
