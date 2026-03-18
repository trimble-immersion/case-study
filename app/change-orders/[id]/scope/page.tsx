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
  const lineItems = co.scopeItems ?? [];

  return (
    <div>
      {/* Cost inputs summary */}
      <DataPanel title="SCOPE — Cost Input Summary">
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th style={{ textAlign: "right" }}>Value</th>
              <th>Unit</th>
              <th>Source</th>
              <th>Verified</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-medium">Labor Hours</td>
              <td style={{ textAlign: "right" }}>{co.laborHours}</td>
              <td>HR</td>
              <td className="warn-cell">Manual entry</td>
              <td className="warn-cell">NO</td>
              <td className="text-[#6a7e90]">Verify with field supervisor</td>
            </tr>
            <tr>
              <td className="font-medium">Material Total</td>
              <td style={{ textAlign: "right" }}>${co.materialTotal.toFixed(2)}</td>
              <td>LS</td>
              <td className="warn-cell">Manual entry</td>
              <td className="warn-cell">NO</td>
              <td className="text-[#6a7e90]">Quote or PO required</td>
            </tr>
            <tr>
              <td className="font-medium">Equipment Total</td>
              <td style={{ textAlign: "right" }}>${co.equipmentTotal.toFixed(2)}</td>
              <td>LS</td>
              <td className="warn-cell">Manual entry</td>
              <td className="text-[#4a7a4a]">+15% markup</td>
              <td className="text-[#6a7e90]">Markup applied per policy</td>
            </tr>
            <tr>
              <td className="font-medium">Subcontractor</td>
              <td style={{ textAlign: "right" }}>
                {co.subcontractorTotal > 0 ? `$${co.subcontractorTotal.toFixed(2)}` : <span className="text-[#9aa8b6]">$0.00</span>}
              </td>
              <td>LS</td>
              <td className="text-[#6a7e90]">—</td>
              <td className="text-[#6a7e90]">—</td>
              <td>
                {co.materialTotal > 5000 && co.subcontractorTotal === 0 && (
                  <span className="warn-cell">⚠ No sub – verify self-perform</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </DataPanel>

      {/* Scope description */}
      <DataPanel title="SCOPE NARRATIVE — Description of Work">
        <div className="border border-[#b0bcc8] bg-[#f4f6f8] px-2 py-1 text-[11px] text-[#1a2a3a]" style={{ minHeight: 40 }}>
          {co.description}
        </div>
        <div className="mt-1 text-[10px] text-[#cc4400]">
          ⚠ Scope not linked to drawing revision. Attach RFI or sketch before submission.
        </div>
      </DataPanel>

      {/* Line items table */}
      <DataPanel
        title="LINE ITEMS — Scope Detail"
        actions={
          <>
            <button className="btn-toolbar">Add Line Item</button>
            <button className="btn-toolbar">Import from Takeoff</button>
          </>
        }
      >
        {lineItems.length === 0 ? (
          <div className="border border-[#c8a000] bg-[#fff8e0] px-2 py-1 text-[11px] text-[#7a5000]">
            ⚠ No structured line items on record. Cost inputs above are aggregate manual entries only.
            Click &quot;Add Line Item&quot; to build itemized scope.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Category</th>
                <th>Cost Code</th>
                <th style={{ textAlign: "right" }}>Qty</th>
                <th>Unit</th>
                <th style={{ textAlign: "right" }}>Unit Cost ($)</th>
                <th style={{ textAlign: "right" }}>Total ($)</th>
                <th>Source</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((s) => (
                <tr key={s.id}>
                  <td className="text-[#6a7e90]">{s.sequence}</td>
                  <td>{s.description}</td>
                  <td>{s.category}</td>
                  <td className={!s.costCode ? "warn-cell" : ""}>{s.costCode ?? <span className="text-[#cc4400]">MISSING</span>}</td>
                  <td style={{ textAlign: "right" }}>{s.quantity ?? "—"}</td>
                  <td>{s.unit ?? "—"}</td>
                  <td style={{ textAlign: "right" }}>
                    {s.unitCost != null ? s.unitCost.toFixed(2) : <span className="warn-cell">MISSING</span>}
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>
                    {s.totalCost != null ? s.totalCost.toFixed(2) : "—"}
                  </td>
                  <td className="text-[#6a7e90]">Manual</td>
                  <td className="text-[#6a7e90] whitespace-nowrap">
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DataPanel>
    </div>
  );
}
