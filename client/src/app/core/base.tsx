import MDEditor from "@uiw/react-md-editor";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../components/context/AuthContext";
import Logo from "../../components/ui/logo";
import { UserDropdown } from "../auth/UserDropdown";

const AppBar = ({ children }: { children: React.ReactNode }) => (
  <div
    id="app-bar"
    className="w-full p-3 pl-5 flex items-center justify-between border-b-gray-200 border-b-2"
  >
    <div className="flex items-center">
      <Logo />
      <h1 className="ml-3 mr-16 text-xl font-bold">Chorus</h1>
    </div>
    <div className="flex grow justify-end-safe">{children}</div>
  </div>
);

export function KnowledgeBaseDialog({
  markdownContent,
}: {
  markdownContent: string;
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

  return (
    <>
      <button
        type="button"
        onClick={() => handleEditClick(true)}
        className={`flex border-blue-500 border-2 px-3 py-2 w-min whitespace-nowrap items-center justify-center gap-x-2 rounded-xl`}
      >
        Background Information
      </button>

      <dialog
        id="comment-dialog"
        className="md:m-[revert] p-[revert] backdrop:bg-primary backdrop:opacity-80 md:rounded-xl w-full max-w-3xl relative h-screen md:h-[revert] overflow-visible"
      >
        <button
          type="button"
          className="md:border border-gray-300 px-2 py-2 rounded-full md:rounded-xl hover:bg-red-800 hover:text-white bg-gray-200 md:bg-white flex flex-row items-center gap-x-2 md:absolute md:right-0 md:mx-4"
          onClick={() => handleEditClick(false)}
        >
          <span className="hidden md:block">Close</span>
        </button>
        <MDEditor.Markdown
          source={markdownContent}
          style={{ whiteSpace: "pre-wrap" }}
        />{" "}
      </dialog>
    </>
  );
}

const CoreBase = ({
  children,
  requiresLogin = false,
  tabContent,
}: {
  children: React.ReactNode;
  requiresLogin?: boolean;
  tabContent?: { knowledgeBaseContent?: string };
}) => {
  const { userStatus, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (userStatus?.isError && requiresLogin) {
      navigate("/login");
    }
  }, [navigate, requiresLogin, userStatus?.isError]);

  return (
    <div
      id="core-base"
      className="h-screen w-screen flex flex-col items-center"
    >
      <div className="w-full h-16">
        <AppBar>
          {(tabContent?.knowledgeBaseContent || "").length > 0 && (
            <KnowledgeBaseDialog
              markdownContent={tabContent?.knowledgeBaseContent || ""}
            />
          )}
          <UserDropdown user={userStatus?.data} logout={logout} />
        </AppBar>
      </div>
      <div className="grow w-full overflow-y-auto pt-4">
        {userStatus?.isLoading ? "Loading..." : children}
      </div>
    </div>
  );
};

export default CoreBase;
