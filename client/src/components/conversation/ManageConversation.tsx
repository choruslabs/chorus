import { useEffect, useMemo, useState } from "react";
import { Conversation, ModerationComment } from "../../app/core/dashboard";
import ConversationConfig from "./ConversationConfig";
import { NavLink } from "react-router";
import BreadCrumb from "../ui/BreadCrumb";
import { useQuery } from "@tanstack/react-query";
import { getApi } from "../api/base";

export default function ManageConversation({
  editIdItem,
  refetch,
}: {
  editIdItem: Conversation;
  refetch: Function;
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
    dialog?.close();
    if (refetch) refetch();
  };
  return (
    <>
      <section className="w-[95%] max-w-4xl mx-auto">
        <BreadCrumb conversation={editIdItem.id} />
        <div className="title flex justify-between">
          <h1 className="text-4xl font-bold my-4">
            Conversation: {editIdItem.name}
          </h1>
          <button
            id="edit-button"
            className="border-2 px-2 py-2 rounded-xl flex flex-row items-center gap-x-2 h-min self-center-safe"
            onClick={() => handleEditClick(true)}
          >
            Edit
          </button>
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
      <dialog
        id="edit-dialog"
        className="m-[revert] p-[revert] border-2 backdrop:bg-primary backdrop:opacity-80"
      >
        <button
          className="border-2 px-2 py-2 rounded-xl flex flex-row items-center gap-x-2 ml-auto"
          autoFocus
          onClick={() => handleEditClick(false)}
        >
          Close
        </button>
        <ConversationConfig
          editItem={editIdItem}
          type="dialog"
          onComplete={onFormComplete}
        />
      </dialog>
    </>
  );
}
