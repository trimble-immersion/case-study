/**
 * Pricing recommendation service – delegates to AI orchestration; stores recommendations.
 */

import type {
  PricingRecommendation,
  PricingRecommendationRequest,
  PricingRecommendationResponse,
} from "@/lib/domain/types";
import { generatePricingRecommendation } from "@/lib/ai/recommendationOrchestrator";
import { recommendationStore, ensureSeeded } from "@/lib/data/store";
import { getChangeOrderById } from "./changeOrderService";
import { setCurrentRecommendation } from "./changeOrderService";

export function getRecommendationById(id: string): PricingRecommendation | undefined {
  ensureSeeded();
  return recommendationStore.find((r) => r.id === id);
}

export function getRecommendationsByChangeOrderId(changeOrderId: string): PricingRecommendation[] {
  ensureSeeded();
  return recommendationStore.filter((r) => r.changeOrderId === changeOrderId);
}

export function getCurrentRecommendation(changeOrderId: string): PricingRecommendation | undefined {
  ensureSeeded();
  const co = getChangeOrderById(changeOrderId);
  if (!co?.currentRecommendationId) {
    const list = recommendationStore.filter((r) => r.changeOrderId === changeOrderId);
    if (list.length === 0) return undefined;
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }
  return recommendationStore.find((r) => r.id === co.currentRecommendationId);
}

export function generateAndStoreRecommendation(
  request: PricingRecommendationRequest
): PricingRecommendationResponse {
  ensureSeeded();
  const { recommendation, warnings } = generatePricingRecommendation({
    ...request,
    scopeSummary: request.scopeSummary ?? "",
    costCode: request.costCode,
  });
  recommendationStore.push(recommendation);
  setCurrentRecommendation(request.changeOrderId, recommendation.id);
  return { recommendation, warnings };
}
