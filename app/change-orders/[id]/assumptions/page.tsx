import { notFound } from "next/navigation";
import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { PricingRecommendationService } from "@/lib/services/pricingRecommendationService";
import { ProjectService } from "@/lib/services/projectService";
import { ChangeOrderDetailLayout } from "../ChangeOrderDetailLayout";

export default function AssumptionsPage({ params }: { params: { id: string } }) {
  const co = ChangeOrderService.getChangeOrderById(params.id);
  if (!co) return notFound();
  const project = ProjectService.getProjectById(co.projectId) ?? null;
  const rec = co.currentRecommendationId
    ? PricingRecommendationService.getRecommendation(co.currentRecommendationId)
    : null;

  return (
    <ChangeOrderDetailLayout changeOrder={co} project={project}>
      <div className="toolbar-strip" style={{ marginBottom: 8 }}>
        <span className="toolbar-label">ASSUMPTIONS &amp; EVIDENCE</span>
        <span className="toolbar-sep">|</span>
        <button className="btn-toolbar">Export</button>
      </div>

      {!rec ? (
        <div className="notice-warn">No pricing recommendation on record. Generate pricing first.</div>
      ) : (
        <>
          {/* Assumptions */}
          <div className="panel">
            <div className="panel-header">PRICING ASSUMPTIONS</div>
            <div style={{ padding: 0 }}>
              {rec.assumptions.length === 0 ? (
                <div className="notice-warn" style={{ margin: 8 }}>No assumptions recorded.</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Assumption</th>
                      <th>Source / Basis</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rec.assumptions.map((a, i) => (
                      <tr key={a.id}>
                        <td style={{ color: "var(--text-muted)" }}>{i + 1}</td>
                        <td>{a.description}</td>
                        <td style={{ color: "var(--text-secondary)" }}>{a.source ?? "—"}</td>
                        <td className="success-cell" style={{ fontWeight: 700, fontSize: 11 }}>ACTIVE</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Historical references */}
          <div className="panel">
            <div className="panel-header">HISTORICAL REFERENCES — Comparable Records</div>
            <div style={{ padding: 0 }}>
              {rec.historicalReferences.length === 0 ? (
                <div style={{ padding: 8, fontSize: 12, color: "var(--text-secondary)" }}>No comparable records found.</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>CO Reference</th>
                      <th>Description</th>
                      <th style={{ textAlign: "right" }}>Amount ($)</th>
                      <th>Delta vs. Estimate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rec.historicalReferences.map((r, i) => {
                      const delta = rec.totalCost - r.amount;
                      return (
                        <tr key={i}>
                          <td style={{ fontWeight: 600, color: "var(--blue)" }}>{r.changeOrderId}</td>
                          <td>{r.description}</td>
                          <td style={{ textAlign: "right" }}>{r.amount.toFixed(2)}</td>
                          <td
                            className={Math.abs(delta) > rec.totalCost * 0.2 ? "warn-cell" : ""}
                            style={{ fontWeight: 500 }}
                          >
                            {delta >= 0 ? "+" : ""}
                            {delta.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </ChangeOrderDetailLayout>
  );
}
