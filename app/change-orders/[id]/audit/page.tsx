import { getChangeOrderById } from "@/lib/services/changeOrderService";
import { getActivityByChangeOrderId } from "@/lib/services/auditService";
import { DataPanel } from "@/components/domain/DataPanel";
import { ActivityFeed } from "@/components/domain/ActivityFeed";

export default async function AuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const co = getChangeOrderById(id);
  if (!co) return null;
  const activity = getActivityByChangeOrderId(id);

  return (
    <div className="space-y-4">
      <DataPanel title="Activity feed">
        <p className="mb-2 text-xs text-gray-500">
          Audit trail for {co.changeOrderNumber}. Who changed what and when.
        </p>
        <ActivityFeed events={activity} />
      </DataPanel>
    </div>
  );
}
