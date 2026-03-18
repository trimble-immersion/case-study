import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { DataPanel } from "@/components/domain/DataPanel";

export default async function ScopePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const co = ChangeOrderService.getChangeOrderById(id);
  if (!co) return null;

  return (
    <div className="space-y-4">
      <DataPanel title="Scope description">
        <p className="text-sm text-gray-700">{co.description}</p>
      </DataPanel>
      <DataPanel title="Scope items">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th className="pb-2 pr-4 font-medium">Category</th>
                <th className="pb-2 pr-4 font-medium">Description</th>
                <th className="pb-2 pr-4 font-medium">Quantity</th>
                <th className="pb-2 pr-4 font-medium">Unit</th>
                <th className="pb-2 font-medium">Cost code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {co.scopeItems.map((s) => (
                <tr key={s.id}>
                  <td className="py-2 pr-4 text-gray-900">{s.category}</td>
                  <td className="py-2 pr-4 text-gray-700">{s.description}</td>
                  <td className="py-2 pr-4 text-gray-700">{s.quantity ?? "—"}</td>
                  <td className="py-2 pr-4 text-gray-700">{s.unit ?? "—"}</td>
                  <td className="py-2 text-gray-700">{s.costCode ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataPanel>
      <DataPanel title="Cost inputs (from intake)">
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-gray-500">Labor (hours)</dt>
            <dd className="font-medium text-gray-900">{co.laborHours}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Material ($)</dt>
            <dd className="font-medium text-gray-900">
              ${co.materialTotal.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Equipment ($)</dt>
            <dd className="font-medium text-gray-900">
              ${co.equipmentTotal.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Subcontractor ($)</dt>
            <dd className="font-medium text-gray-900">
              ${co.subcontractorTotal.toFixed(2)}
            </dd>
          </div>
        </dl>
      </DataPanel>
    </div>
  );
}
