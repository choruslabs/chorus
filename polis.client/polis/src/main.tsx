import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ConversationPage from "./app/core/conversation";
import LoginPage from "./app/auth/login";
import RegisterPage from "./app/auth/register";
import DashboardPage from "./app/core/dashboard";
import CreateConversationPage from "./app/core/manage/create";
import { AuthProvider } from "./components/context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/conversation/:id",
    element: <ConversationPage />,
  },
  {
    path: "/create",
    element: <CreateConversationPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
