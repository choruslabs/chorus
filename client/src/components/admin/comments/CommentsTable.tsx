import { type ModerationComment } from "../../../app/core/dashboard";
import { CommentsTableItem } from "./CommentsTableItem";

export default function CommentsTable({
  comments,
}: {
  comments: ModerationComment[];
}) {
  return (
    <>
      {(comments || []).map((item) => (
        <CommentsTableItem comment={item} />
      ))}
    </>
  );
}
