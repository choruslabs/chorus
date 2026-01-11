import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../components/context/AuthContext";
import { UserDropdown } from "../auth/UserDropdown";

const AppBar = ({
  children,
  headerName = null,
  tabs = null,
}: {
  children: React.ReactNode;
  headerName?: string | null;
  tabs?: React.ReactNode | null;
}) => (
  <div
    id="app-bar"
    className="
    w-full
    h-16
    px-5
    grid
    grid-cols-[auto_1fr_auto]
    md:grid-cols-[0.2fr_1fr_0.2fr]
    items-center
    bg-white
    border-b border-gray-200
  "
  >
    <div className="flex items-center">
      <h1 className="text-xl font-semibold tracking-tight">
        {headerName || "Chorus"}
      </h1>
    </div>
    <div className="flex hidden md:grid justify-center">{tabs}</div>
    <div className="flex items-center justify-end gap-2">{children}</div>
  </div>
);

const CoreBase = ({
  children,
  requiresLogin = false,
  headerName = null,
  tabs = null,
}: {
  children: React.ReactNode;
  requiresLogin?: boolean;
  headerName?: string | null;
  tabs?: React.ReactNode | null;
}) => {
  const { userStatus, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      (userStatus?.isError || userStatus?.data?.is_anonymous) &&
      requiresLogin
    ) {
      navigate("/login");
    }
  }, [navigate, requiresLogin, userStatus?.isError, userStatus?.data]);

  return (
    <div
      id="core-base"
      className="h-screen w-screen flex flex-col items-center"
    >
      <div className="w-full h-32 md:h-16">
        <AppBar headerName={headerName} tabs={tabs}>
          <UserDropdown user={userStatus?.data} logout={logout} />
        </AppBar>
        <div className="md:hidden flex justify-center mt-2 w-full">{tabs}</div>
      </div>
      <div className="grow w-full overflow-y-auto pt-4">
        {userStatus?.isLoading ? "Loading..." : children}
      </div>
    </div>
  );
};

export default CoreBase;
