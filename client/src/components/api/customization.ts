import { getApi, putApi } from './base';

export const getConversationCustomization = async (conversationId: string) =>
  getApi(`/conversations/${conversationId}/customization`);

export const updateConversationCustomization = async ({
  conversationId,
  themeColor,
  headerName,
  knowledgeBaseContent,
}: {
  conversationId: string;
  themeColor?: string | null;
  headerName?: string | null;
  knowledgeBaseContent?: string | null;
}) =>
  putApi(`/conversations/${conversationId}/customization`, {
    theme_color: themeColor,
    header_name: headerName,
    knowledge_base_content: knowledgeBaseContent,
  });
