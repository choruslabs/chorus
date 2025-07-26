import { Input } from "@headlessui/react";
import type { Conversation } from "../../../app/core/dashboard";
import dayjs from "dayjs";
import { StatusPill } from "../../ui/StatusPill";

export const ConversationsTableItem = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  const viewLink = `/conversation/${conversation.id}`;
  const editLink = `/conversation/${conversation.id}/edit`;

  return (
    <tr className="items-center grid grid-cols-[3em_auto]">
      <td className="p-5">
        <Input type="checkbox" className="h-5 w-5" />
      </td>
      <a
        href={editLink}
        className="text-gray-800 hover:underline grid grid-cols-[2.25fr_1fr_1fr_1fr_1fr_0.6fr]"
        aria-label={conversation.name}
      >
        <td className="p-5">
          <a href={viewLink}>
            <strong>{conversation.name}</strong>
          </a>
          <br />
          {conversation.description}
        </td>
        <td className="p-5">{conversation.num_participants}</td>
        <td className="p-5">
          {dayjs(conversation.date_created).format("MMM D, YYYY")}
        </td>
        <td className="p-5">
          <StatusPill isActive={conversation.is_active} />
        </td>
        <td className="p-5">
          <span className="text-gray-600">{conversation.author.username}</span>
        </td>
        <td className="p-5">
          <div className="flex gap-4">View</div>
        </td>
      </a>
    </tr>
  );
};
