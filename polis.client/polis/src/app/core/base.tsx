import { useContext } from "react";
import Logo from "../../components/ui/logo";
import { AuthContext } from "../../components/context/AuthContext";

const CoreBase = ({ children }: { children: any }) => {
  const {user, logout} = useContext(AuthContext);

  return (
    <div className="h-screen w-screen flex flex-col items-center">
      <div className="w-full p-3 bg-emerald-500 pl-5 flex justify-between">
        <div className="flex">
          <Logo fill="white" />
          <h1 className="ml-3 text-white text-xl font-bold">Polis TO</h1>
        </div>
        <div className="flex">
          <p className="text-white mr-4 max-sm:hidden">
            Welcome, {user?.username}
          </p>
          <a className="text-white" onClick={logout}>
            Logout
          </a>
        </div>
      </div>
      <div className="grow w-full overflow-y-auto">{children}</div>
    </div>
  );
};

export default CoreBase;
