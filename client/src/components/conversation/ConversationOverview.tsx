import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import type { Conversation } from "../../app/core/dashboard";
import { EditableSetting, SettingRow } from "../admin/conversations/Settings";
import { updateConversation } from "../api/conversation";

function ConversationLink({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description?: string;
}) {
  return (
    <SettingRow label={label} description={description}>
      <div className="flex items-center gap-2">
        <p className="text-sm md:text-base underline text-blue-600 break-all">
          <a href={value}>{value}</a>
        </p>
        <button
          type="button"
          className="px-2 py-1 bg-blue-500 text-white rounded-xl hover:bg-blue-600 text-sm"
          onClick={() => {
            navigator.clipboard.writeText(value);
          }}
        >
          Copy Link
        </button>
      </div>
    </SettingRow>
  );
}

export default function ConversationOverview() {
  const { conversation } = useOutletContext<{ conversation: Conversation }>();

  const [error, setError] = useState<string | null>(null);

  const conversationLink = useMemo(() => {
    return `${window.location.origin}/conversation/${
      conversation.user_friendly_link || conversation.id
    }`;
  }, [conversation]);

  const updateConversationAttribute = (attribute: string) => (value: string) =>
    updateConversation({
      conversationId: conversation.id,
      [attribute]: value,
    })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        setError(error.message || "An error occurred while updating.");
      });

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      <EditableSetting
        label="Conversation Name"
        value={conversation.name}
        onSave={updateConversationAttribute("name")}
      />
      <EditableSetting
        label="Description"
        value={conversation.description || "No description provided."}
        onSave={updateConversationAttribute("description")}
      />
      <ConversationLink
        label="Participation Link"
        value={conversationLink}
        description="Share this link with participants to let them join the conversation."
      />
      <EditableSetting
        label="User Friendly Link"
        value={conversation.user_friendly_link || ""}
        description="Customize the URL for the participation link. Letters, numbers, and hyphens only."
        onSave={updateConversationAttribute("userFriendlyLink")}
      />
      <EditableSetting
        label="Created At"
        value={dayjs(conversation.date_created).format("MMMM D, YYYY h:mm A")}
      />
    </>
  );
}
