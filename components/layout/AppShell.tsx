"use client";

import { LeftNav } from "./LeftNav";
import { Header } from "./Header";
import type { Project } from "@/lib/domain/types";
import type { ChangeOrder } from "@/lib/domain/types";

interface AppShellProps {
  children: React.ReactNode;
  project?: Project | null;
  changeOrder?: ChangeOrder | null;
  title?: string;
}

export function AppShell({
  children,
  project,
  changeOrder,
  title,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <LeftNav />
      <div className="flex flex-1 flex-col min-w-0">
        <Header project={project} changeOrder={changeOrder} title={title} />
        <div className="flex-1 min-h-0">{children}</div>
      </div>
    </div>
  );
}
