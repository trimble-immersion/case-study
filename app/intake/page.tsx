"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  projectNumber: string;
  name: string;
}

export default function IntakePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requester, setRequester] = useState("");
  const [laborHours, setLaborHours] = useState("");
  const [materialTotal, setMaterialTotal] = useState("");
  const [equipmentTotal, setEquipmentTotal] = useState("");
  const [subcontractorTotal, setSubcontractorTotal] = useState("");
  const [costCode, setCostCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: Project[]) => {
        setProjects(data);
        if (data.length > 0 && !projectId) setProjectId(data[0].id);
      })
      .catch(() => setProjects([]));
  }, []);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const labor = parseFloat(laborHours);
    const material = parseFloat(materialTotal);
    const equipment = parseFloat(equipmentTotal);
    const sub = parseFloat(subcontractorTotal) || 0;
    if (
      !projectId || !title.trim() || !description.trim() ||
      isNaN(labor) || labor < 0 ||
      isNaN(material) || material < 0 ||
      isNaN(equipment) || equipment < 0
    ) {
      setError("ERR-401: Required fields incomplete or invalid. Check highlighted fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/change-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          title: title.trim(),
          description: description.trim(),
          requester: requester.trim() || undefined,
          laborHours: labor,
          materialTotal: material,
          equipmentTotal: equipment,
          subcontractorTotal: sub || undefined,
          costCode: costCode.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Create failed");
      }
      const co = await res.json();
      router.push(`/change-orders/${co.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unhandled error – contact system admin");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Page toolbar */}
      <div className="shrink-0 border-b border-[#8a9aaa] bg-[#e4eaf0] px-2 flex items-center gap-1" style={{ height: 26 }}>
        <span className="text-[11px] font-semibold text-[#1a2a3a] mr-2">CHANGE ORDER — NEW RECORD ENTRY</span>
        <span className="text-[#9aa8b6] mx-1">|</span>
        <button type="button" onClick={handleSave} className="btn-toolbar">
          {saved ? "✓ Saved" : "Save Draft"}
        </button>
        <button type="button" className="btn-toolbar">Reset</button>
        <button type="button" className="btn-toolbar">Import from Estimating</button>
        <span className="text-[#9aa8b6] mx-1">|</span>
        <span className="text-[10px] text-[#cc4400]">⚠ Unsaved changes</span>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <form onSubmit={handleSubmit}>
          {/* Header info row */}
          <div className="panel mb-2">
            <div className="panel-header">RECORD HEADER — Change Order Identification</div>
            <div className="panel-body">
              <div className="grid gap-x-4 gap-y-1" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
                <div>
                  <label className="block text-[10px] text-[#4a5a6a] uppercase mb-0.5">Linked Project *</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full"
                    required
                  >
                    <option value="">— select —</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.projectNumber} – {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[#4a5a6a] uppercase mb-0.5">Cost Code *</label>
                  <input
                    type="text"
                    value={costCode}
                    onChange={(e) => setCostCode(e.target.value)}
                    placeholder="e.g. 26-0500"
                    className="w-full"
                  />
                  {!costCode && (
                    <span className="text-[9px] text-[#cc4400]">⚠ Missing cost code</span>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] text-[#4a5a6a] uppercase mb-0.5">Requested By</label>
                  <input
                    type="text"
                    value={requester}
                    onChange={(e) => setRequester(e.target.value)}
                    placeholder="Last, First"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#4a5a6a] uppercase mb-0.5">Record Type</label>
                  <select className="w-full">
                    <option>Owner-Initiated</option>
                    <option>Field Change</option>
                    <option>Design Change</option>
                    <option>Unforeseen Condition</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[#4a5a6a] uppercase mb-0.5">Priority</label>
                  <select className="w-full">
                    <option>Normal</option>
                    <option>Urgent</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Scope section */}
          <div className="panel mb-2">
            <div className="panel-header">SCOPE — Description and Work Summary</div>
            <div className="panel-body">
              <div className="grid gap-x-4 gap-y-1" style={{ gridTemplateColumns: "1fr 2fr" }}>
                <div>
                  <label className="block text-[10px] text-[#4a5a6a] uppercase mb-0.5">Title / Short Description *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#4a5a6a] uppercase mb-0.5">Scope Narrative *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cost inputs */}
          <div className="panel mb-2">
            <div className="panel-header flex items-center justify-between">
              <span>COST INPUTS — Manual Entry Required</span>
              <span className="text-[10px] text-[#cc4400] normal-case tracking-normal font-normal">
                ⚠ Values not yet verified against Estimation MEP
              </span>
            </div>
            <div className="panel-body">
              <table style={{ marginBottom: 8 }}>
                <thead>
                  <tr>
                    <th>Cost Category</th>
                    <th>Unit</th>
                    <th>Quantity / Amount</th>
                    <th>Rate / Unit Cost ($)</th>
                    <th>Extended ($)</th>
                    <th>Source</th>
                    <th>Override</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-medium">Labor</td>
                    <td>HR</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        step={0.5}
                        value={laborHours}
                        onChange={(e) => setLaborHours(e.target.value)}
                        className="w-20"
                        required
                        placeholder="0"
                      />
                    </td>
                    <td className="text-[#6a7e90]">$85.00 (rate table)</td>
                    <td className="font-medium">
                      {laborHours ? `$${(parseFloat(laborHours) * 85).toFixed(2)}` : "—"}
                    </td>
                    <td className="text-[#6a7e90]">Contract rate table</td>
                    <td className="text-[#6a7e90]">—</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Material</td>
                    <td>LS</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={materialTotal}
                        onChange={(e) => setMaterialTotal(e.target.value)}
                        className="w-24"
                        required
                        placeholder="0.00"
                      />
                    </td>
                    <td className="text-[#6a7e90]">—</td>
                    <td className="font-medium">
                      {materialTotal ? `$${parseFloat(materialTotal).toFixed(2)}` : "—"}
                    </td>
                    <td className="warn-cell">Manual entry</td>
                    <td className="warn-cell font-semibold">YES</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Equipment</td>
                    <td>LS</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={equipmentTotal}
                        onChange={(e) => setEquipmentTotal(e.target.value)}
                        className="w-24"
                        required
                        placeholder="0.00"
                      />
                    </td>
                    <td className="text-[#6a7e90]">+15% markup applied</td>
                    <td className="font-medium">
                      {equipmentTotal ? `$${(parseFloat(equipmentTotal) * 1.15).toFixed(2)}` : "—"}
                    </td>
                    <td className="warn-cell">Manual entry</td>
                    <td className="warn-cell font-semibold">YES</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Subcontractor</td>
                    <td>LS</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={subcontractorTotal}
                        onChange={(e) => setSubcontractorTotal(e.target.value)}
                        className="w-24"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="text-[#6a7e90]">—</td>
                    <td className="font-medium">
                      {subcontractorTotal && parseFloat(subcontractorTotal) > 0
                        ? `$${parseFloat(subcontractorTotal).toFixed(2)}`
                        : <span className="text-[#6a7e90]">$0.00</span>}
                    </td>
                    <td className="text-[#6a7e90]">—</td>
                    <td className="text-[#6a7e90]">—</td>
                  </tr>
                </tbody>
              </table>
              <div className="text-[10px] text-[#6a7e90]">
                * Pricing estimate will be generated separately on the Pricing tab after record is created.
                Material and equipment values require manual verification.
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-2 border border-[#c04040] bg-[#ffe0e0] px-2 py-1 text-[11px] text-[#900000]">
              {error}
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center gap-2 border border-[#8a9aaa] bg-[#e4eaf0] px-2 py-1.5">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? "Creating record…" : "Create Change Order Record"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => router.back()}>
              Cancel
            </button>
            <span className="text-[10px] text-[#6a7e90] ml-2">
              Note: Pricing estimate not auto-generated. Use &quot;Generate Pricing&quot; on Pricing tab after creation.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
