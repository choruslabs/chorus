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
          <>
            <ManageConversation
              editIdItem={conversation.data}
              refetch={refetchData}
            />
            <Outlet context={{ conversation: conversation.data }} />
          </>
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
