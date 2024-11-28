import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoreBase from "./base";
import {
  addComment,
  getConversation,
  voteComment,
} from "../../components/api/conversation";
import {
  CheckCircleIcon,
  ChevronDoubleRightIcon,
  XCircleIcon,
} from "@heroicons/react/16/solid";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Button, Textarea } from "@headlessui/react";

interface Comment {
  id: string;
  content: string;
  vote: number;
}

interface Conversation {
  id: string;
  name: string;
  description: string;
  comments: Comment[];
  graph: { x: number; y: number }[];
}

const TooltipContent = (props) => {
  console.log(props);
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <p className="text-lg">
        {props.payload[0]?.payload.x.toPrecision(3)},{" "}
        {props.payload[0]?.payload.y.toPrecision(3)}
      </p>
    </div>
  );
};

const ConversationPage = () => {
  const { id } = useParams();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [unvotedLength, setUnvotedLength] = useState(0);
  const [comment, setComment] = useState<Comment | null>(null);
  const [content, setContent] = useState("");
  const [commentAdded, setCommentAdded] = useState(false);

  const fetchConversation = async () => {
    if (!id) {
      return;
    }

    try {
      const data = await getConversation(id);
      setConversation(data);
    } catch (error) {
      console.error("Error fetching conversation");
    }
  };

  const handleVote = async (id: string, vote: number) => {
    try {
      await voteComment(id, vote);
      await fetchConversation();
    } catch (error) {
      console.error("Error voting on comment");
    }
  };

  const handleAddComment = async () => {
    if (!id || !content) {
      return;
    }

    try {
      await addComment(id, content);
      setContent("");
      setCommentAdded(true);
    } catch (error) {
      console.error("Error adding comment");
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [id]);

  useEffect(() => {
    if (conversation) {
      const unvoted = conversation.comments.filter(
        (comment) => comment.vote === null
      );
      setUnvotedLength(unvoted.length);
      if (unvoted.length > 0) setComment(unvoted[0]);
      else setComment(null);
    }
  }, [conversation]);

  return (
    <CoreBase>
      <div className="h-full w-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 lg:h-full lg:p-8">
          <div className="w-full h-full flex flex-col p-8">
            <h4 className="text-xl font-bold mb-4">Conversation</h4>
            <h1 className="text-4xl font-bold mb-4">{conversation?.name}</h1>
            <p className="mb-4">{conversation?.description}</p>
            <hr className="mb-4" />
            <h4 className="text-xl font-bold mb-4">Comments</h4>
            {comment ? (
              <>
                <p className="mb-4">{unvotedLength} remaining votes</p>
                <div className="flex flex-col mb-4 p-4 bg-gray-100 rounded-lg">
                  <p className="mb-4">{comment.content}</p>
                  <div className="flex items-center">
                    <Button
                      className="bg-green-500 text-white mr-4"
                      onClick={() => handleVote(comment.id, 1)}
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Agree
                    </Button>
                    <Button
                      className="bg-red-500 text-white mr-4"
                      onClick={() => handleVote(comment.id, -1)}
                    >
                      <XCircleIcon className="h-4 w-4 mr-2" />
                      Disagree
                    </Button>
                    <Button
                      className="bg-gray-400 text-white"
                      onClick={() => handleVote(comment.id, 0)}
                    >
                      <ChevronDoubleRightIcon className="h-4 w-4 mr-2" />
                      Pass
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="mb-4">
                  No more comments to vote on. Add your own comment:
                </p>
                <Textarea
                  className="mb-4 bg-gray-100 rounded-md p-2"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <Button
                  className="bg-sky-500 text-white"
                  onClick={handleAddComment}
                >
                  Add Comment
                </Button>
                {commentAdded && <p className="text-green-500 mt-3">Comment added successfully!</p>}
              </>
            )}
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:h-full p-8">
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <div className="w-full flex flex-col items-center mb-4 w-full sm:h-2/3 sm:w-2/3">
              <ResponsiveContainer width="80%" aspect={1}>
                <ScatterChart data={conversation?.graph}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" unit="" hide />
                  <YAxis type="number" dataKey="y" unit="" hide />
                  <Tooltip
                    content={(props: any) => <TooltipContent {...props} />}
                  />
                  <Scatter type="monotone" dataKey="y" stroke="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </CoreBase>
  );
};

export default ConversationPage;
