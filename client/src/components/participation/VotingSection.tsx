import { CheckIcon, ForwardIcon, XMarkIcon } from '@heroicons/react/24/solid';
import type { ReactNode } from 'react';
import type { ParticipationComment } from '../../app/core/dashboard';

const Spinner = ({ className = '' }: { className?: string }) => (
  <svg
    className={`animate-spin h-4 w-4 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

type VoteButtonState = 'idle' | 'loading' | 'disabled';

type VoteButtonProps = {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  state?: VoteButtonState;
  variant?: 'default' | 'secondary';
};

export const VoteButton = ({
  label,
  icon,
  onClick,
  state = 'idle',
  variant = 'default',
}: VoteButtonProps) => {
  const isDisabled = state !== 'idle';
  const isLoading = state === 'loading';

  const baseStyles =
    'relative inline-flex items-center gap-2 px-3 py-2 rounded-xl border font-medium transition-colors duration-150';

  const variantStyles =
    variant === 'secondary'
      ? 'border-gray-300 text-gray-700 hover:bg-primary hover:text-white'
      : 'border-gray-300 hover:bg-primary hover:text-white';

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      aria-busy={isLoading}
      className={`${baseStyles} ${variantStyles} ${
        isDisabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}>
      {isLoading ? <Spinner /> : icon}
      <span>{label}</span>
    </button>
  );
};

export const VotingSection = ({
  comment,
  commentNumber,
  onVote,
  isVotingDisabled,
  pendingVote,
}: {
  comment: ParticipationComment | null;
  commentNumber?: number;
  onVote: (commentId: string, vote: 'agree' | 'disagree' | 'skip') => void;
  isVotingDisabled: boolean;
  pendingVote: 'agree' | 'disagree' | 'skip' | null;
}) => {
  return (
    comment && (
      <div className="flex flex-col items-start gap-4 p-4 bg-white rounded-xl w-full">
        <div className="flex flex-col items-start gap-2 mb-2">
          <h3 className="font-semibold">Comment {commentNumber}</h3>
          <p className="text-gray-700 text-2xl font-bold">{comment.content}</p>
          {/* <time className="text-gray-500">(time here)</time> */}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center w-full gap-2">
          <div className="flex gap-2">
            <VoteButton
              label="Agree"
              icon={<CheckIcon className="h-5 w-5" />}
              onClick={() => onVote(comment.id, 'agree')}
              state={
                isVotingDisabled
                  ? pendingVote === 'agree'
                    ? 'loading'
                    : 'disabled'
                  : 'idle'
              }
            />

            <VoteButton
              label="Disagree"
              icon={<XMarkIcon className="h-5 w-5" />}
              onClick={() => onVote(comment.id, 'disagree')}
              state={
                isVotingDisabled
                  ? pendingVote === 'disagree'
                    ? 'loading'
                    : 'disabled'
                  : 'idle'
              }
            />
          </div>

          <div className="sm:ml-auto">
            <VoteButton
              label="Skip"
              icon={<ForwardIcon className="h-5 w-5" />}
              onClick={() => onVote(comment.id, 'skip')}
              variant="secondary"
              state={
                isVotingDisabled
                  ? pendingVote === 'skip'
                    ? 'loading'
                    : 'disabled'
                  : 'idle'
              }
            />
          </div>
        </div>
      </div>
    )
  );
};
