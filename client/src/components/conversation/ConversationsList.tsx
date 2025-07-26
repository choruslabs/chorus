import { useQuery } from "@tanstack/react-query";
import type { Conversation } from "../../app/core/dashboard";
import { ConversationsTable } from "../admin/conversations/ConversationsTable";
import { getApi } from "../api/base";

export default function ConversationsList() {
  const conversations = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: () => getApi("/moderation/conversations"),
  });
  return <ConversationsTable conversations={conversations.data} />;
}
