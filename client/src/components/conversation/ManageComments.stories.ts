import type { Meta, StoryObj } from "@storybook/react-vite";
import { HttpResponse, http } from "msw";
import {
  reactRouterParameters,
  withRouter,
} from "storybook-addon-remix-react-router";
import ManageComments from "./ManageComments";

const moderationCommentsResp = [
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
];

const meta = {
  title: "client/query/Manage Comments",
  component: ManageComments,
  decorators: [withRouter],
  parameters: {
    reactRouter: reactRouterParameters({}),
  },
} satisfies Meta<typeof ManageComments>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithComments: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { conversationId: "d035d428-90c1-4ea9-99de-1d7c1f81a939" },
      },
      routing: {
        path: "/conversation/:conversationId/moderate",
      },
    }),
    msw: {
      handlers: [
        http.get(
          "http://localhost:8000/moderation/conversations/d035d428-90c1-4ea9-99de-1d7c1f81a939/comments",
          async () => {
            return HttpResponse.json(moderationCommentsResp);
          },
        ),
      ],
    },
  },
};
