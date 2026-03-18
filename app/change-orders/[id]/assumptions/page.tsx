import { getChangeOrderById } from "@/lib/services/changeOrderService";
import { getCurrentRecommendation } from "@/lib/services/pricingRecommendationService";
import { DataPanel } from "@/components/domain/DataPanel";
import { AssumptionsPanel } from "@/components/domain/AssumptionsPanel";

export default async function AssumptionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const co = getChangeOrderById(id);
  if (!co) return null;
  const rec = getCurrentRecommendation(id);

  return (
    <div className="space-y-4">
      <DataPanel title="Assumptions">
        {rec ? (
          <AssumptionsPanel assumptions={rec.assumptions} />
        ) : (
          <p className="text-sm text-gray-500">
            Generate a pricing recommendation on the Pricing tab to see assumptions.
          </p>
        )}
      </DataPanel>
      {rec && rec.evidence.length > 0 && (
        <DataPanel title="Evidence & references">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 pr-4 font-medium">Reference</th>
                <th className="pb-2 font-medium">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rec.evidence.map((e) => (
                <tr key={e.id}>
                  <td className="py-2 pr-4 text-gray-900">{e.type}</td>
                  <td className="py-2 pr-4 text-gray-700">{e.reference}</td>
                  <td className="py-2 text-gray-700">
                    {e.value != null ? `$${e.value.toFixed(2)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataPanel>
      )}
    </div>
  );
}
