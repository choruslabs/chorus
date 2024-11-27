import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseApiUrl } from "../../components/api/base";
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
import Plot from "react-plotly.js";
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

const ConversationPage = () => {
  const { id } = useParams();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [comment, setComment] = useState<Comment | null>(null);
  const [content, setContent] = useState("");

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
      if (unvoted.length > 0) setComment(unvoted[0]);
      else setComment(null);
    }
  }, [conversation]);

  return (
    <CoreBase>
      <div className="h-full w-full flex items-center justify-between p-10">
        <div className="h-full w-1/2 mr-8 bg-gray-200 flex items-center justify-center">
          {conversation?.graph && (
            <Plot
              data={[
                {
                  x: conversation.graph.map((point) => point.x),
                  y: conversation.graph.map((point) => point.y),
                  type: "scatter",
                  mode: "markers",
                  marker: { color: "indigo", size: 10 },
                },
              ]}
              layout={{ width: 600, height: 600 }}
            />
          )}
        </div>
        <div className="flex flex-col ml-8 w-1/2 h-full">
          <div className="flex flex-col items-start h-full">
            <div className="mt-12">
              <h3 className="text-xl font-bold">Conversation</h3>
              <h1 className="text-4xl font-bold">{conversation?.name}</h1>
              <p className="mt-4">{conversation?.description}</p>
            </div>
            <div className="flex flex-col mt-12 h-48 w-full">
              {comment ? (
                <>
                  <div className="flex flex-col border-l-4 border-sky-500 p-4">
                    <p>{comment.content}</p>
                  </div>
                  <div className="flex mt-4">
                    <button
                      className="bg-green-500 text-white p-1 pl-3 pr-3 rounded mr-2 flex items-center"
                      onClick={() => handleVote(comment.id, 1)}
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Agree
                    </button>
                    <button
                      className="bg-red-500 text-white p-1 pl-3 pr-3 rounded flex items-center"
                      onClick={() => handleVote(comment.id, -1)}
                    >
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Disagree
                    </button>
                    <button
                      className="bg-gray-500 text-white p-1 pl-3 pr-3 rounded ml-2 flex items-center"
                      onClick={() => handleVote(comment.id, 0)}
                    >
                      <ChevronDoubleRightIcon className="h-5 w-5 mr-2" />
                      Pass
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full flex flex-col items-start">
                  <p className="font-semibold mb-2">You are all caught up!</p>
                  <p className="mb-2">Check back later for more comments.</p>
                  <Textarea
                    className="w-4/5 h-24 mt-4 mb-6 p-2 rounded bg-gray-100"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <Button
                    className="bg-sky-500 text-white p-2 rounded"
                    onClick={handleAddComment}
                  >
                    Add comment
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CoreBase>
  );
};

export default ConversationPage;
