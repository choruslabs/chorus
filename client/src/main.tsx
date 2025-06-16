import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';

import LoginPage from './app/auth/login';
import RegisterPage from './app/auth/register';
import DashboardPage from './app/core/dashboard';
import { AuthProvider } from './components/context/AuthContext';
import ConversationPage from './app/core/conversation';
import ConversationConfigPage from './app/core/ConversationEdit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/home',
    element: <DashboardPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/conversation/new',
    element: <ConversationConfigPage />
  },
  {
    path: '/conversation/:conversationId',
    element: <ConversationPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
