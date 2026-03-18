import { getChangeOrderById } from "@/lib/services/changeOrderService";
import { getProjectById } from "@/lib/services/projectService";
import { DataPanel } from "@/components/domain/DataPanel";

export default async function ChangeOrderOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const co = getChangeOrderById(id);
  const project = co ? getProjectById(co.projectId) : null;
  if (!co) return null;

  return (
    <div className="space-y-4">
      <DataPanel title="Summary">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-gray-500">Change order</dt>
            <dd className="font-medium text-gray-900">{co.changeOrderNumber}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Requester</dt>
            <dd className="text-gray-900">{co.requester ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Date submitted</dt>
            <dd className="text-gray-900">
              {co.dateSubmitted
                ? new Date(co.dateSubmitted).toLocaleDateString()
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Cost code</dt>
            <dd className="text-gray-900">{co.costCode ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Recommended total</dt>
            <dd className="font-medium text-gray-900">
              ${co.recommendedTotal.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Final total</dt>
            <dd className="font-medium text-gray-900">
              ${co.finalTotal.toFixed(2)}
            </dd>
          </div>
        </dl>
      </DataPanel>
      <DataPanel title="Description">
        <p className="text-sm text-gray-700">{co.description}</p>
      </DataPanel>
      {project && (
        <DataPanel title="Linked project record">
          <p className="text-sm text-gray-700">
            {project.projectNumber} – {project.name}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Owner: {project.owner} · Contract value: $
            {project.contractValue.toLocaleString()}
          </p>
          {project.linkedProjectRecordId && (
            <p className="mt-1 text-xs text-gray-500">
              Linked: {project.linkedProjectRecordId}
            </p>
          )}
        </DataPanel>
      )}
    </div>
  );
}
