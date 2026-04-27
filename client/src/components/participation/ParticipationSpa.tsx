import { useEffect, useMemo, useState } from 'react';
import CoreBase from '../../app/core/base';
import type { ConversationCustomization } from '../../app/core/conversation';
import type {
  Comment,
  Conversation,
  ParticipationComment,
} from '../../app/core/dashboard';
import { ConversationTabs } from './ParticipationTabs';
import { VotingSection } from './VotingSection';
import { postApi } from '../api/base';
import { useNotification } from '../ui/NotificationProvider';

export const ParticipationSpa = ({
  conversation,
  customization,
  currentComment,
  comments,
  onVoteComplete,
  onComplete,
  isVotingDisabled,
  pendingVote,
}: {
  conversation?: Conversation;
  customization?: ConversationCustomization;
  currentComment?: {
    comment: ParticipationComment;
    num_votes: number;
  };
  comments?: Comment[];
  onVoteComplete: (
    commentId: string,
    vote: 'agree' | 'disagree' | 'skip'
  ) => void;
  onComplete: (event?: React.FormEvent<HTMLFormElement>) => void;
  isVotingDisabled: boolean;
  pendingVote: 'agree' | 'disagree' | 'skip' | null;
}) => {
  const [comment, setComment] = useState('');
  const { notify } = useNotification();

  const amountOfVotedComments = useMemo(() => {
    return currentComment?.num_votes ?? 0;
  }, [currentComment]);

  const onVote = (commentId: string, vote: 'agree' | 'disagree' | 'skip') => {
    if (onVoteComplete) {
      onVoteComplete(commentId, vote);
    }
  };

  const onSubmitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!conversation) {
      notify('Cannot load conversation. Please try again.', 'error');
      return;
    }

    try {
      await postApi(`/conversations/${conversation.id}/comments`, {
        content: comment,
      });
      setComment('');
      notify(
        'Your comment has been submitted. Other participants will start voting on it.',
        'success'
      );
    } catch (error) {
      notify('Failed to submit comment. Please try again.', 'error');
      // Re-throw to prevent dialog from closing on error
      throw error;
    }

    if (onComplete) {
      onComplete(event);
    }
  };

  return (
    <CoreBase
      headerName={customization?.header_name}
      tabs={
        conversation?.id && (
          <ConversationTabs
            conversationId={conversation?.id}
            currentTab="participate"
          />
        )
      }
      requiresLogin={false}>
      <main className="w-[95%] min-h-full mx-auto flex flex-col">
        <section className="px-8 py-12">
          <h1 className="text-3xl font-bold mb-2">{conversation?.name}</h1>
          <div
            className="h-0.5 w-12 mb-4"
            style={{ backgroundColor: customization?.theme_color }}
          />
          <p className="mb-4 text-gray-700">{conversation?.description}</p>
          {/* {customization?.knowledge_base_content && (
            // <KnowledgeBaseDialog
            //   markdownContent={customization?.knowledge_base_content}
            // />
          )} */}
        </section>
        <div className="flex flex-col grow items-center mb-4">
          {conversation?.is_active === false ? (
            <div className="p-4 mb-4 bg-yellow-100 border border-yellow-300 rounded-lg w-full xl:w-1/2 text-center">
              <p className="text-yellow-800">
                This conversation is currently inactive and not accepting
                participation.
              </p>
            </div>
          ) : (
            <>
              <section
                className="
                  w-full xl:w-1/2
                  rounded-2xl
                  border-2 border-gray-200
                  bg-gray-50
                  p-6
                  flex flex-col
                  gap-4
                  mb-6
                ">
                <div className="flex items-center justify-between">
                  <h2
                    id="active-comment-header"
                    className="text-base font-semibold text-gray-800">
                    Active statements
                  </h2>

                  {!!currentComment && (
                    <p className="text-sm text-gray-500 text-center">
                      {amountOfVotedComments + 1} of {comments?.length}{' '}
                      statements
                    </p>
                  )}
                </div>
                <div className="flex grow flex-col justify-center gap-3">
                  {currentComment ? (
                    <>
                      <p className="text-sm text-gray-500">
                        Do you agree or disagree with this statement?
                      </p>
                      <VotingSection
                        comment={currentComment.comment}
                        commentNumber={amountOfVotedComments + 1}
                        onVote={onVote}
                        isVotingDisabled={isVotingDisabled}
                        pendingVote={pendingVote}
                      />
                    </>
                  ) : (
                    <p className="text-base text-gray-600 text-center">
                      No more statements to review.
                    </p>
                  )}
                </div>
              </section>
              <section
                className="
                  w-full xl:w-1/2
                  border border-gray-100 bg-gray-50/50
                  p-6
                  flex flex-col
                  gap-3
                ">
                <h3 className="text-base font-semibold text-gray-800">
                  Add your own statement
                </h3>

                <p className="text-sm text-gray-600">
                  Write a clear opinion that others can agree or disagree with.
                </p>

                <form
                  onSubmit={onSubmitComment}
                  className="flex flex-col gap-3"
                  aria-label="Add your own statement form">
                  <textarea
                    name="newComment"
                    id="newComment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    required
                    placeholder="Write your statement here..."
                    className="
                      w-full
                      min-h-[96px]
                      p-3
                      border border-gray-300
                      rounded-lg
                      focus:outline-none
                      focus:ring-2 focus:ring-blue-500
                      bg-white
                      resize-y
                    "
                    aria-describedby="comment-help comment-count"
                  />

                  <button
                    type="submit"
                    disabled={comment.trim() === ''}
                    className={`
                      self-start
                      px-4 py-2
                      ${
                        !customization?.theme_color &&
                        'bg-blue-600 hover:bg-blue-700'
                      }
                      text-white
                      rounded-lg
                      disabled:bg-gray-300 disabled:cursor-not-allowed
                      transition-colors
                    `}
                    style={{ backgroundColor: customization?.theme_color }}>
                    Add statement
                  </button>
                </form>
              </section>
            </>
          )}
        </div>
      </main>
    </CoreBase>
  );
};
