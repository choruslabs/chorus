import { useQuery } from '@tanstack/react-query';
import CoreBase from './base';
import { getApi } from '../../components/api/base';

const DashboardPage = () => {

  const conversations = useQuery<{ id: string, name: string, description: string }[]>({
    queryKey: ['conversations'], queryFn: () => getApi('/conversations')
  })

  return (
    <CoreBase>
      <div className='flex flex-col items-start h-full p-10'>
        <div id="heading" className='flex w-full justify-between'>
          <div id="hdeading-text">
            <h1 className='text-5xl font-bold mb-8'>Conversations</h1>
            <h2>Start or participate in a conversation.</h2>
          </div>
          <a className='mb-8 p-2 bg-secondary text-white rounded-md h-fit' href='/conversation/new'>+ Create conversation</a>
        </div>
        {conversations.data?.map(conversation => <div>{conversation.id}: {conversation.name}, desc: {conversation.description}</div>)}
      </div>
    </CoreBase>
  )
};

export default DashboardPage;
