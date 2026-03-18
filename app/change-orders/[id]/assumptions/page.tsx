import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { PricingRecommendationService } from "@/lib/services/pricingRecommendationService";
import { DataPanel } from "@/components/domain/DataPanel";
import { AssumptionsPanel } from "@/components/domain/AssumptionsPanel";

export default async function AssumptionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const co = ChangeOrderService.getChangeOrderById(id);
  if (!co) return null;
  const rec = PricingRecommendationService.getCurrentRecommendation(id);

  return (
    <div>
      {!rec ? (
        <div className="border border-[#c8a000] bg-[#fff8e0] px-2 py-1 text-[11px] text-[#7a5000]">
          ⚠ No pricing recommendation on record. Generate pricing on the Pricing tab first.
        </div>
      ) : (
        <>
          <DataPanel title="ASSUMPTIONS — Pricing Basis">
            <AssumptionsPanel assumptions={rec.assumptions} />
          </DataPanel>
          <DataPanel title="EVIDENCE &amp; REFERENCES — Supporting Documentation">
            <table>
              <thead>
                <tr>
                  <th>Ref Type</th>
                  <th>Reference / Document</th>
                  <th style={{ textAlign: "right" }}>Value ($)</th>
                  <th>Delta vs. Estimate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rec.evidence.map((e) => {
                  const delta = e.value != null ? e.value - rec.recommendedTotal : null;
                  return (
                    <tr key={e.id}>
                      <td className="font-medium">{e.type}</td>
                      <td>{e.reference}</td>
                      <td style={{ textAlign: "right" }}>
                        {e.value != null ? e.value.toFixed(2) : <span className="text-[#9aa8b6]">—</span>}
                      </td>
                      <td style={{ textAlign: "right" }} className={delta != null && delta < 0 ? "text-[#4a7a4a]" : "warn-cell"}>
                        {delta != null ? (delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)) : "—"}
                      </td>
                      <td className="text-[#6a7e90]">On file</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </DataPanel>
        </>
      )}
    </div>
  );
}
