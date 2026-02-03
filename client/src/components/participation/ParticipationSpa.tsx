import { useEffect, useMemo, useState } from "react";
import CoreBase from "../../app/core/base";
import type { ConversationCustomization } from "../../app/core/conversation";
import type {
  Comment,
  Conversation,
  ParticipationComment,
} from "../../app/core/dashboard";
import { NewCommentDialog } from "../admin/comments/CommentDialog";
// import { KnowledgeBaseDialog } from "../KnowledgeBaseDialog";
import { ConversationTabs } from "./ParticipationTabs";
import { VotingSection } from "./VotingSection";

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
    vote: "agree" | "disagree" | "skip",
  ) => void;
  onComplete: (event?: React.FormEvent<HTMLFormElement>) => void;
  isVotingDisabled: boolean;
  pendingVote: "agree" | "disagree" | "skip" | null;
}) => {
  // storing an HTML dialog element in state
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
  useEffect(() => {
    setDialog(document.getElementById("comment-dialog") as HTMLDialogElement);
  }, []);

  const amountOfVotedComments = useMemo(() => {
    return currentComment?.num_votes ?? 0;
  }, [currentComment]);

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
  const onFormComplete = (event?: React.FormEvent<HTMLFormElement>) => {
    handleEditClick(false);

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
      requiresLogin={false}
    >
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
            <section
              className="
                w-full xl:w-1/2
                rounded-2xl
                border-2 border-gray-200
                bg-gray-50
                p-6
                flex flex-col
                gap-6
              "
            >
              <div className="flex items-center justify-between">
                <h2
                  id="active-comment-header"
                  className="text-base font-semibold text-gray-800"
                >
                  Active comments
                </h2>

                {!!conversation && (
                  <NewCommentDialog
                    conversation={conversation}
                    onComplete={onFormComplete}
                    themeColor={customization?.theme_color}
                  />
                )}
              </div>
              <div className="flex grow items-center justify-center">
                {currentComment ? (
                  <VotingSection
                    comment={currentComment.comment}
                    commentNumber={amountOfVotedComments + 1}
                    onVote={onVote}
                    isVotingDisabled={isVotingDisabled}
                    pendingVote={pendingVote}
                  />
                ) : (
                  <p className="text-base text-gray-600 text-center">
                    No more comments to review.
                  </p>
                )}
              </div>
              {!!currentComment && (
                <p className="pt-4 text-sm text-gray-500 text-center">
                  {amountOfVotedComments + 1} of {comments?.length} comments
                  reviewed
                </p>
              )}
            </section>
          )}
        </div>
      </main>
    </CoreBase>
  );
};
