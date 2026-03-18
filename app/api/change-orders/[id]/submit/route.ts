import { NextResponse } from "next/server";
import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { ApprovalWorkflowService } from "@/lib/services/approvalWorkflowService";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const co = ChangeOrderService.getChangeOrderById(id);
  if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (co.status !== "Draft" && co.status !== "Priced" && co.status !== "In Review") {
    return NextResponse.json(
      { error: "Change order not in a submittable state" },
      { status: 400 }
    );
  }

  const ok = ApprovalWorkflowService.submitForApproval(id);
  if (!ok) return NextResponse.json({ error: "Submit failed" }, { status: 500 });

  const updated = ChangeOrderService.getChangeOrderById(id);
  return NextResponse.json(updated);
}
