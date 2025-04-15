import { useParams } from 'react-router-dom';
import CoreBase from './base';
import {
  createComment,
  createVote,
  getConversation,
  getNextComment,
} from '../../components/api/conversation';
import { useEffect, useState } from 'react';
import { CheckIcon, ForwardIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Button, Input, Legend } from '@headlessui/react';
import { getConversationGroups } from '../../components/api/analysis';

const ConversationPage = () => {
  const { conversationId } = useParams();

  const [conversation, setConversation] = useState<any>(null);
  const [comment, setComment] = useState<any>(null);

  const [groups, setGroups] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newComment, setNewComment] = useState<string>('');

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
    fetchAnalysis();
  }, [conversationId]);

  const fetchAnalysis = async () => {
    if (!conversationId) {
      setError('Invalid URL');
      return;
    }

    const response = await getConversationGroups(conversationId);

    if (response) {
      setGroups(response);
    } else {
      setError('Failed to fetch analysis');
    }
  };

  const fetchNextComment = async () => {
    if (!conversationId) {
      setError('Invalid URL');
      return;
    }

    const response = await getNextComment(conversationId).catch((err) => {
      if (err.status === 404) {
        setComment(null);
        return;
      }
    });

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

  const handleSubmitComment = async () => {
    if (!conversationId) {
      setError('Invalid URL');
      return;
    }

    const response = await createComment(conversationId, newComment);

    if (response) {
      setNewComment('');
    } else {
      setError('Failed to submit comment');
    }
  };

  return (
    <CoreBase>
      <div className='flex w-screen h-full'>
        <div className='flex flex-col w-full h-full'>
          <div className='flex flex-col w-full bg-gray-100 border-b'>
            <div className='flex items-center justify-between px-8 p-4 bg-emerald-600 text-white'>
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
          <div className='flex flex-col w-full p-16 justify-center grow'>
            {loading && <p className='text-center'>Loading...</p>}
            {error && <p className='text-center text-red-500'>{error}</p>}
            {comment ? (
              <div className='flex items-center justify-around w-full'>
                <div className='mx-5 rounded-xl shadow-xl border'>
                  <div className='flex flex-col p-5'>
                    <p className='text-gray-500 text-sm'>#{comment?.number}</p>
                    <p className='font-semibold text-xl mt-2 w-96'>
                      {comment?.content}
                    </p>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <div
                    className='bg-green-500 mx-2 pl-2 pr-4 py-0.5 rounded-xl text-white mb-3 w-fit cursor-pointer'
                    onClick={() => handleVote(comment.id, 1)}>
                    <CheckIcon className='w-5 h-5 inline mr-2' />
                    Agree
                  </div>
                  <div
                    className='bg-red-500 mx-2 pl-2 pr-4 py-0.5 rounded-xl text-white mb-3 w-fit cursor-pointer'
                    onClick={() => handleVote(comment.id, -1)}>
                    <XMarkIcon className='w-5 h-5 inline mr-2' />
                    Disagree
                  </div>
                  <div
                    className='bg-gray-500 mx-2 pl-2 pr-4 py-0.5 rounded-xl text-white w-fit cursor-pointer'
                    onClick={() => handleVote(comment.id, 0)}>
                    <ForwardIcon className='w-5 h-5 inline mr-2' />
                    Skip
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-center w-full'>
                <p className='text-gray-500 text-sm'>No more comments</p>
              </div>
            )}
            {!loading && !error && (
              <div className='flex items-center justify-around mt-16'>
                <Input
                  className='w-full max-w-md p-2 border rounded shadow'
                  placeholder='Add a comment...'
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmitComment();
                    }
                  }}
                />
                <Button
                  className='bg-emerald-600 text-white p-2 rounded'
                  onClick={handleSubmitComment}>
                  Submit
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col w-full h-full bg-emerald-500 p-16'>
          <div className='flex flex-col w-full h-full bg-gray-100 border-b'>
            <div className='flex flex-col px-8 p-4 bg-emerald-600 text-white'>
              <h1 className='text-xl font-bold'>Groups</h1>
            </div>
            <div className='flex flex-col w-full h-full p-4 overflow-y-auto'>
              {groups && (
                <>
                  <h3 className='text-sm text-gray-100'>
                    {groups.length} groups
                  </h3>
                  {groups.map((group: any, index: number) => (
                    <>
                      <div
                        key={group.id}
                        className='flex items-center justify-between px-4 p-2 bg-gray-200 border-b mb-3'>
                        <p className='text-sm text-gray-800'>
                          Group {index + 1}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {group.user_ids.length} members
                        </p>
                        <p className='text-sm text-gray-800'>
                          Variance:{' '}
                          <span className='font-semibold text-lg'>
                            {group.variance.toFixed(2)}
                          </span>
                        </p>
                      </div>
                      <div className='flex items-center justify-between px-4 p-2 bg-gray-100 border-b mb-3'>
                        <p className='text-sm text-gray-800'>Top comments</p>
                        <p className='text-sm text-gray-600'>
                          {group.top_comments.length} comments
                        </p>
                      </div>
                      <div className='flex flex-col px-4 p-2 bg-gray-100 border-b mb-3'>
                        {group.top_comments.map((comment: any) => (
                          <div className='flex items-center justify-between'>
                            <p className='text-md'>{comment.content}</p>
                            <span className='text-sm text-gray-600 font-semibold'>
                              {comment.consensus.toFixed(2) * 100}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </CoreBase>
  );
};

export default ConversationPage;
