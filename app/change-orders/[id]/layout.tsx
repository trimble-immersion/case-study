import { notFound } from "next/navigation";
import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { ProjectService } from "@/lib/services/projectService";
import { ChangeOrderDetailLayout } from "./ChangeOrderDetailLayout";

export default async function ChangeOrderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const co = ChangeOrderService.getChangeOrderById(id);
  if (!co) notFound();
  const project = ProjectService.getProjectById(co.projectId) ?? null;
  return (
    <ChangeOrderDetailLayout changeOrder={co} project={project}>
      {children}
    </ChangeOrderDetailLayout>
  );
}
