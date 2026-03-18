import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { AuditService } from "@/lib/services/auditService";
import { DataPanel } from "@/components/domain/DataPanel";
import { ActivityFeed } from "@/components/domain/ActivityFeed";

export default async function AuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const co = ChangeOrderService.getChangeOrderById(id);
  if (!co) return null;
  const activity = AuditService.getAuditTrail(id);

  return (
    <div>
      <DataPanel
        title="AUDIT LOG — Immutable Change History"
        actions={
          <>
            <button className="btn-toolbar">Export Log</button>
            <button className="btn-toolbar">Print</button>
          </>
        }
      >
        <div className="mb-1 text-[10px] text-[#6a7e90]">
          Append-only record. {activity.length} event(s) logged for {co.changeOrderNumber}.
          All timestamps in server UTC.
        </div>
        <ActivityFeed events={activity} />
      </DataPanel>
    </div>
  );
}
