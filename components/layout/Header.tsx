"use client";

import type { Project } from "@/lib/domain/types";
import type { ChangeOrder } from "@/lib/domain/types";

interface HeaderProps {
  project?: Project | null;
  changeOrder?: ChangeOrder | null;
  title?: string;
}

export function Header({ project, changeOrder, title }: HeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-4">
        {project && (
          <span className="text-sm text-gray-500">
            {project.projectNumber} – {project.name}
          </span>
        )}
        {changeOrder && (
          <span className="text-sm font-medium text-gray-800">
            {changeOrder.changeOrderNumber} · {changeOrder.title}
          </span>
        )}
        {title && !changeOrder && (
          <span className="text-sm font-medium text-gray-800">{title}</span>
        )}
      </div>
    </header>
  );
}
