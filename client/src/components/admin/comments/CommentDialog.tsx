import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import type { Conversation } from "../../../app/core/dashboard";
import { ThemedButton } from "../../ui/luminance";
import CommentConfig from "./CommentConfig";

export function NewCommentDialog({
  conversation,
  onComplete,
  themeColor,
}: {
  conversation: Conversation;
  onComplete?: (event?: React.FormEvent<HTMLFormElement>) => void;
  themeColor?: string | null;
}) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
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

  const onFormComplete = () => {
    handleEditClick(false);

    if (onComplete) {
      onComplete();
    }
  };
  return (
    <>
      <ThemedButton
        type="button"
        disabled={!conversation.allow_comments}
        onClick={() => handleEditClick(true)}
        className="flex mb-4 px-3 py-2 w-min whitespace-nowrap items-center justify-center gap-x-2 rounded-xl"
        themeColor={themeColor}
      >
        <PlusIcon height={24} width={24} /> Add Comment
        {!conversation.allow_comments && (
          <span className="text-sm italic">(comments disabled)</span>
        )}
      </ThemedButton>

      <dialog
        id="comment-dialog"
        className="md:m-[revert] p-[revert] backdrop:bg-primary backdrop:opacity-80 md:rounded-xl w-full max-w-3xl relative h-screen md:h-[revert] overflow-visible"
      >
        <button
          type="button"
          className="md:border-1 border-gray-300 px-2 py-2 rounded-full md:rounded-xl hover:bg-red-800 hover:text-white bg-gray-200 md:bg-white flex flex-row items-center gap-x-2 md:absolute md:right-0 md:mx-4"
          onClick={() => handleEditClick(false)}
        >
          <span className="hidden md:block">Close</span>
          <span className="md:hidden w-4">
            <ArrowLeftIcon />
          </span>
        </button>
        <CommentConfig
          onComplete={onFormComplete}
          onCancel={() => handleEditClick(false)}
          conversation={conversation}
          themeColor={themeColor}
        />
      </dialog>
    </>
  );
}
