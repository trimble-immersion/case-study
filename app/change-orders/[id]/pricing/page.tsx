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
  const rec = PricingRecommendationService.getCurrentRecommendation(id);

  return (
    <div>
      {/* Toolbar */}
      <div className="border border-[#8a9aaa] bg-[#e4eaf0] px-2 flex items-center gap-1 mb-2" style={{ height: 26 }}>
        <PricingActions changeOrder={co} />
        <span className="text-[#9aa8b6] mx-1">|</span>
        <button className="btn-toolbar">Recalculate</button>
        <button className="btn-toolbar">Override Total</button>
        <button className="btn-toolbar">Export Estimate</button>
        {rec && (
          <>
            <span className="text-[#9aa8b6] mx-1">|</span>
            <span className="text-[10px] text-[#6a7e90]">
              Generated: {new Date(rec.createdAt).toLocaleString()} · {rec.createdBy ?? "SYSTEM"}
            </span>
            <span className="ml-2"><ConfidenceBadge confidence={rec.confidence} /></span>
          </>
        )}
      </div>

      {!rec ? (
        <div className="border border-[#c8a000] bg-[#fff8e0] px-3 py-2 mb-2">
          <div className="text-[11px] font-semibold text-[#7a5000]">⚠ NO PRICING ESTIMATE ON RECORD</div>
          <div className="text-[11px] text-[#7a5000] mt-0.5">
            A pricing estimate has not been generated for this change order.
            Click <strong>Generate Pricing</strong> in the toolbar above to run the pricing engine.
            Manual override is also available.
          </div>
          <div className="text-[10px] text-[#9a7000] mt-1">
            Note: Estimating MEP is currently offline. Values will be calculated using internal rate tables only.
          </div>
        </div>
      ) : (
        <>
          {/* Recommended value header */}
          <DataPanel title="ESTIMATE VALUE — AI-Assisted Pricing Output">
            <div className="flex items-start gap-6">
              <div>
                <div className="text-[10px] text-[#6a7e90] uppercase mb-0.5">Recommended Estimate Value</div>
                <div className="text-[22px] font-bold text-[#1a2a3a]" style={{ fontFamily: "monospace" }}>
                  ${rec.recommendedTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-[#6a7e90] mt-0.5">System-generated · subject to PM review and override</div>
              </div>
              <div className="border-l border-[#b0bcc8] pl-4">
                <table style={{ minWidth: 240 }}>
                  <tbody>
                    <tr>
                      <td className="text-[#6a7e90]">Budget Impact</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>${rec.budgetImpact.toFixed(2)}</td>
                      <td className="text-[10px] warn-cell pl-2">↑ Increase</td>
                    </tr>
                    <tr>
                      <td className="text-[#6a7e90]">Revenue Impact</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>${rec.revenueImpact.toFixed(2)}</td>
                      <td className="text-[10px] text-[#4a7a4a] pl-2">Billable</td>
                    </tr>
                    {rec.scheduleImpactDays != null && (
                      <tr>
                        <td className="text-[#6a7e90]">Schedule Impact</td>
                        <td style={{ textAlign: "right", fontWeight: 600 }}>{rec.scheduleImpactDays} day(s)</td>
                        <td className="text-[10px] warn-cell pl-2">⚠ Verify</td>
                      </tr>
                    )}
                    <tr>
                      <td className="text-[#6a7e90]">Current Final Total</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>${co.finalTotal.toFixed(2)}</td>
                      <td className="text-[10px] text-[#6a7e90] pl-2">
                        {co.finalTotal !== rec.recommendedTotal && (
                          <span className="warn-cell">OVERRIDDEN</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </DataPanel>

          {/* Cost breakdown */}
          <DataPanel title="COST BREAKDOWN — Basis of Estimate">
            <CostBreakdownTable breakdown={rec.costBreakdown} />
          </DataPanel>

          {/* Basis of estimate */}
          <DataPanel title="BASIS OF ESTIMATE — Rationale">
            <div className="border border-[#b0bcc8] bg-[#f4f6f8] px-2 py-1 text-[11px] text-[#1a2a3a] mb-1">
              {rec.rationale}
            </div>
          </DataPanel>

          {/* Warnings and flags */}
          {(rec.warnings.length > 0 || rec.missingInfoFlags.length > 0) && (
            <DataPanel title="WARNINGS &amp; MISSING INFORMATION — Manual Review Required">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Message</th>
                    <th>Action Required</th>
                  </tr>
                </thead>
                <tbody>
                  {rec.warnings.map((w, i) => (
                    <tr key={`w-${i}`}>
                      <td className="warn-cell font-semibold">WARNING</td>
                      <td className="warn-cell">{w}</td>
                      <td className="text-[#6a7e90]">Review before submission</td>
                    </tr>
                  ))}
                  {rec.missingInfoFlags.map((f, i) => (
                    <tr key={`f-${i}`}>
                      <td className="error-cell font-semibold">MISSING DATA</td>
                      <td className="error-cell">{f}</td>
                      <td className="text-[#6a7e90]">Manual input required</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DataPanel>
          )}
        </>
      )}
    </div>
  );
}
