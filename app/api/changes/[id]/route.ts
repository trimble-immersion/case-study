import { NextRequest, NextResponse } from "next/server";
import { getChangeById, updateChange } from "@/lib/data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const change = getChangeById(id);
  if (!change) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(change);
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await _request.json();
    const { finalTotal, status } = body;
    const updates: { finalTotal?: number; status?: "draft" | "approved" } = {};
    if (typeof finalTotal === "number") updates.finalTotal = finalTotal;
    if (status === "draft" || status === "approved") updates.status = status;
    const change = updateChange(id, updates);
    if (!change) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(change);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to update change" },
      { status: 500 }
    );
  }
}
