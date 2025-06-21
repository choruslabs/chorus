import { Conversation } from "../../app/core/dashboard"

export const ConversationTable = ({ conversations }: { conversations: Conversation[] }) => {
    return (
        <table id="conversation-table">
            <thead>
                <tr className="grid grid-cols-[1fr_1fr_1fr_0.5fr]">
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {conversations.map(conversation => (
                    <ConversationTableItem conversation={conversation} />
                ))}
            </tbody>
        </table>
    )
}

const ConversationTableItem = ({ conversation }: { conversation: Conversation }) => {
    const viewLink = `/conversation/${conversation.id}`
    const editLink = `/conversation/${conversation.id}/edit`

    return (
        <tr className="grid grid-cols-[1fr_1fr_1fr_0.5fr] border-b-2 border-gray-400">
            <th>{conversation.id}</th>
            <th>{conversation.name}</th>
            <th>{conversation.description}</th>
            <th className="flex gap-1 place-content-center">
                <a href={viewLink}>View</a>
                <a href={editLink}>Edit</a>
            </th>
        </tr>
    )
}