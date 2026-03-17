"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewChangePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [labor, setLabor] = useState("");
  const [materials, setMaterials] = useState("");
  const [equipment, setEquipment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const laborNum = parseFloat(labor);
    const materialsNum = parseFloat(materials);
    const equipmentNum = parseFloat(equipment);
    if (
      !title.trim() ||
      !description.trim() ||
      isNaN(laborNum) ||
      laborNum < 0 ||
      isNaN(materialsNum) ||
      materialsNum < 0 ||
      isNaN(equipmentNum) ||
      equipmentNum < 0
    ) {
      setError("Please fill all fields with valid numbers.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          labor: laborNum,
          materials: materialsNum,
          equipment: equipmentNum,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create");
      }
      const change = await res.json();
      router.push(`/${change.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create change</h1>
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="labor" className="block text-sm font-medium text-gray-700">
            Labor (hours)
          </label>
          <input
            id="labor"
            type="number"
            min={0}
            step={0.5}
            value={labor}
            onChange={(e) => setLabor(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="materials" className="block text-sm font-medium text-gray-700">
            Materials ($)
          </label>
          <input
            id="materials"
            type="number"
            min={0}
            step={0.01}
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="equipment" className="block text-sm font-medium text-gray-700">
            Equipment ($)
          </label>
          <input
            id="equipment"
            type="number"
            min={0}
            step={0.01}
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            required
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create change"}
        </button>
      </form>
    </div>
  );
}
