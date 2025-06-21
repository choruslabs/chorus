import { useQuery } from '@tanstack/react-query';
import CoreBase from './base';
import { getApi } from '../../components/api/base';
import { ConversationTable } from '../../components/admin/ConversationsTable';

export type Conversation = { id: string, name: string, description: string }

const DashboardPage = () => {

  const conversations = useQuery<Conversation[]>({
    queryKey: ['conversations'], queryFn: () => getApi('/conversations')
  })

  return (
    <CoreBase>
      <div className='flex flex-col items-start h-full w-[95%] mx-auto py-10 max-w-4xl'>
        <div id="heading" className='flex w-full justify-between flex-wrap'>
          <div id="hdeading-text">
            <h1 className='text-5xl font-bold mb-8'>Conversations</h1>
            <h2>Start or participate in a conversation.</h2>
          </div>
          <a className='mb-8 p-2 bg-secondary text-white rounded-md h-fit' href='/conversation/new'>+ Create conversation</a>
        </div>
        {conversations.data && <ConversationTable conversations={conversations.data} />}
      </div>
    </CoreBase>
  )
};

export default DashboardPage;
