import { useParams } from 'react-router-dom';
import CoreBase from './base';
import {
  createVote,
  getConversation,
  getNextComment,
} from '../../components/api/conversation';
import { useEffect, useState } from 'react';
import { CheckIcon, ForwardIcon, XMarkIcon } from '@heroicons/react/24/solid';

const ConversationPage = () => {
  const { conversationId } = useParams();

  const [conversation, setConversation] = useState<any>(null);
  const [comment, setComment] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!conversationId) {
        setError('Invalid URL');
        setLoading(false);
        return;
      }

      const response = await getConversation(conversationId);

      if (response) {
        setConversation(response);
      } else {
        setError('Conversation not found');
      }

      setLoading(false);
    };

    fetchConversation();
  }, [conversationId]);

  const fetchNextComment = async () => {
    if (!conversationId) {
      setError('Invalid URL');
      return;
    }

    const response = await getNextComment(conversationId);

    if (response) {
      setComment({
        ...response.comment,
        number: response.num_votes + 1,
      });
    } else {
      setComment(null);
    }
  };

  useEffect(() => {
    if (conversation) {
      fetchNextComment();
    }
  }, [conversation]);

  const handleVote = async (commentId: string, value: number) => {
    if (!conversationId) {
      setError('Invalid URL');
      return;
    }

    const response = await createVote(commentId, value);

    if (response) {
      fetchNextComment();
    } else {
      setError('Failed to vote');
    }
  };

  return (
    <CoreBase>
      <div className='flex w-screen h-full'>
        <div className='flex flex-col w-full h-full'>
          <div className='flex flex-col w-full bg-gray-100 border-b'>
            <div className='flex items-center justify-between px-8 p-4 bg-blue-600 text-white'>
              <h1 className='text-xl font-bold'>{conversation?.name}</h1>
              <h3 className='text-sm text-gray-100'>
                By {conversation?.author?.username}
              </h3>
            </div>
            <div className='flex items-center justify-between px-8 p-4'>
              <p className='text-sm text-gray-500'>
                {conversation?.description}
              </p>
            </div>
          </div>
          <div className='flex flex-col w-full p-16 justify-center items-center'>
            {loading && <p className='text-center'>Loading...</p>}
            {error && <p className='text-center text-red-500'>{error}</p>}
            {comment && (
              <div className='w-3/4 rounded shadow-xl border'>
                <div className='flex items-center justify-between bg-blue-600 p-2 px-3 text-white'>
                  <h2 className='text-sm font-semibold'>
                    Comment #{comment?.number}
                  </h2>
                </div>
                <div className='flex flex-col p-5'>
                  <p className='font-semibold text-2xl text-center italic'>
                    {comment?.content}
                  </p>
                  <div className='flex items-center justify-center mt-4'>
                    <div
                      className='bg-green-500 mx-2 pl-2 pr-4 py-1 rounded text-white mt-4 cursor-pointer'
                      onClick={() => handleVote(comment.id, 1)}>
                      <CheckIcon className='w-5 h-5 inline mr-2' />
                      Agree
                    </div>
                    <div
                      className='bg-red-500 mx-2 pl-2 pr-4 py-1 rounded text-white mt-4 cursor-pointer'
                      onClick={() => handleVote(comment.id, -1)}>
                      <XMarkIcon className='w-5 h-5 inline mr-2' />
                      Disagree
                    </div>
                    <div
                      className='bg-gray-500 mx-2 pl-2 pr-4 py-1 rounded text-white mt-4 cursor-pointer'
                      onClick={() => handleVote(comment.id, 0)}>
                      <ForwardIcon className='w-5 h-5 inline mr-2' />
                      Skip
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col w-full h-full bg-emerald-100'></div>
      </div>
    </CoreBase>
  );
};

export default ConversationPage;
