import type { Preview } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initialize, mswLoader } from "msw-storybook-addon";
import { MemoryRouter, Outlet, Route, Routes } from "react-router";

import "../src/index.css"; // tailwind CSS etc
import NotificationProvider from "../src/components/ui/NotificationProvider";

let options = {};
if (location.hostname.includes("github.io")) {
  options = {
    serviceWorker: {
      url: "/chorus/mockServiceWorker.js", // manually pointing msw config file
    },
  };
}

initialize(options);

const preview: Preview = {
  decorators: [
    (Story) => {
      const queryClient = new QueryClient();

      return (
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            <Story />
          </NotificationProvider>
        </QueryClientProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  loaders: [mswLoader],
};

export default preview;

const sampleConversation = {
  id: "d035d428-90c1-4ea9-99de-1d7c1f81a939",
  name: "Title test",
  description: "desc",
  author: {
    id: "162f507e-7f6e-4871-a8c8-4912c3be624c",
    username: "gg@gg.ca",
  },
  num_participants: 1,
  date_created: "2025-07-04T04:38:18.318536",
  is_active: true,
  display_unmoderated: false,
  allow_comments: true,
  allow_votes: true,
};

export const mockRouter = (Story) => (
  <MemoryRouter>
    <Routes>
      <Route
        path="/"
        element={<Outlet context={{ conversation: sampleConversation }} />}
      >
        <Route index element={<Story />} />
      </Route>
    </Routes>
  </MemoryRouter>
);
