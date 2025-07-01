import { useEffect, useState } from "react";
import { Conversation } from "../../app/core/dashboard";
import ConversationConfig from "./ConversationConfig";
import { NavLink } from "react-router";

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

  const onFormComplete = () => {
    dialog?.close();
    if (refetch) refetch();
  };
  return (
    <>
      <section className="w-[95%] max-w-3xl mx-auto">
        <nav className="breadcrumb">
          <ol className="flex gap-1">
            <li>
              <a href="../../">Dashboard</a>
            </li>
            <li className="before:content-['/']">
              <a href="../" className="pl-1">
                All conversations
              </a>
            </li>
            <li className="before:content-['/']">
              <a href="./" className="pl-1">
                {editIdItem.name}
              </a>
            </li>
            <li className="before:content-['/']">
              <a href="" aria-current="page" className="pl-1">
                Edit
              </a>
            </li>
          </ol>
        </nav>
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
          <NavLink className="p-4" to="distribute">
            Distribute
          </NavLink>
          <NavLink className="p-4" to="monitor">
            Monitor
          </NavLink>
          <NavLink className="p-4" to="moderate">
            Moderate
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
