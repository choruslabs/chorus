import { useOutletContext } from 'react-router';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import type { Conversation } from '../../app/core/dashboard';
import { EditableSetting, SettingRow } from './Settings';

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

  const conversationLink = useMemo(() => {
    return `${window.location.origin}/conversation/${
      conversation.user_friendly_link || conversation.id
    }`;
  }, [conversation]);

  return (
    <div className="w-[95%] max-w-4xl mx-auto p-5">
      <EditableSetting label="Conversation Name" value={conversation.name} />
      <EditableSetting
        label="Description"
        value={conversation.description || 'No description provided.'}
      />
      <ConversationLink
        label="Participation Link"
        value={conversationLink}
        description="Share this link with participants to let them join the conversation."
      />
      <EditableSetting
        label="User Friendly Link"
        value={conversation.user_friendly_link || ''}
        description="Customize the URL for the participation link. Letters, numbers, and hyphens only."
      />
      <EditableSetting
        label="Created At"
        value={dayjs(conversation.created_at).format('MMMM D, YYYY h:mm A')}
      />
    </div>
  );
}
