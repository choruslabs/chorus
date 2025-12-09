import { getApi, postApi, putApi } from "./base";

export const getConversation = async (conversationId: string) =>
  getApi(`/conversations/${conversationId}`);

export const getConversationIdByFriendlyName = async (friendlyName: string) =>
  getApi(`/conversations/friendly-link/${friendlyName}/id`);

export const getConversationComments = async (conversationId: string) =>
  getApi(`/conversations/${conversationId}/comments`);

export const createConversation = async ({
  name,
  description,
  displayUnmoderated,
  allowVotes,
  allowComments,
  userFriendlyLink,
}: {
  name: string;
  description: string;
  displayUnmoderated: boolean;
  allowVotes: boolean;
  allowComments: boolean;
  userFriendlyLink: string;
}) =>
  postApi("/conversations", {
    name,
    description,
    display_unmoderated: displayUnmoderated,
    allow_votes: allowVotes,
    allow_comments: allowComments,
    user_friendly_link: userFriendlyLink,
  });

export const updateConversation = async ({
  conversationId,
  name,
  description,
  displayUnmoderated,
  allowComments,
  allowVotes,
  userFriendlyLink,
}: {
  conversationId: string;
  name?: string | null;
  description?: string | null;
  displayUnmoderated?: boolean | null;
  allowComments?: boolean | null;
  allowVotes?: boolean | null;
  userFriendlyLink?: string | null;
}) =>
  putApi(`/conversations/${conversationId}`, {
    name,
    description,
    display_unmoderated: displayUnmoderated,
    allow_comments: allowComments,
    allow_votes: allowVotes,
    user_friendly_link: userFriendlyLink,
  });

export const createComment = async (conversationId: string, content: string) =>
  postApi(`/conversations/${conversationId}/comments`, { content });

export const createVote = async (commentId: string, value: number) =>
  postApi(`/comments/${commentId}/vote`, { value });

export const getNextComment = async (conversationId: string) =>
  getApi(`/conversations/${conversationId}/comments/remaining`);
