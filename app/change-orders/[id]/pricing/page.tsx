import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { PricingRecommendationService } from "@/lib/services/pricingRecommendationService";
import { DataPanel } from "@/components/domain/DataPanel";
import { CostBreakdownTable } from "@/components/domain/CostBreakdownTable";
import { ConfidenceBadge } from "@/components/domain/ConfidenceBadge";
import { PricingActions } from "./PricingActions";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const co = ChangeOrderService.getChangeOrderById(id);
  if (!co) return null;
  let rec = PricingRecommendationService.getCurrentRecommendation(id);
  if (!rec) {
    const result = PricingRecommendationService.generateAndStoreRecommendation({
      changeOrderId: id,
      projectId: co.projectId,
      laborHours: co.laborHours,
      materialTotal: co.materialTotal,
      equipmentTotal: co.equipmentTotal,
      subcontractorTotal: co.subcontractorTotal,
      scopeSummary: co.description,
      costCode: co.costCode,
    });
    rec = result.recommendation;
  }

  return (
    <div className="space-y-4">
      <DataPanel title="Recommended price">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold text-gray-900">
            ${rec.recommendedTotal.toFixed(2)}
          </span>
          <ConfidenceBadge confidence={rec.confidence} />
        </div>
      </DataPanel>
      <DataPanel title="Cost breakdown">
        <CostBreakdownTable breakdown={rec.costBreakdown} />
      </DataPanel>
      <DataPanel title="Budget & revenue impact">
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-gray-500">Budget impact</dt>
            <dd className="font-medium text-gray-900">
              ${rec.budgetImpact.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Revenue impact</dt>
            <dd className="font-medium text-gray-900">
              ${rec.revenueImpact.toFixed(2)}
            </dd>
          </div>
          {rec.scheduleImpactDays != null && (
            <div>
              <dt className="text-gray-500">Schedule impact</dt>
              <dd className="font-medium text-gray-900">
                {rec.scheduleImpactDays} day(s)
              </dd>
            </div>
          )}
        </dl>
      </DataPanel>
      <DataPanel title="Basis of estimate">
        <p className="text-sm text-gray-700">{rec.rationale}</p>
        <p className="mt-2 text-xs text-gray-500">
          Recommendation generated: {new Date(rec.createdAt).toLocaleString()}
          {rec.createdBy && ` by ${rec.createdBy}`}
        </p>
      </DataPanel>
      {(rec.warnings.length > 0 || rec.missingInfoFlags.length > 0) && (
        <DataPanel title="Warnings & missing information">
          <ul className="space-y-1 text-sm">
            {rec.warnings.map((w, i) => (
              <li key={`w-${i}`} className="text-amber-800">
                {w}
              </li>
            ))}
            {rec.missingInfoFlags.map((f, i) => (
              <li key={`f-${i}`} className="text-gray-600">
                Missing: {f}
              </li>
            ))}
          </ul>
        </DataPanel>
      )}
      <PricingActions changeOrder={co} />
    </div>
  );
}
