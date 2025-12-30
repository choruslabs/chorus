import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { Outlet, useParams } from "react-router";
import { getApi } from "../../components/api/base";
import ConversationConfig from "../../components/conversation/ConversationConfig";
import ManageConversation from "../../components/conversation/ManageConversation";
import CoreBase from "./base";
import type { Conversation } from "./dashboard";

const ConversationConfigPage = () => {
  const params = useParams();

  const editId = params.conversationId;
  const conversation = useQuery<Conversation>({
    queryKey: [""],
    queryFn: () => getApi(`/conversations/${editId}`),
    enabled: false,
  });

  const refetchData = useCallback(() => {
    conversation.refetch();
  }, [conversation]);

  useEffect(() => {
    if (editId) {
      refetchData();
    }
  }, [editId, refetchData]);

  return (
    <CoreBase requiresLogin={true}>
      {editId ? (
        conversation.data ? (
          <div className="max-h-full flex flex-col grow">
            <ManageConversation editIdItem={conversation.data} />
            <div className="w-[95%] max-w-4xl mx-auto p-5 grow overflow-y-auto">
              <Outlet context={{ conversation: conversation.data }} />
            </div>
          </div>
        ) : (
          <section>Loading...</section>
        )
      ) : (
        <ConversationConfig />
      )}
    </CoreBase>
  );
};

export default ConversationConfigPage;
