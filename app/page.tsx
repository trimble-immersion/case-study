import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Change Order Management
      </h1>
      <p className="text-gray-600">
        One flow: capture a change in the field, see a suggested price, get PM
        approval, then view it in finance as billable.
      </p>
      <ul className="flex flex-col gap-3">
        <li>
          <Link
            href="/new"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Create change
          </Link>{" "}
          – Add a new change order (title, description, labor, materials,
          equipment). Get a suggested total.
        </li>
        <li>
          <Link
            href="/pm"
            className="text-blue-600 underline hover:text-blue-800"
          >
            PM review
          </Link>{" "}
          – Review drafts, edit final total, approve.
        </li>
        <li>
          <Link
            href="/finance"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Finance summary
          </Link>{" "}
          – Table of approved changes and totals.
        </li>
      </ul>
    </div>
  );
}
