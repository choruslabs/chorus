import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../components/context/AuthContext";
import { isWhiteTextPreferred } from "../../components/ui/luminance";
import { UserDropdown } from "../auth/UserDropdown";

const AppBar = ({
  children,
  headerName = null,
  themeColor = null,
}: {
  children: React.ReactNode;
  headerName?: string | null;
  themeColor?: string | null;
}) => (
  <div
    id="app-bar"
    className={`w-full p-3 pl-5 flex items-center justify-between ${
      themeColor && isWhiteTextPreferred(themeColor)
        ? "text-white"
        : "text-black"
    } ${themeColor ? "" : "bg-white border-b-gray-200 border-b-2"}`}
    style={{ backgroundColor: themeColor || undefined }}
  >
    <div className="flex items-center">
      <h1 className="ml-3 mr-16 text-xl font-bold">{headerName || "Chorus"}</h1>
    </div>
    <div className="flex justify-end w-1/2">{children}</div>
  </div>
);

const CoreBase = ({
  children,
  requiresLogin = false,
  headerName = null,
  themeColor = null,
}: {
  children: React.ReactNode;
  requiresLogin?: boolean;
  headerName?: string | null;
  themeColor?: string | null;
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
        <AppBar headerName={headerName} themeColor={themeColor}>
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
