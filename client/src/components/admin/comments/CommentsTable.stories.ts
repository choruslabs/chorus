import type { Meta, StoryObj } from "@storybook/react-vite";
import { HttpResponse, http } from "msw";

import CommentsTable from "./CommentsTable";

const meta = {
  title: "client/admin/Comments Table",
  component: CommentsTable,
  argTypes: {
    comments: { control: "object" },
  },
} satisfies Meta<typeof CommentsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoComment: Story = {
  args: {
    conversation: {
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
    comments: [],
  },
};

export const SomeComments: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(
          "http://localhost:8000/conversations/test-uuid/comments",
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
    },
    comments: [
      {
        id: "fbeec989-d824-410d-9577-2f235e688b01",
        content: "test1",
        user_id: "162f507e-7f6e-4871-a8c8-4912c3be624c",
        approved: null,
      },
      {
        id: "32ac0523-464e-4e11-8382-d9e3a6680db3",
        content: "test2",
        user_id: "162f507e-7f6e-4871-a8c8-4912c3be624c",
        approved: true,
      },
      {
        id: "0f55d2fd-2717-4bbb-b0e9-bff72e7c83e6",
        content: "",
        user_id: "162f507e-7f6e-4871-a8c8-4912c3be624c",
        approved: false,
      },
    ],
  },
};
