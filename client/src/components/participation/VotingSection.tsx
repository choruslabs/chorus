import { CheckIcon, ForwardIcon, XMarkIcon } from "@heroicons/react/24/solid";
import type { ParticipationComment } from "../../app/core/dashboard";

export const VotingSection = ({
  comment,
  commentNumber,
  onVote,
  isVotingDisabled,
}: {
  comment: ParticipationComment | null;
  commentNumber?: number;
  onVote: (commentId: string, vote: "agree" | "disagree" | "skip") => void;
  isVotingDisabled: boolean;
}) => {
  return (
    comment && (
      <div className="flex flex-col items-start gap-4 p-4 bg-white rounded-xl">
        <div className="flex flex-col items-start gap-2 mb-2">
          <h3 className="font-semibold">Comment {commentNumber}</h3>
          <p className="text-gray-700 text-2xl font-bold">{comment.content}</p>
          <time className="text-gray-500">(time here)</time>
        </div>
        <div className="flex items-center gap-2 w-full flex-wrap">
          <button
            type="button"
            disabled={isVotingDisabled}
            onClick={() => onVote(comment.id, "agree")}
            className="border hover:bg-primary hover:text-white px-2 py-2 rounded-xl flex flex-row items-center gap-x-2"
          >
            <CheckIcon className="h-5 w-5" />
            Agree
          </button>
          <button
            type="button"
            disabled={isVotingDisabled}
            onClick={() => onVote(comment.id, "disagree")}
            className="border hover:bg-primary hover:text-white px-2 py-2 rounded-xl flex flex-row items-center gap-x-2"
          >
            <XMarkIcon className="h-5 w-5" />
            Disagree
          </button>
          <button
            type="button"
            disabled={isVotingDisabled}
            onClick={() => onVote(comment.id, "skip")}
            className="bg-background px-2 py-2 rounded-xl flex flex-row items-center gap-x-2 border border-gray-300 text-gray-700 hover:bg-primary hover:text-white ml-auto"
          >
            Skip
            <ForwardIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    )
  );
};
