import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  getUserMe,
  postLogin,
  postLogout,
  postRegisterAnonymous,
} from "../api/auth";
import { AuthContext } from "./AuthContext";

export type User = {
  username: string;
  is_anonymous: boolean;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const userStatus = useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: () => getUserMe(),
    retry: false,
  });

  const login = async (username: string, password: string) => {
    await postLogin(username, password);
    await userStatus.refetch();
  };

  const logout = async () => {
    await postLogout();
    await userStatus.refetch();
    window.location.reload();
  };

  const loginAsAnonymous = async () => {
    await postRegisterAnonymous();
    await userStatus.refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        userStatus,
        login,
        logout,
        loginAsAnonymous,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
