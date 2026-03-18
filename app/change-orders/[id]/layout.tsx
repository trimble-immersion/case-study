import { notFound } from "next/navigation";
import { getChangeOrderById } from "@/lib/services/changeOrderService";
import { getProjectById } from "@/lib/services/projectService";
import { ChangeOrderDetailLayout } from "./ChangeOrderDetailLayout";

export default async function ChangeOrderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const co = getChangeOrderById(id);
  if (!co) notFound();
  const project = getProjectById(co.projectId) ?? null;
  return (
    <ChangeOrderDetailLayout changeOrder={co} project={project}>
      {children}
    </ChangeOrderDetailLayout>
  );
}
