import Link from "next/link";
import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { ProjectService } from "@/lib/services/projectService";
import { StatusBadge } from "@/components/domain/StatusBadge";

export default function FinancePage() {
  const all = ChangeOrderService.listChangeOrders();
  const projects = ProjectService.listProjects();
  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p]));
  const approved = all.filter((c) => c.status === "Approved");
  const totalImpact = approved.reduce((s, c) => s + c.finalTotal, 0);
  const totalRecommended = approved.reduce((s, c) => s + c.recommendedTotal, 0);
  const delta = totalImpact - totalRecommended;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="shrink-0 border-b border-[#8a9aaa] bg-[#e4eaf0] px-2 flex items-center gap-1" style={{ height: 26 }}>
        <span className="text-[11px] font-semibold text-[#1a2a3a] mr-2">FINANCE SUMMARY — Approved Billable Records</span>
        <span className="text-[#9aa8b6] mx-1">|</span>
        <button className="btn-toolbar">Export to ERP</button>
        <button className="btn-toolbar">Generate Invoice Batch</button>
        <button className="btn-toolbar">Print Summary</button>
        <span className="text-[#9aa8b6] mx-1">|</span>
        <span className="text-[10px] text-[#cc6600]">
          ⚠ {approved.length} record(s) pending ERP sync
        </span>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {/* Summary KPIs */}
        <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { label: "Approved Records", value: approved.length },
            { label: "Total Recommended ($)", value: `$${totalRecommended.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
            { label: "Total Approved / Billable ($)", value: `$${totalImpact.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
            { label: "Variance vs. Estimate ($)", value: `${delta >= 0 ? "+" : ""}${delta.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, warn: delta !== 0 },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="border px-2 py-1"
              style={{
                borderColor: kpi.warn ? "#c04040" : "#b0bcc8",
                backgroundColor: kpi.warn ? "#ffe0e0" : "white",
              }}
            >
              <div className="text-[9px] uppercase text-[#6a7e90] tracking-wide">{kpi.label}</div>
              <div
                className="text-[18px] font-bold"
                style={{ fontFamily: "monospace", color: kpi.warn ? "#900000" : "#1a2a3a" }}
              >
                {kpi.value}
              </div>
            </div>
          ))}
        </div>

        {/* Approved records table */}
        <div className="panel">
          <div className="panel-header flex items-center justify-between">
            <span>APPROVED CHANGE ORDERS — Billable Register</span>
            <span className="text-[10px] font-normal normal-case tracking-normal text-[#6a7e90]">
              Pending ERP sync after export
            </span>
          </div>
          <div className="panel-body p-0">
            {approved.length === 0 ? (
              <div className="px-2 py-2 text-[11px] text-[#6a7e90]">
                No approved records found.{" "}
                <Link href="/change-orders" className="text-[#1a4a7a] underline">
                  Open change order register
                </Link>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>CO Number</th>
                    <th>Project</th>
                    <th>Title</th>
                    <th>Cost Code</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Recommended ($)</th>
                    <th style={{ textAlign: "right" }}>Final Approved ($)</th>
                    <th style={{ textAlign: "right" }}>Variance ($)</th>
                    <th>Date Approved</th>
                    <th>ERP Sync</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approved.map((co) => {
                    const proj = projectMap[co.projectId];
                    const variance = co.finalTotal - co.recommendedTotal;
                    return (
                      <tr key={co.id}>
                        <td className="font-medium text-[#1a3a7a]">{co.changeOrderNumber}</td>
                        <td className="text-[#4a5a6a]">{proj?.projectNumber ?? "—"}</td>
                        <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {co.title}
                        </td>
                        <td>{co.costCode ?? <span className="warn-cell">MISSING</span>}</td>
                        <td><StatusBadge status={co.status} /></td>
                        <td style={{ textAlign: "right" }}>{co.recommendedTotal.toFixed(2)}</td>
                        <td style={{ textAlign: "right", fontWeight: 700 }}>{co.finalTotal.toFixed(2)}</td>
                        <td style={{ textAlign: "right" }} className={variance !== 0 ? "warn-cell" : "text-[#6a7e90]"}>
                          {variance >= 0 ? `+${variance.toFixed(2)}` : variance.toFixed(2)}
                        </td>
                        <td className="text-[#4a5a6a] whitespace-nowrap">
                          {co.dateSubmitted ? new Date(co.dateSubmitted).toLocaleDateString() : "—"}
                        </td>
                        <td className="text-[#cc6600]">PENDING</td>
                        <td>
                          <Link href={`/change-orders/${co.id}`} className="text-[11px] text-[#1a4a7a] underline">
                            Open
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: "#1a3a5c", color: "white" }}>
                    <td colSpan={5} style={{ fontWeight: 700, color: "white", border: "1px solid #0a2038" }}>
                      TOTAL BILLABLE IMPACT
                    </td>
                    <td style={{ textAlign: "right", color: "white", border: "1px solid #0a2038" }}>
                      {totalRecommended.toFixed(2)}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: "white", border: "1px solid #0a2038" }}>
                      {totalImpact.toFixed(2)}
                    </td>
                    <td style={{ textAlign: "right", color: delta !== 0 ? "#ffaa88" : "white", border: "1px solid #0a2038" }}>
                      {delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)}
                    </td>
                    <td colSpan={3} style={{ border: "1px solid #0a2038" }} />
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
