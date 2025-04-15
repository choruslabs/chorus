import { getApi } from './base';

export const getConversationGroups = async (conversationId: string) =>
  getApi(`/analysis/conversation/${conversationId}/groups`);
