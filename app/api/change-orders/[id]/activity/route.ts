import { NextResponse } from "next/server";
import { getChangeOrderById } from "@/lib/services/changeOrderService";
import { getActivityByChangeOrderId } from "@/lib/services/auditService";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const co = getChangeOrderById(id);
  if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const activity = getActivityByChangeOrderId(id);
  return NextResponse.json(activity);
}
