import { fetchApi, getApi, postApi } from "./base";

export const postLogin = async (username: string, password: string) => {
  const formData = new FormData();

  formData.append("username", username);
  formData.append("password", password);

  return fetchApi("/token", {
    method: "POST",
    body: formData,
  });
};

export const postRegister = (username: string, password: string) =>
  postApi("/register", {
    username,
    password,
  });

export const postRegisterAnonymous = () => postApi("/register/anonymous");

export const getUserMe = () => getApi("/users/me");

export const postLogout = () => postApi("/logout");
