import { useMemo } from "react";
import type { ConversationAnalysis } from "../../../app/core/ConversationAnalysisPage";

export function ParticipationSummary(props: {
  conversationAnalysis: ConversationAnalysis;
}) {
  const { conversationAnalysis } = props;
  // Get top 5 consensus comments
  const topConsensus = useMemo(() => {
    return conversationAnalysis.comments_by_consensus.slice(0, 5);
  }, [conversationAnalysis.comments_by_consensus]);
  return (
    <div className="grid grid-cols-4 gap-0 border-b-2 border-gray-300 bg-gray-50">
      <div className="px-8 py-8 text-center border-r border-gray-300">
        <div className="text-4xl font-semibold text-gray-700 mb-2">
          {conversationAnalysis.user_ids.length}
        </div>
        <div className="text-sm text-gray-600 uppercase tracking-wide font-medium">
          Participants
        </div>
      </div>
      <div className="px-8 py-8 text-center border-r border-gray-300">
        <div className="text-4xl font-semibold text-gray-700 mb-2">
          {conversationAnalysis.comment_ids.length}
        </div>
        <div className="text-sm text-gray-600 uppercase tracking-wide font-medium">
          Statements
        </div>
      </div>
      <div className="px-8 py-8 text-center border-r border-gray-300">
        <div className="text-4xl font-semibold text-gray-700 mb-2">
          {topConsensus.length}
        </div>
        <div className="text-sm text-gray-600 uppercase tracking-wide font-medium">
          Top Consensus
        </div>
      </div>
      <div className="px-8 py-8 text-center">
        <div className="text-4xl font-semibold text-gray-700 mb-2">
          {conversationAnalysis.groups.length}
        </div>
        <div className="text-sm text-gray-600 uppercase tracking-wide font-medium">
          Opinion Groups
        </div>
      </div>
    </div>
  );
}
