export const StatusPill = ({
  isActive,
  moderationStatus,
}: {
  isActive?: boolean;
  moderationStatus?: boolean | null;
}) => {
  return (
    <div
      className={`px-3 py-1 rounded-full whitespace-nowrap font-semibold w-fit ${
        isActive !== undefined
          ? isActive
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
          : moderationStatus !== undefined
          ? moderationStatus
            ? moderationStatus
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
            : "bg-gray-100"
          : ""
      }`}
    >
      &bull; &nbsp;
      {isActive !== undefined
        ? isActive
          ? "Active"
          : "Inactive"
        : moderationStatus !== undefined
        ? moderationStatus
          ? moderationStatus
            ? "approved"
            : "rejected"
          : "unmoderated"
        : ""}
    </div>
  );
};
