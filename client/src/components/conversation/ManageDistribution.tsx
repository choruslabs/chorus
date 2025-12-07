import { useOutletContext } from 'react-router';
import type { Conversation } from '../../app/core/dashboard';
import { useMemo } from 'react';

export default function ManageDistribution() {
  const { conversation } = useOutletContext<{ conversation: Conversation }>();

  const conversationLink = useMemo(() => {
    return `${window.location.origin}/conversation/${
      conversation.user_friendly_link || conversation.id
    }`;
  }, [conversation]);

  return (
    <div className='[95%] max-w-4xl mx-auto p-5'>
      <p>Copy the below link to share this conversation to participants:</p>
      <div className='flex items-center justify-between mt-3 p-3 bg-gray-100 border-1 border-gray-400 rounded break-all'>
        {conversationLink}
        <button
          className='ml-3 p-2 bg-gray-500 text-white rounded'
          onClick={() => {
            navigator.clipboard.writeText(conversationLink);
          }}>
          Copy Link
        </button>
      </div>
    </div>
  );
}
