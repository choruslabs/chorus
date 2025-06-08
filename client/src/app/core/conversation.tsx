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
import { getConversationWithConsensus } from '../../components/api/analysis';

const VoteCounter = ({ counts }) => {
  return <div className='flex items-center space-x-2'>&#9646;</div>;
};

const CurrentComment = ({ comment, commentIndex, onComplete }) => {
  const handleVote = async (voteType) => {
    if (!comment) return;
    await createVote(comment.id, voteType).then((response) => {
      if (response) {
        onComplete();
      } else {
        console.error('Failed to process the vote. Please try again.');
        alert('An error occurred while processing your vote. Please try again.');
      }
    });
  };

  return (
    <div className='flex flex-col p-4'>
      <h4 className='text-md font-bold mb-2'>Comment {commentIndex + 1}</h4>
      <p className='text-gray-800 mb-4'>{comment?.content}</p>
      <div className='flex items-center space-x-4 mb-4'>
        <Button
          onClick={() => handleVote(1)}
          className='bg-primary text-white flex items-center'>
          <CheckIcon className='h-5 w-5 mr-3' />
          Agree
        </Button>
        <Button
          onClick={() => handleVote(-1)}
          className='bg-primary text-white flex items-center'>
          <XMarkIcon className='h-5 w-5 mr-3' />
          Disagree
        </Button>
        <Button
          onClick={() => handleVote(0)}
          className='bg-primary text-white flex items-center'>
          <ForwardIcon className='h-5 w-5 mr-3' />
          Pass
        </Button>
      </div>
    </div>
  );
};

const CommentSection = ({ conversation }) => {
  const [commentIndex, setCommentIndex] = useState(0);
  const [comment, setComment] = useState<any>(null);

  const nextComment = async () => {
    await getNextComment(conversation.id).then((response) => {
      if (response) {
        setComment({
          ...response.comment,
          number: response.num_votes + 1,
        });
      } else {
        setComment(null);
      }
    });
  };

  const openCreateCommentModal = () => {
    // Logic to open modal for creating a new comment
  };

  useEffect(() => {
    nextComment();
  }, [conversation]);

  return (
    <div className='flex flex-col w-full h-full p-4 bg-background rounded-lg p-8'>
      <div className='flex w-full justify-between items-center mb-8'>
        <p className='font-semibold text-secondary'>Active Comments</p>
        <Button
          onClick={openCreateCommentModal}
          className='bg-white border-black border-1 text-black px-4 py-2 rounded'>
          Add Comment
        </Button>
      </div>
      <div className='flex flex-col space-y-8 p-4 bg-white rounded-lg'>
        <VoteCounter counts={{ agrees: 0, disagrees: 0 }} />
        <CurrentComment
          comment={comment}
          commentIndex={commentIndex}
          onComplete={nextComment}
        />
      </div>
    </div>
  );
};

const ConversationPage = () => {
  const { conversationId } = useParams();

  const [conversation, setConversation] = useState<any>(null);

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
  }, [conversationId]);

  return (
    <CoreBase>
      <div className='flex flex-col w-full h-full p-8 md:p-24'>
        <h1 className='text-3xl font-bold mb-4'>{conversation?.name}</h1>
        <p className='text-gray-600 mb-16'>{conversation?.description}</p>
        <div className='flex space-x-16 mb-8'>
          <div className='w-1/2'>
            <CommentSection conversation={conversation} />
          </div>
          <div></div>
        </div>
      </div>
    </CoreBase>
  );
};

export default ConversationPage;
