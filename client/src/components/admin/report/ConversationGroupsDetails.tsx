import { useMemo } from "react";
import type { ConversationAnalysis } from "../../../app/core/ConversationAnalysisPage";
import { GroupStatementsList } from "./GroupStatementsList";

export function ConversationGroupsDetails(props: {
  conversationAnalysis: ConversationAnalysis;
  type: string;
  commentsPerGroup: number;
}) {
  // Get top 2 representative comments for each group
  const groupRepresentatives = useMemo(() => {
    return props.conversationAnalysis.groups.map((group) => ({
      ...group,
      topComments: group.representative_comments
        .sort((a, b) => b.representativeness - a.representativeness)
        .slice(0, props.commentsPerGroup),
    }));
  }, [props.conversationAnalysis.groups, props.commentsPerGroup]);
  return (
    <>
      {props.conversationAnalysis.groups.length > 0 &&
        groupRepresentatives.some((g) => g.topComments.length > 0) &&
        groupRepresentatives.map((group) => (
          <div key={`group-representative-${group.group_id}`} className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Group {group.group_id} ({group.users.length} participants)
            </h3>
            {group.topComments.length === 0 && (
              <p className="text-gray-600 italic">
                No representative statements for this group.
              </p>
            )}
            {group.topComments.length > 0 && props.type === "tile" && (
              <GroupStatementsList
                key={`group-statement-${group.group_id}`}
                group={group}
              />
            )}
            {group.topComments.length > 0 && props.type === "table" && (
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide border-b-2 border-gray-300">
                        Statement
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide border-b-2 border-gray-300 w-40">
                        Group Agreement
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide border-b-2 border-gray-300 w-40">
                        Representativeness
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.topComments.map((comment) => (
                      <tr
                        key={
                          "analysis-group-" +
                          group.group_id +
                          "-" +
                          comment.comment_id
                        }
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4 border-b border-gray-200 text-gray-900">
                          {comment.content}
                        </td>
                        <td className="px-4 py-4 border-b border-gray-200 text-center text-lg font-semibold text-gray-700">
                          {(comment.agree_percentage * 100).toFixed(0)}%
                        </td>
                        <td className="px-4 py-4 border-b border-gray-200 text-center text-lg font-semibold text-gray-700">
                          {comment.representativeness.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
    </>
  );
}
