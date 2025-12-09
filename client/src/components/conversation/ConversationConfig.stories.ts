import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  reactRouterParameters,
  withRouter,
} from "storybook-addon-remix-react-router";

import ConversationConfig from "./ConversationConfig";

const meta = {
  title: "client/admin/Conversation Config",
  component: ConversationConfig,
  decorators: [withRouter],
  argTypes: {
    editItem: { control: "object" },
  },
  parameters: {
    reactRouter: reactRouterParameters({}),
  },
} satisfies Meta<typeof ConversationConfig>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewConversation: Story = {};

export const EditConversation: Story = {
  args: {
    editItem: {
      name: "test title",
      id: "test-uuid",
      description: "test description",
      author: {
        id: "",
        username: "",
      },
      num_participants: 0,
      date_created: "",
      is_active: false,
      display_unmoderated: true,
      allow_comments: true,
      allow_votes: true,
    },
  },
};
