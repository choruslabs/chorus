import { getApi } from "./base";

export const getConversationGroups = async (conversationId: string) =>
  getApi(`/analysis/conversation/${conversationId}/groups`);

export const getConversationWithConsensus = async (conversationId: string) =>
  getApi(
    `/analysis/conversation/${conversationId}?include_consensus_comments=true`,
  );
