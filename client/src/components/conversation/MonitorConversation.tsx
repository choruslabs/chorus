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

  const toggleConversationAttribute = (key: string) => (value: boolean) =>
    updateConversation({
      conversationId: conversation.id,
      [key]: value,
    }).then(() => {
      window.location.reload();
    });

  return (
    <>
      <section>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">
          Participant Access
        </h3>
        <ToggleSetting
          label="Conversation is live"
          description="When off, participants cannot view or interact with this conversation."
          checked={conversation.is_active}
          onChange={toggleConversationAttribute("is_active")}
        />
        {conversation.is_active && (
          <>
            <ToggleSetting
              label="Participants can comment"
              description="Allow participants to submit new comments."
              checked={conversation.allow_comments}
              onChange={toggleConversationAttribute("allow_comments")}
            />

            <ToggleSetting
              label="Participants can vote"
              description="Allow participants to vote on comments."
              checked={conversation.allow_votes}
              onChange={toggleConversationAttribute("allow_votes")}
            />
          </>
        )}
      </section>
      <section className="mt-8">
        <h3 className="mb-2 text-sm font-semibold text-gray-900">Moderation</h3>
        <ToggleSetting
          label="Unmoderated comments shown"
          description="Allow participants to view and vote on comments that have not yet been moderated."
          checked={conversation.display_unmoderated}
          onChange={toggleConversationAttribute("display_unmoderated")}
        />
      </section>
      <section className="mt-8">
        <h3 className="mb-2 text-sm font-semibold text-gray-900">
          Conversation Analysis
        </h3>
        <ViewConversationAnalysis conversationId={conversation.id} />
      </section>
    </>
  );
}
