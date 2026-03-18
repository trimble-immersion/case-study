import Link from "next/link";
import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { ProjectService } from "@/lib/services/projectService";
import { StatusBadge } from "@/components/domain/StatusBadge";

export default function DashboardPage() {
  const projects = ProjectService.listProjects();
  const changeOrders = ChangeOrderService.listChangeOrders();
  const pending = changeOrders.filter((c) =>
    ["Draft", "In Review", "Priced", "Pending Approval"].includes(c.status)
  );
  const approved = changeOrders.filter((c) => c.status === "Approved");
  const totalBillable = approved.reduce((s, c) => s + c.finalTotal, 0);
  const unpricedCount = changeOrders.filter((c) => c.recommendedTotal === 0).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="shrink-0 border-b border-[#8a9aaa] bg-[#e4eaf0] px-2 flex items-center gap-1" style={{ height: 26 }}>
        <span className="text-[11px] font-semibold text-[#1a2a3a] mr-2">DASHBOARD — Work Queue</span>
        <span className="text-[#9aa8b6] mx-1">|</span>
        <Link href="/intake" className="btn-toolbar">New Change Order</Link>
        <button className="btn-toolbar">Refresh</button>
        <button className="btn-toolbar">Export Summary</button>
        <span className="text-[#9aa8b6] mx-1">|</span>
        <span className="text-[10px] text-[#cc4400]">⚠ Estimating MEP offline</span>
        <span className="text-[10px] text-[#9aa8b6] mx-1">·</span>
        <span className="text-[10px] text-[#4a7a4a]">ERP: connected</span>
        <span className="ml-auto text-[10px] text-[#6a7e90]">
          Session: zara.hall · {new Date().toLocaleString()}
        </span>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {/* KPI summary row */}
        <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
          {[
            { label: "Active Projects", value: projects.length, warn: false },
            { label: "Total COs", value: changeOrders.length, warn: false },
            { label: "Pending / In Review", value: pending.length, warn: pending.length > 0 },
            { label: "Unpriced Records", value: unpricedCount, warn: unpricedCount > 0 },
            { label: "Total Approved ($)", value: `$${totalBillable.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, warn: false },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="border px-2 py-1"
              style={{
                borderColor: kpi.warn ? "#c8a000" : "#b0bcc8",
                backgroundColor: kpi.warn ? "#fff8e0" : "white",
              }}
            >
              <div className="text-[9px] uppercase text-[#6a7e90] tracking-wide">{kpi.label}</div>
              <div
                className="text-[18px] font-bold"
                style={{ fontFamily: "monospace", color: kpi.warn ? "#7a5000" : "#1a2a3a" }}
              >
                {kpi.value}
              </div>
            </div>
          ))}
        </div>

        {/* System notices */}
        <div className="border border-[#c8a000] bg-[#fff8e0] px-2 py-1 mb-2 text-[11px] text-[#7a5000]">
          <span className="font-semibold">SYSTEM NOTICES: </span>
          {unpricedCount > 0 && <span>{unpricedCount} record(s) have no pricing estimate. </span>}
          <span>Estimating MEP connection lost — manual entry required for new records. </span>
          <span>
            {approved.length > 0 && `${approved.length} approved CO(s) pending ERP sync. `}
          </span>
          <span className="text-[10px]">Last ERP sync: 06:00 UTC · Next scheduled: 18:00 UTC</span>
        </div>

        {/* Work queue - pending */}
        <div className="panel mb-2">
          <div className="panel-header flex items-center justify-between">
            <span>PENDING WORK QUEUE — Action Required</span>
            <span className="text-[10px] font-normal normal-case tracking-normal text-[#7a5000]">
              {pending.length} item(s) require attention
            </span>
          </div>
          <div className="panel-body p-0">
            <table>
              <thead>
                <tr>
                  <th>CO Number</th>
                  <th>Project</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Requester</th>
                  <th style={{ textAlign: "right" }}>Est. Value ($)</th>
                  <th>Missing</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-[#6a7e90] text-center py-2">No pending items.</td>
                  </tr>
                ) : (
                  pending.map((co) => {
                    const proj = projects.find((p) => p.id === co.projectId);
                    const missingFlags = [];
                    if (!co.costCode) missingFlags.push("Cost code");
                    if (co.recommendedTotal === 0) missingFlags.push("Pricing");
                    return (
                      <tr key={co.id}>
                        <td className="font-medium text-[#1a3a7a]">{co.changeOrderNumber}</td>
                        <td className="text-[#4a5a6a]">{proj?.projectNumber ?? "—"}</td>
                        <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {co.title}
                        </td>
                        <td><StatusBadge status={co.status} /></td>
                        <td>{co.requester ?? "—"}</td>
                        <td style={{ textAlign: "right" }} className={co.recommendedTotal === 0 ? "warn-cell" : "font-medium"}>
                          {co.recommendedTotal > 0 ? co.recommendedTotal.toFixed(2) : "NOT PRICED"}
                        </td>
                        <td className={missingFlags.length > 0 ? "warn-cell" : "text-[#6a7e90]"}>
                          {missingFlags.length > 0 ? missingFlags.join(", ") : "—"}
                        </td>
                        <td>
                          <Link href={`/change-orders/${co.id}/pricing`} className="text-[11px] text-[#1a4a7a] underline">
                            Open Pricing
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Projects */}
        <div className="panel mb-2">
          <div className="panel-header">PROJECT REGISTRY — Linked Projects</div>
          <div className="panel-body p-0">
            <table>
              <thead>
                <tr>
                  <th>Project Number</th>
                  <th>Name</th>
                  <th>Owner</th>
                  <th style={{ textAlign: "right" }}>Contract Value ($)</th>
                  <th>ERP Record ID</th>
                  <th style={{ textAlign: "right" }}>Open COs</th>
                  <th>ERP Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => {
                  const projectCOs = changeOrders.filter((c) => c.projectId === p.id);
                  const openCOs = projectCOs.filter((c) => !["Approved", "Synced"].includes(c.status)).length;
                  return (
                    <tr key={p.id}>
                      <td className="font-medium text-[#1a3a7a]">{p.projectNumber}</td>
                      <td>{p.name}</td>
                      <td>{p.owner}</td>
                      <td style={{ textAlign: "right" }}>${p.contractValue.toLocaleString()}</td>
                      <td className="text-[#4a7aaa]">{p.linkedProjectRecordId ?? "—"}</td>
                      <td style={{ textAlign: "right" }} className={openCOs > 0 ? "warn-cell" : ""}>
                        {openCOs}
                      </td>
                      <td className="text-[#cc6600]">PENDING SYNC</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* All COs compact */}
        <div className="panel">
          <div className="panel-header flex items-center justify-between">
            <span>ALL CHANGE ORDERS — Full Register</span>
            <Link href="/change-orders" className="text-[10px] text-[#1a4a7a] underline font-normal normal-case tracking-normal">
              Open full register →
            </Link>
          </div>
          <div className="panel-body p-0">
            <table>
              <thead>
                <tr>
                  <th>CO Number</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Final ($)</th>
                  <th>Date Submitted</th>
                  <th>ERP Sync</th>
                </tr>
              </thead>
              <tbody>
                {changeOrders.slice(0, 8).map((co) => (
                  <tr key={co.id}>
                    <td>
                      <Link href={`/change-orders/${co.id}`} className="text-[#1a4a7a] underline">
                        {co.changeOrderNumber}
                      </Link>
                    </td>
                    <td><StatusBadge status={co.status} /></td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>{co.finalTotal.toFixed(2)}</td>
                    <td className="text-[#4a5a6a]">
                      {co.dateSubmitted ? new Date(co.dateSubmitted).toLocaleDateString() : "—"}
                    </td>
                    <td className={co.status === "Approved" ? "text-[#cc6600]" : "text-[#9aa8b6]"}>
                      {co.status === "Approved" ? "PENDING" : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="shrink-0 border-t border-[#8a9aaa] bg-[#c8d4de] px-2 py-0.5 flex items-center gap-4">
        <span className="text-[10px] text-[#2a3a4a]">CO Pricing Module v3.2.1</span>
        <span className="text-[10px] text-[#2a3a4a]">Server: TRIMBLE-APP-01</span>
        <span className="text-[10px] text-[#2a3a4a]">DB: Connected</span>
        <span className="text-[10px] text-[#cc6600]">Estimating MEP: OFFLINE</span>
        <span className="ml-auto text-[10px] text-[#2a3a4a]">
          Session started: {new Date().toLocaleString()}
        </span>
      </div>
    </div>
  );
}
