export const baseApiUrl =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";

export const fetchApi = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(`${baseApiUrl}${url}`, {
    ...options,
    credentials: "include",
    mode: "cors",
  });

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.detail ?? "unknown error");
  }

  return res.json();
};

export const getApi = (url: string) => fetchApi(url);

export const postApi = (url: string, data: any = {}) =>
  fetchApi(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const putApi = (url: string, data: any = {}) =>
  fetchApi(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const deleteApi = (url: string, data: any = {}) =>
  fetchApi(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
