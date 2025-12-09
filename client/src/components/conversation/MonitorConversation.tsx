import { useOutletContext } from "react-router";
import type { Conversation } from "../../app/core/dashboard";
import { updateConversation } from "../api/conversation";
import { useState } from "react";
import { Switch } from "@headlessui/react";

export default function MonitorConversation() {
  const { conversation } = useOutletContext<{ conversation: Conversation }>();

  const [ allowComments, setAllowComments ] = useState(conversation.allow_comments);
  const [ allowVotes, setAllowVotes ] = useState(conversation.allow_votes);

  const toggleAllowComments = () => {
    updateConversation({
      conversationId: conversation.id,
      allowComments: !allowComments,
    }).then(() => {
      setAllowComments(!allowComments);
    });
  }

  const toggleAllowVotes = () => {
    updateConversation({
      conversationId: conversation.id,
      allowVotes: !allowVotes,
    }).then(() => {
      setAllowVotes(!allowVotes);
    });
  }

  return (
    <div className="[95%] max-w-4xl mx-auto flex flex-col items-start space-y-4 p-4">
      <h2 className="text-2xl font-bold">Monitor Conversation</h2>
      <div className="flex items-center space-x-4">
        <Switch
          checked={allowComments}
          onChange={toggleAllowComments}
          className={`${
            allowComments ? "bg-blue-600" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Allow Comments</span>
          <span
            className={`${
              allowComments ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
        <span>Enable participants to comment</span>
      </div>
      <div className="flex items-center space-x-4">
        <Switch
          checked={allowVotes}
          onChange={toggleAllowVotes}
          className={`${
            allowVotes ? "bg-blue-600" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Allow Votes</span>
          <span
            className={`${
              allowVotes ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
        <span>Enable participants to vote</span>
      </div>
      <h2 className="text-2xl font-bold">Conversation Analysis</h2>
      <a
        href={`/conversation/${conversation.id}/analysis`}
        className="underline"
      >
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          View Analysis
        </button>
      </a>
    </div>
  );
}
