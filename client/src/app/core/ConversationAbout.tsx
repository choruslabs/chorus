import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { useMemo } from "react";
import { useParams } from "react-router";
import {
  getConversation,
  getConversationIdByFriendlyName,
} from "../../components/api/conversation";
import { getConversationCustomization } from "../../components/api/customization";
import { ConversationTabs } from "../../components/participation/ParticipationTabs";
import CoreBase from "./base";
import type { ConversationCustomization } from "./conversation";
import type { Conversation } from "./dashboard";
import "./gh-markdown-css-edited.css";

export default function ConversationAbout() {
  const params = useParams<{ conversationId: string }>();
  const conversationIdOrName = params.conversationId;
  // This controls max. time (in s) the user need to wait before they can see the new comment(s)
  // TODO: make it configurable (server level? conversation level?)
  const autoRefetchInterval = 15;

  const friendlyId = useQuery({
    queryKey: ["conversation-id-name", conversationIdOrName || ""],
    queryFn: () => getConversationIdByFriendlyName(conversationIdOrName || ""),
    retry: false,
    enabled: !!conversationIdOrName,
  });

  const conversationId = useMemo(() => {
    return friendlyId.data || conversationIdOrName;
  }, [friendlyId.data, conversationIdOrName]);

  const conversation = useQuery<Conversation>({
    queryKey: ["current-conversation", conversationId],
    queryFn: () => getConversation(conversationId ?? ""),
    retry: false,
    refetchInterval:
      process.env.NODE_ENV === "test" ? false : autoRefetchInterval * 1000,
  });

  const customization = useQuery<ConversationCustomization>({
    queryKey: ["conversation-customization", conversationId],
    queryFn: async () => getConversationCustomization(conversationId ?? ""),
    retry: false,
  });

  const contentHtml = useMemo(() => {
    const sanitized = DOMPurify.sanitize(
      customization.data?.knowledge_base_content ?? "",
    );
    const parsed = marked.parse(sanitized || "No about content provided.");
    if (typeof parsed !== "string") {
      return "Error parsing content.";
    }
    return parsed;
  }, [customization.data]);

  return (
    <CoreBase
      headerName={customization.data?.header_name}
      tabs={
        conversation.data?.id && (
          <ConversationTabs
            conversationId={conversation.data?.id}
            currentTab="about"
          />
        )
      }
    >
      <main className="w-[95%] min-h-full mx-auto flex flex-col">
        <div className="prose prose-lg prose-primary mx-auto markdown-body my-12 px-4">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized with DOMPurify */}
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </main>
    </CoreBase>
  );
}
