import { useParams } from "react-router";
import CoreBase from "./base";
import {
  createComment,
  createVote,
  getConversation,
  getNextComment,
} from "../../components/api/conversation";
import { useEffect, useState } from "react";
import { CheckIcon, ForwardIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Button, Input, Legend } from "@headlessui/react";
import { getConversationWithConsensus } from "../../components/api/analysis";
import { Conversation } from "./dashboard";
import { useQuery } from "@tanstack/react-query";

type Comment = { content: string; id: string };

const VoteCounter = ({ counts }) => {
  return (
    <div className="flex items-center space-x-2">
      Vote counter placeholder&#9646;
    </div>
  );
};

const CurrentComment = ({
  comment = { content: "test comment placeholder", id: "placeholder" },
  commentIndex = 0,
  onComplete,
}: {
  comment: Comment;
  commentIndex: number;
  onComplete: Function;
}) => {
  const handleVote = async (voteType) => {
    if (!comment) return;
    await createVote(comment.id, voteType).then((response) => {
      if (response) {
        onComplete();
      } else {
        console.error("Failed to process the vote. Please try again.");
        alert(
          "An error occurred while processing your vote. Please try again.",
        );
      }
    });
  };

  return (
    <div className="flex flex-col mx-auto w-full">
      <h4 className="text-md font-bold mb-2">Comment {commentIndex + 1}</h4>
      <time>12, June 2025</time>
      <p id="comment-description" className="text-gray-800 min-h-20">
        {comment?.content}
      </p>
      <div
        id="comment-actions"
        className="flex w-full items-center gap-4 mb-4 flex-wrap"
      >
        <Button
          onClick={() => handleVote(1)}
          className="bg-gray-500 hover:bg-secondary text-white rounded-md flex items-center flex-wrap gap-3 p-2 rounded-2"
        >
          <CheckIcon className="h-5 w-5" />
          Agree
        </Button>
        <Button
          onClick={() => handleVote(-1)}
          className="bg-gray-500 hover:bg-secondary text-white rounded-md flex items-center flex-wrap gap-3 p-2 rounded-2"
        >
          <XMarkIcon className="h-5 w-5" />
          Disagree
        </Button>
        <Button
          onClick={() => handleVote(0)}
          className="bg-gray-500 hover:bg-secondary text-white rounded-md flex items-center flex-wrap gap-3 p-2 rounded-2 ml-auto"
        >
          <ForwardIcon className="h-5 w-5" />
          Pass
        </Button>
      </div>
    </div>
  );
};

const CommentSection = ({ conversation }: { conversation: Conversation }) => {
  const [commentIndex, setCommentIndex] = useState(0);
  const [comment, setComment] = useState<Comment | undefined>(undefined);

  const nextComment = async () => {
    await getNextComment(conversation.id).then((response) => {
      if (response) {
        setComment({
          ...response.comment,
          number: response.num_votes + 1,
        });
      } else {
        setComment(undefined);
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
    <section className="flex flex-1 flex-col w-full h-full bg-background rounded-lg py-8 px-4">
      <div className="flex w-full justify-between items-center mb-8">
        <h2 className="font-semibold text-secondary">Active Comments</h2>
        <Button
          id="add-comment"
          onClick={openCreateCommentModal}
          className="bg-white border-black border text-black px-4 py-2 rounded-sm"
        >
          + Add Comment
        </Button>
      </div>
      <div className="flex flex-col space-y-8 p-4 bg-white rounded-lg">
        <VoteCounter counts={{ agrees: 0, disagrees: 0 }} />
        {comment && (
          <CurrentComment
            comment={comment}
            commentIndex={commentIndex}
            onComplete={nextComment}
          />
        )}
      </div>
    </section>
  );
};

const ConversationPage = () => {
  const { conversationId } = useParams();

  const [newComment, setNewComment] = useState<string>("");

  const conversation = useQuery<Conversation>({
    queryKey: [""],
    queryFn: async () => {
      if (!conversationId) throw new Error("Invalid URL");
      return await getConversation(conversationId);
    },
  }).data;

  return (
    <CoreBase>
      <div
        id="converstion-container"
        className="flex flex-col h-full py-8 w-[95%] max-w-4xl mx-auto"
      >
        <h1 id="topic" className="text-3xl font-bold mb-4 text-gray-900">
          {conversation?.name}
        </h1>
        <p id="description" className="mb-16">
          {conversation?.description}
        </p>
        <main className="flex space-x-16 mb-8 w-full  flex-col md:flex-row">
          {conversation && <CommentSection conversation={conversation} />}
          <div className="flex-1"></div>
        </main>
      </div>
    </CoreBase>
  );
};

export default ConversationPage;
