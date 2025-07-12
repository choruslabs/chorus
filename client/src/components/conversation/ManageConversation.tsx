import { useEffect, useMemo, useState } from "react";
import { Conversation, ModerationComment } from "../../app/core/dashboard";
import ConversationConfig from "./ConversationConfig";
import { NavLink, useNavigate } from "react-router";
import BreadCrumb from "../ui/BreadCrumb";
import { useQuery } from "@tanstack/react-query";
import { deleteApi, getApi } from "../api/base";

export default function ManageConversation({
  editIdItem,
  refetch,
}: {
  editIdItem: Conversation;
  refetch: Function;
}) {
  const comments = useQuery<ModerationComment[]>({
    queryKey: [`comment-query-${editIdItem.id}`],
    queryFn: () =>
      getApi(`/moderation/conversations/${editIdItem.id}/comments`),
  });

  const unmoderatedCommentsCount = useMemo(() => {
    return (comments.data ?? []).filter((item) => item.approved === null)
      .length;
  }, [comments.data]);

  const onFormComplete = () => {
    if (refetch) refetch();
  };
  return (
    <section className="w-[95%] max-w-4xl mx-auto">
      <BreadCrumb conversation={editIdItem.id} />
      <div className="title flex justify-between">
        <h1 className="text-4xl font-bold my-4">
          Conversation: {editIdItem.name}
        </h1>
        <ConversationDialog
          onComplete={onFormComplete}
          editIdItem={editIdItem}
        />
      </div>

      {!!editIdItem.description && <p>{editIdItem.description}</p>}

      <nav className="border-b-2 flex">
        <NavLink
          className="p-4 flex items-center gap-2 [&.active]:border-b-2"
          to="moderate"
        >
          Moderate
          <div className="px-3 py-1 rounded-full whitespace-nowrap font-semibold w-fit bg-gray-100">
            {unmoderatedCommentsCount}
          </div>
        </NavLink>
        <NavLink
          className="p-4 flex items-center gap-2 [&.active]:border-b-2"
          to="monitor"
        >
          Monitor
        </NavLink>
        <NavLink
          className="p-4 flex items-center gap-2 [&.active]:border-b-2"
          to="distribute"
        >
          Distribute
        </NavLink>
      </nav>
    </section>
  );
}

function ConversationDialog({
  onComplete,
  editIdItem,
}: {
  onComplete: Function;
  editIdItem: Conversation;
}) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
  useEffect(() => {
    // const editButton = document.getElementById("edit-button");
    setDialog(document.getElementById("edit-dialog") as HTMLDialogElement);
  }, []);

  const handleEditClick = (state: boolean) => {
    if (state) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  };

  const onFormComplete = () => {
    dialog?.close();
    if (onComplete) onComplete();
  };

  return (
    <>
      <button
        id="edit-button"
        className="border-2 px-2 py-2 rounded-xl flex flex-row items-center gap-x-2 h-min self-center-safe"
        onClick={() => handleEditClick(true)}
      >
        Edit
      </button>
      <dialog
        id="edit-dialog"
        className="m-[revert] p-[revert] border-2 backdrop:bg-primary backdrop:opacity-80 rounded-xl"
      >
        <div className="top-bar flex justify-between">
          {editIdItem && <DeleteConfig conversation={editIdItem} />}
          <button
            className="border-2 px-2 py-2 rounded-xl flex flex-row items-center gap-x-2 ml-auto"
            autoFocus
            onClick={() => handleEditClick(false)}
          >
            Close
          </button>
        </div>
        <ConversationConfig
          editItem={editIdItem}
          type="dialog"
          onComplete={onFormComplete}
        />
      </dialog>
    </>
  );
}

function DeleteConfig({ conversation }: { conversation: Conversation }) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
  useEffect(() => {
    // const editButton = document.getElementById("edit-button");
    setDialog(
      document.getElementById("delete-conversation-dialog") as HTMLDialogElement
    );
  }, []);
  const handleEditClick = (state: boolean) => {
    if (state) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  };

  const navigate = useNavigate();

  const deleteConversation = useQuery<{ detail: string; id: string }>({
    queryKey: [`delete-conversation-${conversation.id}`],
    queryFn: () => deleteApi(`/conversations/${conversation.id}`),
    enabled: false,
  });

  const onFormComplete = () => {
    deleteConversation.refetch();
  };

  useEffect(() => {
    if (
      deleteConversation.data?.detail === "Conversation deleted successfully"
    ) {
      navigate("/home");
    }
  }, [deleteConversation.data]);
  return (
    <>
      <button
        className="w-min border-2 border-red-500 p-2 bg-red-200 hover:bg-red-500 hover:text-white rounded-xl"
        onClick={() => handleEditClick(true)}
      >
        Delete
      </button>
      <dialog
        id="delete-conversation-dialog"
        className="m-[revert] p-[revert] border-2 backdrop:bg-primary backdrop:opacity-80 rounded-xl"
      >
        <button
          className="border-2 px-2 py-2 rounded-xl flex flex-row items-center gap-x-2 ml-auto"
          autoFocus
          onClick={() => handleEditClick(false)}
        >
          Close
        </button>
        <hgroup className="py-4">
          <h1 className="text-4xl font-bold my-4">
            Deleting this conversation?
          </h1>
          <p>
            Your conversation, <em>{conversation.name}</em>, will be deleted
          </p>
          <p>So does ALL comments, voting records & related data.</p>
        </hgroup>

        <div className="w-full flex justify-between">
          <button
            className="border-2 border-red-500 p-2 bg-red-200 hover:bg-red-500 hover:text-white rounded-xl"
            onClick={onFormComplete}
          >
            Delete the conversation
          </button>
          <button
            className="border-2 px-2 py-2 rounded-xl flex flex-row items-center gap-x-2 h-min self-center-safe"
            onClick={() => handleEditClick(false)}
          >
            Cancel
          </button>
        </div>
      </dialog>
    </>
  );
}
