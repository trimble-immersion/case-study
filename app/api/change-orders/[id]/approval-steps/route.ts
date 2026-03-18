import { NextResponse } from "next/server";
import { getChangeOrderById } from "@/lib/services/changeOrderService";
import { getApprovalSteps } from "@/lib/services/approvalWorkflowService";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const co = getChangeOrderById(id);
  if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const steps = getApprovalSteps(id);
  return NextResponse.json(steps);
}
