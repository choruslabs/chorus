import { fetchApi, getApi, postApi } from "./base";

export const login = async (username: string, password: string) => {
  const formData = new FormData();

  formData.append("username", username);
  formData.append("password", password);

  return fetchApi("/token", {
    method: "POST",
    body: formData,
  });
};

export const register = (username: string, password: string) =>
  postApi("/register", {
    username,
    password,
  });

export const getUserMe = () => getApi("/users/me");

export const logout = () => postApi("/logout");
