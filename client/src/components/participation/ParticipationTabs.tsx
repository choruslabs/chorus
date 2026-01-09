const ConversationTab = ({
  conversationId,
  tabName,
  displayName,
  currentTab,
}: {
  conversationId: string;
  tabName: "participate" | "about";
  displayName: string;
  currentTab: "participate" | "about";
}) => {
  return (
    <a
      href={`/conversation/${conversationId}/${tabName === "participate" ? "" : tabName}`}
      className={
        "py-4 px-2 border-b-2 " +
        (currentTab === tabName
          ? "border-primary text-primary font-semibold"
          : "border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-800")
      }
    >
      {displayName}
    </a>
  );
};

export const ConversationTabs = ({
  conversationId,
  currentTab,
}: {
  conversationId: string;
  currentTab: "participate" | "about";
}) => {
  return (
    <div className="flex space-x-4">
      <ConversationTab
        conversationId={conversationId}
        tabName="participate"
        displayName="Participate"
        currentTab={currentTab}
      />
      <ConversationTab
        conversationId={conversationId}
        tabName="about"
        displayName="About"
        currentTab={currentTab}
      />
    </div>
  );
};
