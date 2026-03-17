import Link from "next/link";

export function Nav() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          Change Orders
        </Link>
        <Link href="/new" className="text-gray-600 hover:text-gray-900">
          Create change
        </Link>
        <Link href="/pm" className="text-gray-600 hover:text-gray-900">
          PM review
        </Link>
        <Link href="/finance" className="text-gray-600 hover:text-gray-900">
          Finance summary
        </Link>
      </div>
    </nav>
  );
}
