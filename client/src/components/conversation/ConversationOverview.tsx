import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import type { Conversation } from "../../app/core/dashboard";
import { EditableSetting, SettingRow } from "../admin/conversations/Settings";
import {
  type UpdateConversationPayload,
  updateConversation,
} from "../api/conversation";

function ConversationLink({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description?: string;
}) {
  const [copied, setCopied] = useState(false);

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
            setCopied(true);
          }}
        >
          {copied ? "Copied!" : "Copy Link"}
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

  const [conversationName, setConversationName] = useState(
    conversation.name || "",
  );
  const [description, setDescription] = useState(
    conversation.description || "",
  );
  const [friendlyLink, setFriendlyLink] = useState(
    conversation.user_friendly_link || "",
  );

  const saveConversationConfig = (
    event: React.ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const payload: UpdateConversationPayload = {
      conversationId: conversation.id,
    };
    if (conversation.name !== conversationName) {
      payload.name = conversationName;
    }
    if (conversation.description !== description) {
      payload.description = description;
    }
    if (conversation.user_friendly_link !== friendlyLink) {
      payload.userFriendlyLink = friendlyLink;
    }
    updateConversation(payload)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        setError(error.message || "An error occurred while updating.");
      });
  };

  const changesMade =
    conversation.name !== (conversationName || "") ||
    conversation.description !== description ||
    conversation.user_friendly_link !== friendlyLink;

  return (
    <form onSubmit={saveConversationConfig}>
      {error && <p className="text-red-500">{error}</p>}
      <SettingRow
        label="Conversation Name"
        unsaved={conversation.name !== conversationName}
      >
        <div className="flex items-center gap-2">
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={conversationName}
            onChange={(e) => setConversationName(e.target.value)}
          />
        </div>
      </SettingRow>
      <SettingRow
        label="Description"
        unsaved={conversation.description !== description}
      >
        <div className="flex items-center gap-2">
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            placeholder="No description provided."
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </SettingRow>
      <ConversationLink
        label="Participation Link"
        value={conversationLink}
        description="Share this link with participants to let them join the conversation."
      />
      <SettingRow
        label="User Friendly Link"
        description="Customize the URL for the participation link. Letters, numbers, and hyphens only."
        unsaved={conversation.user_friendly_link !== friendlyLink}
      >
        <div className="flex items-center gap-2">
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={friendlyLink || ""}
            onChange={(e) => setFriendlyLink(e.target.value)}
          />
        </div>
      </SettingRow>
      <EditableSetting
        label="Created At"
        value={dayjs(conversation.date_created).format("MMMM D, YYYY h:mm A")}
      />
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-400"
        disabled={!changesMade}
      >
        Save Changes
      </button>
    </form>
  );
}
