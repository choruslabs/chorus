export default function CommentsTable({
  comments,
}: {
  comments: { id: string; content: string }[];
}) {
  return (
    <>
      {(comments || []).map((item) => (
        <p>{item.content}</p>
      ))}
    </>
  );
}
