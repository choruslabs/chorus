import { getApi, postApi } from './base';

export const getConversation = async (conversationId: string) =>
  getApi(`/conversations/${conversationId}`);

export const getConversationComments = async (conversationId: string) =>
  getApi(`/conversations/${conversationId}/comments`);

export const createConversation = async (
  name: string,
  description: string,
  displayUnmoderated: boolean
) =>
  postApi('/conversations', {
    name,
    description,
    displayUnmoderated,
  });

export const updateConversation = async (
  conversationId: string,
  name: string | null,
  description: string | null,
  displayUnmoderated: boolean | null
) =>
  postApi(`/conversations/${conversationId}`, {
    name,
    description,
    displayUnmoderated,
  });

export const createComment = async (conversationId: string, content: string) =>
  postApi(`/conversations/${conversationId}/comments`, { content });

export const createVote = async (commentId: string, value: number) =>
  postApi(`/comments/${commentId}/vote`, { value });
