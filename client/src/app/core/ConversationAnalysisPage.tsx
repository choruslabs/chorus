import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams } from "react-router";

import { ConsensusStatementsList } from "../../components/admin/report/ConsensusStatementsList";
import { ConversationGroupsDetails } from "../../components/admin/report/ConversationGroupsDetails";
import { ConversationSummaryGroups } from "../../components/admin/report/ConversationSummaryGroups";
import { ParticipationSummary } from "../../components/admin/report/ParticipationSummary";
import { StatementsList } from "../../components/admin/report/StatementsList";
import { getApi } from "../../components/api/base";
import CoreBase from "./base";
import type { Conversation } from "./dashboard";

export interface CommentAnalysis {
  comment_id: string;
  content: string;
  consensus: number;
  representativeness: number;
  total_votes: number;
  vote_probabilities: {
    agree: number;
    disagree: number;
    skip: number;
  };
}

export interface GroupAnalysisComment {
  comment_id: string;
  content: string;
  agree_percentage: number;
  representativeness: number;
}

export interface GroupAnalysis {
  group_id: number;
  users: string[];
  representative_comments: GroupAnalysisComment[];
}

export interface ConversationAnalysis {
  user_ids: string[];
  comment_ids: string[];
  comments_by_consensus: CommentAnalysis[];
  groups: GroupAnalysis[];
}

export default function ConversationAnalysisPage() {
  const params = useParams();
  const conversationId = params.conversationId;

  const conversationResponse = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getApi(`/conversations/${conversationId}`),
    enabled: !!conversationId,
  });
  const conversation = conversationResponse.data as Conversation;

  const conversationAnalysisResponse = useQuery<ConversationAnalysis>({
    queryKey: ["conversation-analysis", conversationId],
    queryFn: () => getApi(`/analysis/conversation/${conversationId}`),
    enabled: !!conversationId,
  });

  if (
    conversationResponse.isLoading ||
    conversationAnalysisResponse.isLoading
  ) {
    return (
      <CoreBase requiresLogin={true}>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading analysis...</div>
        </div>
      </CoreBase>
    );
  }

  return (
    <CoreBase requiresLogin={true}>
      <style>{`
        @media print {
          body, html {
            overflow: visible !important;
            height: auto !important;
          }
          body * {
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }
        }
      `}</style>
      <div className="max-w-6xl mx-auto bg-white">
        {/* Header */}
        <div className="bg-gray-700 text-white px-16 py-12 border-b-4 border-gray-600">
          <h1 className="text-4xl font-semibold mb-4">{conversation.name}</h1>
          <p className="text-lg opacity-90 mb-8">{conversation.description}</p>
          <div className="flex gap-10 text-sm opacity-85">
            <div>{dayjs(conversation.date_created).format("MMMM D, YYYY")}</div>
            <div>{conversation.author.username}</div>
          </div>
        </div>

        {/* Stats Bar */}
        {conversationAnalysisResponse.data && (
          <ParticipationSummary
            conversationAnalysis={conversationAnalysisResponse.data}
          />
        )}

        {/* Main Content */}
        <div className="px-16 py-12">
          {/* Opinion Groups */}
          {conversationAnalysisResponse.data &&
            conversationAnalysisResponse.data.groups.length > 0 && (
              <ConversationSummaryGroups
                conversationAnalysis={conversationAnalysisResponse.data}
              />
            )}

          {/* Points of Consensus */}
          {conversationAnalysisResponse.data &&
            conversationAnalysisResponse.data.comments_by_consensus.length >
              0 && (
              <ConsensusStatementsList
                conversationAnalysis={conversationAnalysisResponse.data}
              />
            )}

          {/* Representative Statements by Group */}
          {conversationAnalysisResponse.data &&
            conversationAnalysisResponse.data.groups.length > 0 &&
            conversationAnalysisResponse.data.groups.some(
              (g) => g.representative_comments.length > 0,
            ) && (
              <div className="mb-16">
                <h2 className="text-3xl font-semibold mb-6 text-gray-900 pb-3 border-b-2 border-gray-300">
                  What Each Group Values
                </h2>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  The following statements best represent what matters most to
                  each opinion group.
                </p>
                <ConversationGroupsDetails
                  type="tile"
                  conversationAnalysis={conversationAnalysisResponse.data}
                  commentsPerGroup={2}
                />
              </div>
            )}

          {/* Complete Statement Rankings */}
          {conversationAnalysisResponse.data && (
            <StatementsList statements={conversationAnalysisResponse.data} />
          )}

          {/* All Representative Comments by Group */}
          {conversationAnalysisResponse.data &&
            conversationAnalysisResponse.data.groups.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-semibold mb-6 text-gray-900 pb-3 border-b-2 border-gray-300">
                  All Representative Statements by Group
                </h2>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Complete list of statements that represent each opinion
                  group's perspectives.
                </p>
                <ConversationGroupsDetails
                  type="table"
                  conversationAnalysis={conversationAnalysisResponse.data}
                  commentsPerGroup={3}
                />
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-16 py-10 border-t-2 border-gray-300">
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            <strong className="text-gray-900">About This Report:</strong> This
            report summarizes input gathered through Chorus, a platform for
            large-scale democratic dialogue. Data reflects responses from{" "}
            {conversationAnalysisResponse.data?.user_ids.length} participants
            who voted on {conversationAnalysisResponse.data?.comment_ids.length}{" "}
            statements.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            <strong className="text-gray-900">Consensus Score:</strong> The
            consensus score ranges from 0 to 1, where higher scores indicate
            stronger agreement across all participants. Scores above 0.65 are
            generally considered points of consensus.
          </p>
        </div>
      </div>
    </CoreBase>
  );
}
