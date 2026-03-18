import Link from "next/link";
import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { ProjectService } from "@/lib/services/projectService";
import { StatusBadge } from "@/components/domain/StatusBadge";

export default function ChangeOrdersListPage() {
  const changeOrders = ChangeOrderService.listChangeOrders();
  const projects = ProjectService.listProjects();
  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p]));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="shrink-0 border-b border-[#8a9aaa] bg-[#e4eaf0] px-2 flex items-center gap-1" style={{ height: 26 }}>
        <span className="text-[11px] font-semibold text-[#1a2a3a] mr-2">CHANGE ORDER REGISTER</span>
        <span className="text-[#9aa8b6] mx-1">|</span>
        <Link href="/intake" className="btn-toolbar">New Record</Link>
        <button className="btn-toolbar">Refresh</button>
        <button className="btn-toolbar">Export CSV</button>
        <button className="btn-toolbar">Print Register</button>
        <span className="text-[#9aa8b6] mx-1">|</span>
        <select className="text-[11px] border border-[#a0aab4] bg-white px-1 py-0" style={{ height: 20 }}>
          <option>All Projects</option>
          {projects.map((p) => <option key={p.id}>{p.projectNumber}</option>)}
        </select>
        <select className="text-[11px] border border-[#a0aab4] bg-white px-1 py-0 ml-1" style={{ height: 20 }}>
          <option>All Statuses</option>
          <option>Draft</option>
          <option>In Review</option>
          <option>Priced</option>
          <option>Pending Approval</option>
          <option>Approved</option>
        </select>
        <span className="ml-auto text-[10px] text-[#6a7e90]">
          {changeOrders.length} record(s) · last refreshed: {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Warning bar */}
      <div className="shrink-0 border-b border-[#c8a000] bg-[#fff8e0] px-2 py-0.5 flex items-center gap-3">
        <span className="text-[10px] font-semibold text-[#7a5000]">⚠ SYSTEM NOTICES:</span>
        <span className="text-[10px] text-[#7a5000]">
          {changeOrders.filter(c => c.status === "Draft").length} record(s) in Draft — pricing not generated
        </span>
        <span className="text-[10px] text-[#4a6a4a]">·</span>
        <span className="text-[10px] text-[#7a5000]">
          Estimating MEP offline — manual entry required for new records
        </span>
        <span className="text-[10px] text-[#4a6a4a]">·</span>
        <span className="text-[10px] text-[#005a00]">
          {changeOrders.filter(c => c.status === "Approved").length} record(s) approved · pending ERP sync
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-2">
        <table>
          <thead>
            <tr>
              <th style={{ width: 24 }}>#</th>
              <th>CO Number</th>
              <th>Project</th>
              <th>Title</th>
              <th>Cost Code</th>
              <th>Requester</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Labor (hrs)</th>
              <th style={{ textAlign: "right" }}>Material ($)</th>
              <th style={{ textAlign: "right" }}>Equipment ($)</th>
              <th style={{ textAlign: "right" }}>Sub ($)</th>
              <th style={{ textAlign: "right" }}>Est. Value ($)</th>
              <th style={{ textAlign: "right" }}>Final ($)</th>
              <th>Date Submitted</th>
              <th>ERP Sync</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {changeOrders.map((co, i) => {
              const project = projectMap[co.projectId];
              const missingCostCode = !co.costCode;
              const hasPricing = co.recommendedTotal > 0;
              return (
                <tr key={co.id}>
                  <td className="text-[#6a7e90]">{i + 1}</td>
                  <td className="font-medium text-[#1a3a7a]">{co.changeOrderNumber}</td>
                  <td className="text-[#4a5a6a]">{project?.projectNumber ?? "—"}</td>
                  <td style={{ maxWidth: 200 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {co.title}
                    </div>
                  </td>
                  <td className={missingCostCode ? "warn-cell" : ""}>
                    {co.costCode ?? <span className="text-[#cc4400]">MISSING</span>}
                  </td>
                  <td>{co.requester ?? "—"}</td>
                  <td><StatusBadge status={co.status} /></td>
                  <td style={{ textAlign: "right" }}>{co.laborHours}</td>
                  <td style={{ textAlign: "right" }}>{co.materialTotal.toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{co.equipmentTotal.toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>
                    {co.subcontractorTotal > 0 ? co.subcontractorTotal.toFixed(2) : <span className="text-[#9aa8b6]">—</span>}
                  </td>
                  <td style={{ textAlign: "right" }} className={!hasPricing ? "warn-cell" : "font-medium"}>
                    {hasPricing ? co.recommendedTotal.toFixed(2) : <span>NOT PRICED</span>}
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>
                    {co.finalTotal > 0 ? co.finalTotal.toFixed(2) : <span className="text-[#9aa8b6]">—</span>}
                  </td>
                  <td className="text-[#4a5a6a] whitespace-nowrap">
                    {co.dateSubmitted ? new Date(co.dateSubmitted).toLocaleDateString() : <span className="text-[#9aa8b6]">—</span>}
                  </td>
                  <td>
                    {co.status === "Approved" ? (
                      <span className="text-[10px] text-[#cc6600]">PENDING SYNC</span>
                    ) : (
                      <span className="text-[#9aa8b6] text-[10px]">—</span>
                    )}
                  </td>
                  <td>
                    <Link
                      href={`/change-orders/${co.id}`}
                      className="text-[11px] text-[#1a4a7a] underline hover:text-[#1a3a5c]"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Status bar */}
      <div className="shrink-0 border-t border-[#8a9aaa] bg-[#c8d4de] px-2 py-0.5 flex items-center gap-4">
        <span className="text-[10px] text-[#2a3a4a]">Total records: {changeOrders.length}</span>
        <span className="text-[10px] text-[#2a3a4a]">
          Approved: {changeOrders.filter(c => c.status === "Approved").length}
        </span>
        <span className="text-[10px] text-[#2a3a4a]">
          Total approved value: ${changeOrders.filter(c => c.status === "Approved").reduce((s, c) => s + c.finalTotal, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
