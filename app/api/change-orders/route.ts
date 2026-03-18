import { NextRequest, NextResponse } from "next/server";
import {
  listChangeOrders,
  createChangeOrder,
  generateAndStoreRecommendation,
  recordActivity,
} from "@/lib/services";
import type { ScopeItem } from "@/lib/domain/types";

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get("projectId") ?? undefined;
  const list = listChangeOrders(projectId);
  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      projectId,
      title,
      description,
      requester,
      laborHours,
      materialTotal,
      equipmentTotal,
      subcontractorTotal,
      costCode,
    } = body;
    if (
      !projectId ||
      !title ||
      !description ||
      typeof laborHours !== "number" ||
      typeof materialTotal !== "number" ||
      typeof equipmentTotal !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }
    const scopeItems: ScopeItem[] = [
      {
        id: `s-${Date.now()}-1`,
        changeOrderId: "",
        description: body.description,
        category: "Labor",
      },
    ];
    const { recommendation } = generateAndStoreRecommendation({
      changeOrderId: "", // set after create
      projectId,
      laborHours,
      materialTotal,
      equipmentTotal,
      subcontractorTotal: subcontractorTotal ?? 0,
      scopeSummary: description,
      costCode,
    });
    const co = createChangeOrder(
      {
        projectId,
        title,
        description,
        requester,
        laborHours,
        materialTotal,
        equipmentTotal,
        subcontractorTotal,
        costCode,
      },
      scopeItems,
      recommendation.recommendedTotal
    );
    co.scopeItems.forEach((s) => (s.changeOrderId = co.id));
    co.currentRecommendationId = recommendation.id;
    recordActivity(co.id, "Created", "Change order created", undefined, requester);
    recordActivity(co.id, "PricingGenerated", "Pricing recommendation generated");
    return NextResponse.json(co);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to create change order" },
      { status: 500 }
    );
  }
}
