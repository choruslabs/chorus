import type {
  GroupAnalysis,
  GroupAnalysisComment,
} from "../../../app/core/ConversationAnalysisPage";

export function GroupStatementsList(props: {
  group: GroupAnalysis & { topComments: GroupAnalysisComment[] };
}) {
  const { group } = props;

  return (
    <div className="space-y-4">
      {group.topComments.map((comment) => (
        <div
          key={`group-${group.group_id}-representative-${comment.comment_id}`}
          className="bg-gray-50 border border-gray-300 rounded-lg p-6"
        >
          <p className="text-lg text-gray-900 leading-relaxed mb-3">
            "{comment.content}"
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div>
              <strong className="text-gray-900">
                {(comment.agree_percentage * 100).toFixed(0)}%
              </strong>{" "}
              of group agrees
            </div>
            <div>
              Representativeness:{" "}
              <strong className="text-gray-900">
                {comment.representativeness.toFixed(2)}
              </strong>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
