import { useEffect, useMemo, useState } from "react";
import CoreBase from "../../app/core/base";
import {
  Comment,
  Conversation,
  ParticipationComment,
} from "../../app/core/dashboard";
import CommentConfig from "../admin/comments/CommentConfig";
import { VotingSection } from "./VotingSection";
import { PlusIcon } from "@heroicons/react/24/solid";

export const ParticipationSpa = ({
  conversation,
  currentComment,
  comments,
  onVoteComplete,
  onComplete,
}: {
  conversation?: Conversation;
  currentComment?: {
    comment: ParticipationComment;
    num_votes: number;
  };
  comments?: Comment[];
  onVoteComplete: Function;
  onComplete: Function;
}) => {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);

  const amountOfVotedComments = useMemo(() => {
    return currentComment?.num_votes ?? 0;
  }, [currentComment]);

  useEffect(() => {
    setDialog(document.getElementById("comment-dialog") as HTMLDialogElement);
  }, []);

  const handleEditClick = (state: boolean) => {
    if (state) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  };
  const onVote = (commentId: string, vote: "agree" | "disagree" | "skip") => {
    if (onVoteComplete) {
      onVoteComplete(commentId, vote);
    }
  };
  const onFormComplete = (event: React.FormEvent<HTMLFormElement>) => {
    handleEditClick(false);

    if (onComplete) {
      onComplete(event);
    }
  };

  return (
    <CoreBase>
      <main className="w-[95%] mx-auto">
        <section className="p-8">
          <h1 className="text-3xl font-bold mb-4">{conversation?.name}</h1>
          <p className="mb-4">{conversation?.description}</p>
        </section>
        <section
          className="p-8 bg-background w-full flex flex-col"
          aria-labelledby="active-comment-header"
        >
          <div className="flex justify-between items-center">
            <h2
              id="active-comment-header"
              className="font-semibold text-secondary mb-4"
            >
              Active Comments
            </h2>
            <button
              onClick={() => handleEditClick(true)}
              className="flex mb-4 bg-white border border-gray-300 p-2 w-min whitespace-nowrap items-center justify-center gap-x-2 rounded-xl"
            >
              <PlusIcon height={30} width={30} /> Add Comment
            </button>
          </div>

          {currentComment ? (
            <VotingSection
              comment={currentComment.comment}
              commentNumber={amountOfVotedComments + 1}
              onVote={onVote}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl">
              <p className="text-gray-500">No more comments to review.</p>
            </div>
          )}
          <p className="text-center pt-6">
            {amountOfVotedComments + 1} of {comments?.length} comments
          </p>
        </section>
      </main>
      {!!conversation?.id && (
        <dialog
          id="comment-dialog"
          className="m-[revert] p-[revert] border-2 backdrop:bg-primary backdrop:opacity-80"
        >
          <button
            className="border-2 px-2 py-2 rounded-xl flex flex-row items-center gap-x-2 ml-auto"
            autoFocus
            onClick={() => handleEditClick(false)}
          >
            Close
          </button>
          <CommentConfig
            onComplete={onFormComplete}
            conversationId={conversation.id}
          />
        </dialog>
      )}
    </CoreBase>
  );
};
