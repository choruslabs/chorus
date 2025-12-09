import { useMemo } from "react";
import type { ConversationAnalysis } from "../../../app/core/ConversationAnalysisPage";

export function ConsensusStatementsList(props: {
  conversationAnalysis: ConversationAnalysis;
}) {
  const { conversationAnalysis } = props;
  // Get top 5 consensus comments
  const topConsensus = useMemo(() => {
    return conversationAnalysis.comments_by_consensus.slice(0, 5);
  }, [conversationAnalysis.comments_by_consensus]);
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900 pb-3 border-b-2 border-gray-300">
        Points of Consensus
      </h2>
      <div className="space-y-3">
        {topConsensus.map((comment) => (
          <div
            key={`top-consensus-${comment.comment_id}`}
            className="bg-gray-50 border border-gray-300 rounded-lg px-5 py-4 flex items-center gap-4"
          >
            <div className="flex items-center gap-2 bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wide shrink-0">
              <span className="bg-white/20 px-2 py-0.5 rounded">
                {comment.consensus.toFixed(2)}
              </span>
            </div>
            <p className="text-base text-gray-900 leading-snug">
              "{comment.content}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
