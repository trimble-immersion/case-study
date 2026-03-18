"use client";

export function DataPanel({
  title,
  children,
  className = "",
  actions,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className={`panel mb-2 ${className}`}>
      <div className="panel-header flex items-center justify-between">
        <span>{title}</span>
        {actions && <div className="flex items-center gap-1 normal-case tracking-normal font-normal">{actions}</div>}
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}
