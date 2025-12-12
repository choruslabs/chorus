import type { Meta, StoryObj } from "@storybook/react-vite";
import { HttpResponse, http } from "msw";

import {
  reactRouterParameters,
  withRouter,
} from "storybook-addon-remix-react-router";

import { ParticipationSpa } from "./ParticipationSpa";

const meta = {
  title: "client/participation/Conversation",
  component: ParticipationSpa,
  decorators: [withRouter],
  argTypes: {
    conversation: { control: "object" },
    currentComment: { control: "object" },
    comments: { control: "object" },
  },
  parameters: {
    reactRouter: reactRouterParameters({}),
  },
} satisfies Meta<typeof ParticipationSpa>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveConversation: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(
          "http://localhost:8000/conversations/d035d428-90c1-4ea9-99de-1d7c1f81a939/comments",
          async () => {
            return HttpResponse.json({
              id: "mock-success",
            });
          },
        ),
        http.get("http://localhost:8000/users/me", async () => {
          return HttpResponse.json({ username: "storybook.test@example.com" });
        }),
      ],
    },
  },
  args: {
    conversation: {
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
    },
    currentComment: {
      num_votes: 0,
      comment: {
        user_id: "162f507e-7f6e-4871-a8c8-4912c3be624c",
        content: "test1",
        approved: true,
        conversation_id: "d035d428-90c1-4ea9-99de-1d7c1f81a939",
        id: "fbeec989-d824-410d-9577-2f235e688b01",
        date_created: "2025-07-04T04:49:24.267970",
      },
    },
    comments: [
      { id: "fbeec989-d824-410d-9577-2f235e688b01", content: "test1" },
      { id: "32ac0523-464e-4e11-8382-d9e3a6680db3", content: "test2" },
      { id: "0f55d2fd-2717-4bbb-b0e9-bff72e7c83e6", content: "" },
    ],
    onVoteComplete: () => {},
    onComplete: () => {},
    isVotingDisabled: false,
  },
};
