import { Input, Textarea } from '@headlessui/react';
import CoreBase from './base';
// import { useSearchParams } from 'react-router';
import { postApi } from '../../components/api/base';
import { useState } from 'react';

const ConversationConfigPage = () => {



    // const [params] = useSearchParams();
    const [conversationId, setConversationId] = useState('')

    function formSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.target)
        const newConversationRequestBody = {
            display_unmoderated: false,
            name: formData.get('name'),
            description: formData.get('description')
        }
        console.log('processing', formData)
        postApi('/conversations', newConversationRequestBody).then(id => {
            setConversationId(id.id)
        })
    }



    return (
        <CoreBase>
            <div className='flex flex-col items-start  h-full py-4 w-[95%] max-w-3xl mx-auto'>
                <h1 className='text-5xl font-bold mb-8'>New conversation</h1>
                <form onSubmit={formSubmit} id="new-conversation" className='grid mx-auto md:grid-cols-2 gap-2 w-full'>
                    <label htmlFor="name">Conversation Name</label>
                    <Input className='border-gray-500 border-2' type='text' name="name" id="name" required></Input>
                    <label htmlFor="description">Conversation description</label>
                    <Textarea className='border-gray-500 border-2' name="description" id="description"></Textarea>
                    <label htmlFor="display-unmoderated">Show unmoderated comments to participants</label>
                    <Input className='border-gray-500 border-2 justify-self-start aspect-square h-6' type='checkbox' name="display-unmoderated" id="display-unmoderated"></Input>
                    <button className='border-4 border-green-500 p-2 bg-green-200 rounded-2xl'>Submit</button>
                </form>
                {conversationId.length > 0 && <><h2>Conversation created!</h2><p>id: {conversationId}</p></>}
            </div>
        </CoreBase>
    )
};

export default ConversationConfigPage;


