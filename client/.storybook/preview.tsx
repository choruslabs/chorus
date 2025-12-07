import type { Preview } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initialize, mswLoader } from "msw-storybook-addon";

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
