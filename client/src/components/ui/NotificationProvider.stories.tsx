import type { Meta, StoryObj } from "@storybook/react";
import { NotificationProvider, useNotification } from "./NotificationProvider";
import { useState } from "react";

function NotificationDemo({ 
  title,
  message, 
  type 
}: { 
  title: string;
  message: string; 
  type: "success" | "error" 
}) {
  const { notify } = useNotification();
  const [count, setCount] = useState(0);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <button
        onClick={() => {
          notify(message, type);
          setCount(c => c + 1);
        }}
        className={`px-4 py-2 rounded-md text-white ${
          type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        Show Notification
      </button>
      {count > 0 && (
        <p className="text-sm text-gray-600">
          Triggered {count} {count === 1 ? 'time' : 'times'}
        </p>
      )}
    </div>
  );
}

const meta = {
  title: "client/UI/NotificationProvider",
  component: NotificationProvider,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="p-8 space-y-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NotificationProvider>;

export default meta;
type Story = StoryObj<typeof NotificationProvider>;

export const NotificationTypes: Story = {
  args: {
    children: (
      <div className="space-y-8">
        <NotificationDemo
          title="Success Notification"
          message="Your comment has been submitted. Other participants will start voting on it."
          type="success"
        />
        <NotificationDemo
          title="Error Notification"
          message="Failed to submit comment. Please try again."
          type="error"
        />
      </div>
    ),
  },
};

export const AutoDismissDemo: Story = {
  args: {
    children: (
      <NotificationDemo
        title="Auto-dismiss Notification (5s)"
        message="This notification will auto-dismiss in 5 seconds"
        type="success"
      />
    ),
  },
};