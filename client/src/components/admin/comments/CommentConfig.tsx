import { useState } from "react";
import { postApi } from "../../api/base";
import { Conversation } from "../../../app/core/dashboard";

export default function CommentConfig({
  conversation,
  editId,
  onComplete,
  onCancel,
}: {
  conversation: Conversation;
  editId?: string;
  onComplete?: () => void;
  onCancel?: () => void;
}) {
  const [comment, setComment] = useState("");
  async function formSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // const formData = new FormData(event.target as HTMLFormElement);
    const newConversationRequestBody = {
      content: comment,
    };
    if (!editId) {
      // new conversation
      await postApi(
        `/conversations/${conversation.id}/comments`,
        newConversationRequestBody
      );
      setComment("");
    } else {
      // edit conversation
      //   putApi(`/conversations/${editItem?.id}`, newConversationRequestBody).then(
      //     (resp) => {
      //       //   setUpdated(Date.now());
      //       //   setConversationId(resp.id);
      //     }
      //   );
    }
    if (onComplete) {
      onComplete();
    }
  }

  function onFormCancel() {
    if (onCancel) {
      onCancel();
    }
  }
  return (
    <form onSubmit={formSubmit}>
      <h2 className="text-3xl font-bold my-4">Add comment to conversation</h2>
      <p>Add help hints here for creating a comment </p>
      <hgroup>
        <h3 className="text-2xl font-bold my-4">{conversation.name}</h3>
        <p>{conversation.description}</p>
      </hgroup>
      <textarea
        className="border-gray-500 border-2 w-full rounded-md p-2 min-h-40"
        name="description"
        id="description"
        title="description"
        value={comment}
        placeholder="Enter a comment..."
        onChange={(event) => setComment(event.target.value)}
      ></textarea>
      <div className="flex gap-2 my-4 flex-wrap">
        <button
          type="button"
          className="p-2 border-2 rounded-md hover:bg-red-800 hover:border-red-800 hover:text-white grow-1"
          onClick={onFormCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="p-2 bg-gray-500 hover:bg-secondary text-white rounded-md grow-1"
        >
          Add Comment
        </button>
      </div>
    </form>
  );
}
