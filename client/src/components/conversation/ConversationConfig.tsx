import { Input, Switch, Textarea } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { Conversation } from "../../app/core/dashboard";
import { postApi, putApi } from "../api/base";
import { createConversation, updateConversation } from "../api/conversation";

export default function ConversationConfig({
  editItem,
  type,
  onComplete,
}: {
  editItem?: Conversation;
  type?: string;
  onComplete?: () => void;
}) {
  const navigate = useNavigate();

  // const [conversationId, setConversationId] = useState(editItem?.id ?? "");

  const [conversationName, setConversationName] = useState(
    editItem?.name ?? "",
  );
  const [conversationDescription, setConversationDescription] = useState(
    editItem?.description ?? "",
  );

  const [
    conversationAllowUnmoderatedComments,
    setConversationAllowUnmoderatedComments,
  ] = useState(editItem?.display_unmoderated ?? false);

  const [conversationShowCharts, setConversationShowCharts] = useState(
    editItem?.show_charts ?? false,
  ); // TODO: placeholder; change to correct value later

  const [conversationAllowVotes, setConversationAllowVotes] = useState(
    editItem?.allow_votes ?? false,
  );
  const [conversationAllowComments, setConversationAllowComments] = useState(
    editItem?.allow_comments ?? true,
  );
  const [conversationFriendlyLink, setConversationFriendlyLink] = useState(
    editItem?.user_friendly_link ?? "",
  );

  async function formSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newConversationRequestBody = {
      name: conversationName,
      description: conversationDescription,
      // show_charts: conversationShowCharts,
      displayUnmoderated: conversationAllowUnmoderatedComments,
      allowVotes: conversationAllowVotes,
      allowComments: conversationAllowComments,
      userFriendlyLink: conversationFriendlyLink,
    };
    if (!editItem)
      // new conversation
      await createConversation(newConversationRequestBody);
    else {
      // edit conversation
      await updateConversation({
        conversationId: editItem.id,
        ...newConversationRequestBody,
      });
    }
    if (onComplete) {
      onComplete();
    }
    if (type !== "dialog") {
      navigate("/home");
    }
  }

  return (
    <div className="flex flex-col items-start h-full py-4 w-[95%] max-w-3xl mx-auto gap-6">
      <div className="flex flex-row w-full gap-4 items-center">
        {!editItem && (
          <a
            type="button"
            className="h-12 p-3 aspect-square w-max rounded-full hover:bg-red-800 hover:text-white bg-gray-200"
            title="back"
            href="/conversation"
            // onClick={() => handleEditClick(false)}
          >
            <span className="w-4">
              <ArrowLeftIcon />
            </span>
          </a>
        )}

        <hgroup className="flex flex-col gap-2">
          <h1 className="text-5xl font-bold">
            {editItem ? "Edit conversation" : "Create conversation"}
          </h1>
          <p>
            Add in copy that allows people to understand what creating a
            conversation does.
          </p>
        </hgroup>
      </div>
      <form
        method={type}
        onSubmit={formSubmit}
        id="conversation-form"
        className="w-full flex flex-col"
      >
        <fieldset className="flex flex-col mx-auto gap-2 w-full mb-4">
          <label htmlFor="name">Conversation title </label>
          <Input
            className="border-gray-500 border-2 rounded-md p-2"
            type="text"
            name="name"
            id="name"
            placeholder="Title here"
            required
            value={conversationName}
            onChange={(event) => setConversationName(event.target.value)}
          ></Input>
          <label htmlFor="description">Description for conversation</label>
          <Textarea
            className="border-gray-500 border-2 rounded-md p-2"
            name="description"
            id="description"
            placeholder="Description here"
            value={conversationDescription}
            onChange={(event) => setConversationDescription(event.target.value)}
          ></Textarea>
        </fieldset>

        {!editItem && (
          <div className="col-span-2 text-center ,b-4">
            [Seed Comments Placeholder]
          </div>
        )}

        <fieldset className="flex flex-col mx-auto w-full mb-4">
          <legend className="font-bold text-2xl mb-2">Settings</legend>
          <label htmlFor="show-charts" className="flex gap-2 p-2">
            <Input
              className="border-gray-500 border-2 justify-self-start aspect-square h-6"
              type="checkbox"
              name="show-charts"
              id="show-charts"
              checked={conversationShowCharts}
              onChange={(event) =>
                setConversationShowCharts(event.target.checked)
              }
            ></Input>
            Show opinion visualizations to participants
          </label>
          <label htmlFor="display-unmoderated" className="flex gap-2 p-2">
            <Input
              className="border-gray-500 border-2 justify-self-start aspect-square h-6"
              type="checkbox"
              name="display-unmoderated"
              id="display-unmoderated"
              checked={conversationAllowUnmoderatedComments}
              onChange={(event) =>
                setConversationAllowUnmoderatedComments(event.target.checked)
              }
            ></Input>
            Hide comments pending moderator approval
          </label>
          <label htmlFor="allow-votes" className="flex gap-2 p-2">
            <Input
              className="border-gray-500 border-2 justify-self-start aspect-square h-6"
              type="checkbox"
              name="allow-votes"
              id="allow-votes"
              checked={conversationAllowVotes}
              onChange={(event) =>
                setConversationAllowVotes(event.target.checked)
              }
            ></Input>
            Allow participants to vote on comments
          </label>
          <label htmlFor="allow-comments" className="flex gap-2 p-2">
            <Input
              className="border-gray-500 border-2 justify-self-start aspect-square h-6"
              type="checkbox"
              name="allow-comments"
              id="allow-comments"
              checked={conversationAllowComments}
              onChange={(event) =>
                setConversationAllowComments(event.target.checked)
              }
            ></Input>
            Allow participants to add comments
          </label>
          <label htmlFor="user-friendly-link" className="flex gap-2 p-2">
            Custom conversation link
            <Input
              className="border-gray-500 border-2 rounded justify-self-start aspect-square h-6"
              name="user-friendly-link"
              id="user-friendly-link"
              value={conversationFriendlyLink}
              onChange={(event) =>
                setConversationFriendlyLink(event.target.value)
              }
            ></Input>
          </label>
          <p className="text-sm text-gray-600 mt-1 m-2 p-2 bg-gray-100 rounded">
            This will be used to generate a shareable link for the conversation.
            For example, if you set this to <code>community-discussion</code>,
            the link will be:{" "}
            <code>{`${window.location.origin}/conversation/community-discussion`}</code>
          </p>
        </fieldset>

        <button
          type="submit"
          className="self-center border-2 border-gray-500 hover:border-gray-600 p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl"
        >
          {editItem ? "Save" : "Create conversation"}
        </button>
      </form>
    </div>
  );
}
