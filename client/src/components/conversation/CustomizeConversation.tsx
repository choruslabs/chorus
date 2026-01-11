import { useQuery } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import type { ConversationCustomization } from "../../app/core/conversation";
import type { Conversation } from "../../app/core/dashboard";
import {
  getConversationCustomization,
  updateConversationCustomization,
} from "../api/customization";

function CustomizationSettingRow({
  label,
  description,
  children,
  long = false,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  long?: boolean;
}) {
  return (
    <dl className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-6 py-4 border-b border-gray-200">
      <dt
        className={`lg:col-span-1 ${
          long ? "" : "flex flex-col justify-center"
        }`}
      >
        <p className="text-sm md:text-base font-medium text-gray-900">
          {label}
        </p>

        {description && (
          <p className="mt-0.5 text-xs text-gray-500 leading-4 lg:max-w-[32ch]">
            {description}
          </p>
        )}
      </dt>

      <dd className="mt-2 lg:mt-0 lg:col-span-2 flex flex-col justify-center">
        {children}
      </dd>
    </dl>
  );
}

function ThemeColorPicker({
  themeColor,
  setThemeColor,
}: {
  themeColor: string;
  setThemeColor: (color: string) => void;
}) {
  // from USWDS
  const colors = ["#ffbe2e", "#538200", "#04c585", "#0076d6", "#676cc8", "#d72d79"];

  return (
    <div className="flex gap-4 items-center">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={`w-10 h-10 rounded-full border-2 ${
            themeColor === color ? "border-black" : "border-transparent"
          }`}
          style={{ backgroundColor: color }}
          onClick={() => setThemeColor(color)}
        />
      ))}
      <input
        type="text"
        value={themeColor}
        onChange={(e) => setThemeColor(e.target.value)}
        className="border-1 border-gray-500 rounded-xl px-3 py-1 w-32 h-8"
      />
      <button
        type="button"
        className="px-3 py-1 bg-gray-200 rounded-xl hover:bg-gray-300"
        onClick={() => setThemeColor("")}
      >
        Clear
      </button>
    </div>
  );
}

function ThemeColorSettingRow({
  label,
  description,
  themeColor,
  setThemeColor,
}: {
  label: string;
  description?: string;
  themeColor: string;
  setThemeColor: (color: string) => void;
}) {
  return (
    <CustomizationSettingRow label={label} description={description}>
      <ThemeColorPicker themeColor={themeColor} setThemeColor={setThemeColor} />
    </CustomizationSettingRow>
  );
}

function HeaderNameSettingRow({
  label,
  description,
  headerName,
  setHeaderName,
}: {
  label: string;
  description?: string;
  headerName: string;
  setHeaderName: (name: string) => void;
}) {
  return (
    <CustomizationSettingRow label={label} description={description}>
      <input
        type="text"
        value={headerName}
        onChange={(e) => setHeaderName(e.target.value)}
        className="border-1 border-gray-500 rounded-xl px-3 py-1 w-64 h-8"
      />
    </CustomizationSettingRow>
  );
}

function KnowledgeBaseContentSettingRow({
  label,
  description,
  knowledgeBaseContent,
  setKnowledgeBaseContent,
}: {
  label: string;
  description?: string;
  knowledgeBaseContent: string;
  setKnowledgeBaseContent: (content: string) => void;
}) {
  return (
    <CustomizationSettingRow label={label} description={description} long>
      <MDEditor
        value={knowledgeBaseContent}
        onChange={(value) => setKnowledgeBaseContent(value || "")}
        height={200}
        data-color-mode="light"
      />
    </CustomizationSettingRow>
  );
}

export default function CustomizeConversation() {
  const { conversation } = useOutletContext<{ conversation: Conversation }>();

  const customization = useQuery<ConversationCustomization>({
    queryKey: ["conversation-customization", conversation.id],
    queryFn: () => getConversationCustomization(conversation.id),
  });

  const [error, setError] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState(
    customization?.data?.theme_color || "",
  );
  const [headerName, setHeaderName] = useState(
    customization?.data?.header_name || "",
  );
  const [knowledgeBaseContent, setKnowledgeBaseContent] = useState(
    customization?.data?.knowledge_base_content || "",
  );

  useEffect(() => {
    if (customization.data) {
      setThemeColor(customization.data.theme_color || "");
      setHeaderName(customization.data.header_name || "");
      setKnowledgeBaseContent(
        customization.data.knowledge_base_content || "",
      );
    }
  }, [customization.data]);

  const changesMade =
    themeColor.toLowerCase() !== (customization.data?.theme_color || "") ||
    headerName !== (customization.data?.header_name || "") ||
    knowledgeBaseContent !== (customization.data?.knowledge_base_content || "");

  const saveConversationCustomization = () => {
    updateConversationCustomization({
      conversationId: conversation.id,
      themeColor: themeColor || null,
      headerName: headerName || null,
      knowledgeBaseContent: knowledgeBaseContent || null,
    })
      .then(() => {
        customization.refetch();
        setError(null);
      })
      .catch((error) => {
        setError(error.message || "An error occurred while updating.");
      });
  };

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      <ThemeColorSettingRow
        label="Theme Color"
        themeColor={themeColor}
        setThemeColor={setThemeColor}
      />
      <HeaderNameSettingRow
        label="Header Name"
        description="This will appear instead of 'Chorus'."
        headerName={headerName}
        setHeaderName={setHeaderName}
      />
      <KnowledgeBaseContentSettingRow
        label="Conversation Knowledge Base"
        description="Enter markdown content to be rendered and shown in the 'About' tab to participants."
        knowledgeBaseContent={knowledgeBaseContent}
        setKnowledgeBaseContent={setKnowledgeBaseContent}
      />
      <button
        type="button"
        onClick={saveConversationCustomization}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-400"
        disabled={!changesMade}
      >
        Save Changes
      </button>
    </>
  );
}
