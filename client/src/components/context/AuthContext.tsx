import type { UseQueryResult } from "@tanstack/react-query";
import { createContext } from "react";
import type { User } from "./AuthProvider";

export const AuthContext = createContext<{
  userStatus: UseQueryResult<User, Error> | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAsAnonymous: () => Promise<void>;
}>({
  userStatus: null,
  login: async () => {},
  logout: async () => {},
  loginAsAnonymous: async () => {},
});
