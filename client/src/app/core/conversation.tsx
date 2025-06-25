import { useParams } from 'react-router';
import CoreBase from './base';
import {
  createComment,
  createVote,
  getConversation,
  getNextComment,
} from '../../components/api/conversation';
import { useEffect, useState } from 'react';
import {
  CheckIcon,
  ForwardIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { Button, Input, Legend } from '@headlessui/react';
import { getConversationWithConsensus } from '../../components/api/analysis';
import { Conversation } from './dashboard';
import { useQuery } from '@tanstack/react-query';

type Comment = { content: string; id: string };

const VotingSection = ({
  comment,
  numVotes,
  onVote,
}: {
  comment: Comment | null;
  numVotes?: number;
  onVote: (commentId: string, vote: 'agree' | 'disagree' | 'skip') => void;
}) => {
  return (
    comment && (
      <div className='flex flex-col items-start gap-4 p-4 bg-white rounded-xl'>
        <div className='flex flex-col items-start gap-2 mb-2'>
          <p className='text-lg font-semibold'>Comment {numVotes}</p>
          <p className='text-gray-700'>{comment.content}</p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            onClick={() => onVote(comment.id, 'agree')}
            className='bg-primary hover:bg-green-600 text-white px-2 py-2 rounded-xl flex flex-row items-center gap-x-2'>
            <CheckIcon className='h-5 w-5' />
            Agree
          </Button>
          <Button
            onClick={() => onVote(comment.id, 'disagree')}
            className='bg-primary hover:bg-red-600 text-white px-2 py-2 rounded-xl flex flex-row items-center gap-x-2'>
            <XMarkIcon className='h-5 w-5' />
            Disagree
          </Button>
          <Button
            onClick={() => onVote(comment.id, 'skip')}
            className='bg-background hover:bg-gray-600 px-2 py-2 rounded-xl flex flex-row items-center gap-x-2 border border-gray-300 text-gray-700'>
            <ForwardIcon className='h-5 w-5' />
            Skip
          </Button>
        </div>
      </div>
    )
  );
};

const ConversationPage = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [currentComment, setCurrentComment] = useState<Comment | null>(null);
  const [numVotes, setNumVotes] = useState<number>(0);

  const nextComment = async () => {
    if (!conversationId) return;

    const { comment, num_votes } = await getNextComment(conversationId);
    setCurrentComment(comment);
    setNumVotes(num_votes + 1);
  };

  useEffect(() => {
    const fetchConversation = async () => {
      if (!conversationId) return;

      const data = await getConversation(conversationId);
      setConversation(data);
    };

    fetchConversation();
    nextComment();
  }, [conversationId]);

  const openAddCommentModal = () => {
    // Logic to open a modal for adding a comment
  };

  const onVote = async (
    commentId: string,
    vote: 'agree' | 'disagree' | 'skip'
  ) => {
    const voteNum = vote === 'agree' ? 1 : vote === 'disagree' ? -1 : 0;

    if (!conversationId) return;
    await createVote(commentId, voteNum);
    await nextComment();
  };

  return (
    <CoreBase>
      <div>
        <div className='p-8'>
          <h1 className='text-3xl font-bold mb-4'>{conversation?.name}</h1>
          <p className='mb-4'>{conversation?.description}</p>
        </div>
        <div className='p-8 bg-background'>
          <p className='font-semibold text-secondary mb-4'>Comments</p>
          <Button
            onClick={openAddCommentModal}
            className='flex mb-4 bg-white border border-gray-300 p-2 w-full items-center justify-center gap-x-2 rounded-xl'>
            <PlusIcon height={30} width={30} /> Add Comment
          </Button>
          <VotingSection
            comment={currentComment}
            numVotes={numVotes}
            onVote={onVote}
          />
        </div>
      </div>
    </CoreBase>
  );
};

export default ConversationPage;
