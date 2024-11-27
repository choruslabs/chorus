import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseApiUrl } from "../../components/api/base";
import CoreBase from "./base";

interface Conversation {
  id: string;
  title: string;
}

const ConversationPage = () => {
  const { id } = useParams();

  const [conversation, setConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    fetch(`${baseApiUrl}/conversations/${id}`)
      .then((res) => res.json())
      .then((data) => setConversation(data));
  }, [id]);

  return (
    <CoreBase>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mt-5">Conversation</h1>
        {conversation ? (
          <div className="mt-5 p-5 border rounded-lg">
            <h2 className="text-xl font-bold">{conversation.title}</h2>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </CoreBase>
  );
};

export default ConversationPage;
