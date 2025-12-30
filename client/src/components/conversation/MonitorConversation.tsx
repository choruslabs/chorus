import { useOutletContext } from "react-router";
import type { Conversation } from "../../app/core/dashboard";
import { updateConversation } from "../api/conversation";
import { SettingRow, ToggleSetting } from "./Settings";

function ViewConversationAnalysis({
  conversationId,
}: {
  conversationId: string;
}) {
  return (
    <SettingRow label="Conversation Report">
      <a
        href={`/conversation/${conversationId}/analysis`}
        className="underline"
      >
        <button
          type="button"
          className="bg-blue-500 text-sm md:text-base text-white px-2 py-1 rounded-xl hover:bg-blue-600"
        >
          View Report
        </button>
      </a>
    </SettingRow>
  );
}

export default function MonitorConversation() {
  const { conversation } = useOutletContext<{ conversation: Conversation }>();

  const toggleIsActive = () => {
    updateConversation({
      conversationId: conversation.id,
      isActive: !conversation.is_active,
    }).then(() => {
      window.location.reload();
    });
  };

  const toggleAllowComments = () => {
    updateConversation({
      conversationId: conversation.id,
      allowComments: !conversation.allow_comments,
    }).then(() => {
      window.location.reload();
    });
  };

  const toggleAllowVotes = () => {
    updateConversation({
      conversationId: conversation.id,
      allowVotes: !conversation.allow_votes,
    }).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="w-[95%] max-w-4xl mx-auto p-5">
      <section>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">
          Participant Access
        </h3>
        <ToggleSetting
          label="Conversation is live"
          description="When off, participants cannot view or interact with this conversation."
          checked={conversation.is_active}
          onChange={toggleIsActive}
        />
        {conversation.is_active && (
          <>
            <ToggleSetting
              label="Participants can comment"
              description="Allow participants to submit new comments."
              checked={conversation.allow_comments}
              onChange={toggleAllowComments}
            />

            <ToggleSetting
              label="Participants can vote"
              description="Allow participants to vote on comments."
              checked={conversation.allow_votes}
              onChange={toggleAllowVotes}
            />
          </>
        )}
      </section>
      <section className="mt-8">
        <h3 className="mb-2 text-sm font-semibold text-gray-900">
          Conversation Analysis
        </h3>
        <ViewConversationAnalysis conversationId={conversation.id} />
      </section>
    </div>
  );
}
