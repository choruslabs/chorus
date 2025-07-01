import { Outlet, useParams } from "react-router";
import ConversationConfig from "../../components/conversation/ConversationConfig";
import CoreBase from "./base";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getApi } from "../../components/api/base";
import { Conversation } from "./dashboard";
import ManageConversation from "../../components/conversation/ManageConversation";

const ConversationConfigPage = () => {
  let params = useParams();

  const editId = params.conversationId;

  const [conversationName, setConversationName] = useState("");
  const [conversationDescription, setConversationDescription] = useState("");

  if (editId) {
    const editIdItem = useQuery<Conversation>({
      queryKey: [""],
      queryFn: () => getApi(`/conversations/${editId}`),
    });
    useEffect(() => {
      if (editIdItem.data) {
        setConversationName(editIdItem.data.name);
        setConversationDescription(editIdItem.data.description);
      }
    }, [editIdItem.data]);

    const refetchData = () => {
      editIdItem.refetch();
    };

    if (editId) {
      return (
        <CoreBase>
          {editIdItem.data ? (
            <>
              <ManageConversation
                editIdItem={editIdItem.data}
                refetch={refetchData}
              />
              <Outlet />
            </>
          ) : (
            <section>Loading...</section>
          )}
        </CoreBase>
      );
    }
  }

  return (
    <CoreBase>
      <ConversationConfig />
    </CoreBase>
  );
};

export default ConversationConfigPage;
