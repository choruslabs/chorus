import type { ConversationAnalysis } from "../../../app/core/ConversationAnalysisPage";

export function ConversationSummaryGroups(props: {
  conversationAnalysis: ConversationAnalysis;
}) {
  const { conversationAnalysis } = props;
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900 pb-3 border-b-2 border-gray-300">
        Opinion Landscape
      </h2>
      <div className="bg-gray-50 rounded-lg p-10 border border-gray-300">
        <p className="text-lg mb-8 text-gray-700">
          {conversationAnalysis.groups.length} distinct opinion groups emerged
          from the conversation
        </p>

        {/* Bar chart of group sizes */}
        <div className="space-y-4 mb-8">
          {conversationAnalysis.groups
            .sort((a, b) => b.users.length - a.users.length)
            .map((group) => {
              const maxSize = Math.max(
                ...conversationAnalysis.groups.map((g) => g.users.length),
              );
              const percentage = (group.users.length / maxSize) * 100;

              return (
                <div
                  key={`chart-${group.group_id}`}
                  className="flex items-center gap-4"
                >
                  <div className="w-24 text-sm font-semibold text-gray-700">
                    Group {group.group_id}
                  </div>
                  <div className="flex-1">
                    <div className="relative h-10 bg-gray-200 rounded overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gray-600 rounded flex items-center justify-end pr-3 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-white text-sm font-semibold">
                          {group.users.length} participants
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="flex gap-8 flex-wrap">
          {conversationAnalysis.groups.map((group) => (
            <div key={group.group_id} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-600 rounded border border-gray-400" />
              <div className="text-gray-700">
                <strong>Group {group.group_id}:</strong> {group.users.length}{" "}
                participants
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
