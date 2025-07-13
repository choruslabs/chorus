import CoreBase from "./base";
import ConversationsList from "../../components/conversation/ConversationsList";

// see server\convergent\routers\conversation.py
export type Conversation = {
  id: string;
  name: string;
  description: string;
  author: { id: string; username: string };
  num_participants: number;
  date_created: string;
  is_active: boolean;
  display_unmoderated: boolean;
  show_charts?: boolean; // placeholder
  allow_votes?: boolean; // placeholder
};

export type Comment = {
  id: string;
  content: string;
};

export type ParticipationComment = Comment & {
  user_id: string;
  approved: boolean;
  conversation_id: string;
  date_created: string;
};

// See server\convergent\routers\moderation.py
export type ModerationComment = Comment & {
  user_id: string;
  approved: boolean | null;
};

const DashboardPage = () => {
  return (
    <CoreBase requiresLogin={true}>
      <ConversationsList />
    </CoreBase>
  );
};

export default DashboardPage;
