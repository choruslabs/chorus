import DOMPurify from "dompurify";
import { marked } from "marked";
import { useEffect, useMemo, useState } from "react";

export function KnowledgeBaseDialog({
  markdownContent,
}: {
  markdownContent: string;
}) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
  useEffect(() => {
    setDialog(document.getElementById("comment-dialog") as HTMLDialogElement);
  }, []);
  const showDialog = (state: boolean) => {
    if (state) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  };

  const contentHtml = useMemo(() => {
    const sanitized = DOMPurify.sanitize(markdownContent);

    const parsed = marked.parse(sanitized || "No about content provided.");
    if (typeof parsed !== "string") {
      return "Error parsing content.";
    }
    return parsed;
  }, [markdownContent]);

  return (
    <>
      <button
        type="button"
        onClick={() => showDialog(true)}
        className={`flex border-blue-500 border-2 px-3 py-2 w-min whitespace-nowrap items-center justify-center gap-x-2 rounded-xl`}
      >
        More about this topic
      </button>

      <dialog
        closedby="any"
        id="comment-dialog"
        className="md:m-[revert] p-0 backdrop:bg-primary backdrop:opacity-80 md:rounded-xl w-full max-w-3xl relative h-screen md:h-[revert] overflow-visible border-primary"
      >
        <button
          type="button"
          className="border border-gray-300 px-2 py-2 rounded-xl hover:bg-red-800 hover:text-white bg-white flex flex-row items-center gap-x-2 absolute right-0 m-4"
          onClick={() => showDialog(false)}
        >
          <span className="block">Close</span>
        </button>
        <div className="prose prose-lg prose-primary mx-auto markdown-body my-12 px-4">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized with DOMPurify */}
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </dialog>
    </>
  );
}
