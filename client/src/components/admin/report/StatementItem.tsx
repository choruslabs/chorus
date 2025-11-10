import Plot from "react-plotly.js";
import type { CommentAnalysis } from "../../../app/core/ConversationAnalysisPage";

export function StatemnentItem(props: {
  comment: CommentAnalysis;
  index: number;
  totalParticipants: number;
}) {
  const { comment, index, totalParticipants } = props;
  return (
    <tr
      key={`consensus-rank-${comment.comment_id}`}
      className="hover:bg-gray-50 transition-colors"
    >
      <td className="px-4 py-4 border-b border-gray-200 text-gray-600 font-semibold">
        {index + 1}
      </td>
      <td className="px-4 py-4 border-b border-gray-200 text-gray-900">
        {comment.content}
      </td>
      <td className="px-4 py-4 border-b border-gray-200 text-center text-lg font-semibold text-gray-700">
        {comment.consensus.toFixed(2)}
      </td>
      <td className="px-4 py-4 border-b border-gray-200 text-center text-lg font-semibold text-gray-700">
        {" "}
        <Plot
          data={[
            {
              type: "bar",
              name: "agree",
              x: [comment.vote_probabilities.agree * comment.total_votes],
              marker: {
                color: "green",
              },
              orientation: "h",
            },
            {
              type: "bar",
              name: "disagree",
              x: [comment.vote_probabilities.disagree * comment.total_votes],
              marker: {
                color: "red",
              },
              orientation: "h",
            },
            {
              type: "bar",
              name: "neutral",
              x: [comment.vote_probabilities.skip * comment.total_votes],
              marker: {
                color: "gray",
              },
              orientation: "h",
            },
            {
              type: "bar",
              name: "",
              x: [totalParticipants - comment.total_votes],
              orientation: "h",
              marker: {
                color: "transparent",
              },
            },
          ]}
          layout={{
            height: 20,
            width: 100,
            paper_bgcolor: "transparent",
            margin: { t: 0, b: 0, l: 0, r: 0 },
            barmode: "stack",
            showlegend: false,
            xaxis: { visible: false, fixedrange: true },
            yaxis: { visible: false, fixedrange: true },
          }}
          config={{
            responsive: true,
            scrollZoom: false,
            displayModeBar: false,
          }}
        />
      </td>
    </tr>
  );
}
