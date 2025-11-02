import type { Meta, StoryObj } from "@storybook/react-vite";
import analysisData from "../../../.storybook/mock_data/analysisData.json";

import {
  reactRouterParameters,
  withRouter,
} from "storybook-addon-remix-react-router";

import ConversationAnalysisPage from "./ConversationAnalysisPage";
import { http, HttpResponse } from "msw";

const meta = {
  title: "client/admin/Conversation Analysis",
  component: ConversationAnalysisPage,
  decorators: [withRouter],
  argTypes: {
    editItem: { control: "object" },
  },
  parameters: {
    reactRouter: reactRouterParameters({}),
  },
} satisfies Meta<typeof ConversationAnalysisPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewConversation: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { conversationId: "d035d428-90c1-4ea9-99de-1d7c1f81a939" },
      },
      routing: {
        path: "/conversation/:conversationId/analysis",
      },
    }),
    msw: {
      handlers: [
        http.get(
          "http://localhost:8000/analysis/conversation/d035d428-90c1-4ea9-99de-1d7c1f81a939",
          async () => {
            return HttpResponse.json(analysisData);
          },
        ),
        http.get(
          "http://localhost:8000/conversations/d035d428-90c1-4ea9-99de-1d7c1f81a939",
          async () => {
            return HttpResponse.json({
              author: { username: "storybook_test_user" },
            });
          },
        ),
      ],
    },
  },
};
