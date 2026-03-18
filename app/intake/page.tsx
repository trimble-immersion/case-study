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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const labor = parseFloat(laborHours);
    const material = parseFloat(materialTotal);
    const equipment = parseFloat(equipmentTotal);
    const sub = parseFloat(subcontractorTotal) || 0;
    if (!projectId || !title.trim() || !description.trim() || isNaN(labor) || labor < 0 || isNaN(material) || material < 0 || isNaN(equipment) || equipment < 0) {
      setError("Complete required fields with valid numbers.");
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
        throw new Error(data.error || "Failed to create");
      }
      const co = await res.json();
      router.push(`/change-orders/${co.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold text-gray-900">Change Order Intake</h1>
      <p className="text-sm text-gray-600">
        Enter scope and cost inputs. A recommended price will be generated from labor, material, equipment, and subcontractor amounts.
      </p>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded border border-gray-200 bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-700">Linked project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              required
            >
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectNumber} – {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Cost code</label>
            <input
              type="text"
              value={costCode}
              onChange={(e) => setCostCode(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              placeholder="e.g. 26-0500"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">Description / scope</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">Requester</label>
          <input
            type="text"
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-700">Labor (hours)</label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={laborHours}
              onChange={(e) => setLaborHours(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Material ($)</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={materialTotal}
              onChange={(e) => setMaterialTotal(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Equipment ($)</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={equipmentTotal}
              onChange={(e) => setEquipmentTotal(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Subcontractor ($)</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={subcontractorTotal}
              onChange={(e) => setSubcontractorTotal(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create change order"}
        </button>
      </form>
    </div>
  );
}
