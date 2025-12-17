import { Switch } from "@headlessui/react";
import MDEditor from "@uiw/react-md-editor";
import DOMPurify from "dompurify";
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router";

import type { Conversation } from "../../app/core/dashboard";
import { updateConversation } from "../api/conversation";

export default function MonitorConversation() {
  const { conversation } = useOutletContext<{ conversation: Conversation }>();

  const [allowComments, setAllowComments] = useState(
    conversation.allow_comments,
  );
  const [allowVotes, setAllowVotes] = useState(conversation.allow_votes);
  const [knowledgeBase, setKnowledgeBase] = useState(
    conversation.knowledge_base || "",
  );

  const toggleAllowComments = () => {
    updateConversation({
      conversationId: conversation.id,
      allowComments: !allowComments,
    }).then(() => {
      setAllowComments(!allowComments);
    });
  };

  const toggleAllowVotes = () => {
    updateConversation({
      conversationId: conversation.id,
      allowVotes: !allowVotes,
    }).then(() => {
      setAllowVotes(!allowVotes);
    });
  };

  const saveKnowledgeBase = () => {
    updateConversation({
      conversationId: conversation.id,
      knowledgeBase,
    });
  };

  const knowledgeBaseUnsaved = useMemo(() => {
    return (conversation.knowledge_base || "") !== knowledgeBase;
  }, [conversation.knowledge_base, knowledgeBase]);

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
      <h2 className="text-2xl font-bold mt-4">
        Knowledge Base
        <span
          className={`${knowledgeBaseUnsaved ? "bg-amber-300" : "hidden"} px-2 py-0.5 text-sm rounded-sm mx-4`}
        >
          Unsaved
        </span>
      </h2>
      <h3>
        Provides extra, optional information for conversation participants. Use
        markdown syntax.
      </h3>
      <form onSubmit={saveKnowledgeBase}>
        <div className="container mb-4">
          <MDEditor
            data-color-mode="light"
            value={knowledgeBase}
            onChange={(val) => setKnowledgeBase(DOMPurify.sanitize(val || ""))}
          />
        </div>
        <button
          type="submit"
          className="bg-gray-500 text-white px-2 py-1 rounded-xl hover:bg-gray-600"
        >
          Save
        </button>
      </form>
      <h2 className="text-2xl font-bold mt-4">Conversation Analysis</h2>
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
