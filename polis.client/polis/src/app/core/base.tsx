import { useEffect, useState } from "react";
import { getUserMe, logout } from "../../components/api/auth";
import Logo from "../../components/ui/logo";
import { useNavigate } from "react-router-dom";

const CoreBase = ({ children }: { children: any }) => {
  const [user, setUser] = useState({ username: "" });

  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const data = await getUserMe();

      setUser(data);
    } catch (error: any) {
      console.log(error);
      if (error.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center">
      <div className="w-full p-3 bg-sky-500 pl-5 flex justify-between">
        <div className="flex">
          <Logo fill="white" />
          <h1 className="ml-3 text-white text-xl font-bold">Polis</h1>
        </div>
        <div className="flex">
          <p className="text-white mr-4 max-sm:hidden">
            Welcome, {user.username}
          </p>
          <a className="text-white" onClick={handleLogout}>
            Logout
          </a>
        </div>
      </div>
      <div className="grow p-10 w-full overflow-y-auto">{children}</div>
    </div>
  );
};

export default CoreBase;
