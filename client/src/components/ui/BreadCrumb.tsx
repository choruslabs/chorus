export default function BreadCrumb({
  conversation,
}: {
  conversation?: string;
}) {
  return (
    <nav className="breadcrumb">
      <ol className="flex gap-1 flex-wrap">
        <li>
          <a href="/">Dashboard</a>
        </li>
        <li className="before:content-['/'] whitespace-nowrap">
          <a href="/conversation" className="pl-1">
            All conversations
          </a>
        </li>
        <li className="before:content-['/'] whitespace-nowrap">
          <a href={`/conversation/${conversation}`} className="pl-1">
            {conversation}
          </a>
        </li>
        <li className="before:content-['/'] whitespace-nowrap">
          <a
            href={`/conversation/${conversation}/edit`}
            aria-current="page"
            className="pl-1"
          >
            Edit
          </a>
        </li>
      </ol>
    </nav>
  );
}
