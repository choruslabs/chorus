import { createContext, ReactNode, useEffect, useState } from "react";
import { getUserMe, postLogin, postLogout } from "../api/auth";

type User = {
  username: string;
};

export const AuthContext = createContext<{
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const user = await getUserMe();
      setUser(user);
    } catch (error) {
      setUser(null);
    }
  };

  const login = async (username: string, password: string) => {
    await postLogin(username, password);
    await fetchUser();
  };

  const logout = async () => {
    await postLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
