import type { ConversationAnalysis } from "../../../app/core/ConversationAnalysisPage";
import { StatemnentItem } from "./StatementItem";

export const StatementsList = (props: { statements: ConversationAnalysis }) => {
  const { statements } = props;

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900 pb-3 border-b-2 border-gray-300">
        Complete Statement Rankings
      </h2>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide border-b-2 border-gray-300 w-16">
                #
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide border-b-2 border-gray-300">
                Statement
              </th>
              <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide border-b-2 border-gray-300 w-32">
                Consensus
              </th>
              <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide border-b-2 border-gray-300 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {statements.comments_by_consensus.map((comment, index) => (
              <StatemnentItem
                key={comment.comment_id}
                comment={comment}
                index={index}
                totalParticipants={statements.user_ids.length}
              />
            ))}
            {statements.comments_by_consensus.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  No statements available for analysis.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
