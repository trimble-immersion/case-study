"use client";

export function DataPanel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded border border-gray-200 bg-white ${className}`}>
      <h3 className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700">
        {title}
      </h3>
      <div className="p-3">{children}</div>
    </section>
  );
}
