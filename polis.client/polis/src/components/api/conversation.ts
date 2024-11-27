import { getApi, postApi } from "./base";

export const getConversation = async (conversationId: string) =>
  getApi(`/conversations/${conversationId}`);

export const voteComment = async (commentId: string, value: number) =>
  postApi(`/comments/${commentId}/vote`, { value });

export const addComment = async (conversationId: string, content: string) =>
  postApi(`/conversations/${conversationId}/comments`, { content });