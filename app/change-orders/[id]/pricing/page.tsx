import { notFound } from "next/navigation";
import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { PricingRecommendationService } from "@/lib/services/pricingRecommendationService";
import { ProjectService } from "@/lib/services/projectService";
import { CostBreakdownTable } from "@/components/domain/CostBreakdownTable";
import { ConfidenceBadge } from "@/components/domain/ConfidenceBadge";
import { ChangeOrderDetailLayout } from "../ChangeOrderDetailLayout";
import { PricingActions } from "./PricingActions";

export default function PricingPage({ params }: { params: { id: string } }) {
  const co = ChangeOrderService.getChangeOrderById(params.id);
  if (!co) return notFound();
  const project = ProjectService.getProjectById(co.projectId) ?? null;
  const rec = co.currentRecommendationId
    ? PricingRecommendationService.getRecommendationById(co.currentRecommendationId)
    : null;

  return (
    <ChangeOrderDetailLayout changeOrder={co} project={project}>
      {/* Toolbar */}
      <div className="toolbar-strip" style={{ marginBottom: 8 }}>
        <span className="toolbar-label">PRICING</span>
        <span className="toolbar-sep">|</span>
        <PricingActions changeOrderId={params.id} hasRecommendation={!!rec} />
        <span className="toolbar-sep">|</span>
        <button className="btn-toolbar">Recalculate</button>
        <button className="btn-toolbar">Override Values</button>
        <button className="btn-toolbar">Export Estimate</button>
        {rec && (
          <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-muted)" }}>
            Generated: {new Date(rec.createdAt).toLocaleString()} ·{" "}
            <ConfidenceBadge confidence={rec.confidence} />
          </span>
        )}
      </div>

      {!rec ? (
        <div className="panel" style={{ borderColor: "var(--warning-border)" }}>
          <div className="panel-header" style={{ background: "var(--warning-bg)", color: "var(--warning-text)", borderBottomColor: "var(--warning-border)" }}>
            ⚠ NO PRICING ESTIMATE ON RECORD
          </div>
          <div className="panel-body">
            <p style={{ fontSize: 12, color: "var(--warning-text)", margin: 0 }}>
              No AI pricing estimate has been generated for this change order. Click{" "}
              <strong>&quot;Generate Pricing&quot;</strong> to run the pricing engine. Verify scope and line items
              before generating. Manual override is available after generation.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Estimate summary */}
          <div className="panel">
            <div className="panel-header">ESTIMATE SUMMARY</div>
            <div style={{ padding: 0 }}>
              <table>
                <tbody>
                  <tr>
                    <th style={{ width: 180 }}>Total Estimated Value</th>
                    <td style={{ fontWeight: 700, fontFamily: "monospace", fontSize: 16 }}>
                      ${rec.recommendedTotal.toFixed(2)}
                    </td>
                    <th style={{ width: 180 }}>Confidence Level</th>
                    <td><ConfidenceBadge confidence={rec.confidence} /></td>
                  </tr>
                  <tr>
                    <th>Budget Impact</th>
                    <td className={rec.budgetImpact > 0 ? "warn-cell" : ""}>
                      {rec.budgetImpact > 0 ? `+$${rec.budgetImpact.toFixed(2)}` : "—"}
                    </td>
                    <th>Revenue Impact</th>
                    <td>{rec.revenueImpact > 0 ? `+$${rec.revenueImpact.toFixed(2)}` : "—"}</td>
                  </tr>
                  <tr>
                    <th>Schedule Impact</th>
                    <td>{rec.scheduleImpactDays != null ? `${rec.scheduleImpactDays} days` : "Not assessed"}</td>
                    <th>Generated At</th>
                    <td style={{ color: "var(--text-secondary)" }}>{new Date(rec.createdAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Rationale</th>
                    <td colSpan={3} style={{ color: "var(--text-secondary)", fontSize: 12 }}>{rec.rationale}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="panel">
            <div className="panel-header">COST BREAKDOWN — By Category</div>
            <div style={{ padding: 0 }}>
              <CostBreakdownTable breakdown={rec.costBreakdown} />
            </div>
          </div>

          {/* Warnings / missing info */}
          {(rec.warnings.length > 0 || rec.missingInfoFlags.length > 0) && (
            <div className="panel" style={{ borderColor: "var(--warning-border)" }}>
              <div className="panel-header" style={{ background: "var(--warning-bg)", color: "var(--warning-text)", borderBottomColor: "var(--warning-border)" }}>
                WARNINGS &amp; MISSING DATA FLAGS
              </div>
              <div style={{ padding: 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rec.warnings.map((w, i) => (
                      <tr key={i}>
                        <td className="warn-cell" style={{ fontWeight: 700, fontSize: 11 }}>WARNING</td>
                        <td>{w}</td>
                      </tr>
                    ))}
                    {rec.missingInfoFlags.map((f, i) => (
                      <tr key={`f-${i}`}>
                        <td className="error-cell" style={{ fontWeight: 700, fontSize: 11 }}>MISSING DATA</td>
                        <td>{f}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </ChangeOrderDetailLayout>
  );
}
