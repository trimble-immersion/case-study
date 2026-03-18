/**
 * Simple synchronous event bus – mock of Kafka/Service Bus dispatcher.
 * In production: replace publish() with Kafka producer or Azure Service Bus send().
 * Handlers run synchronously here for demo; production handlers are async consumers.
 */

import type { DomainEvent, DomainEventType } from "./eventTypes";
import { generateId } from "@/lib/data/store";

type EventHandler<T = Record<string, unknown>> = (event: DomainEvent<T>) => void;

const handlers = new Map<DomainEventType, EventHandler[]>();
const eventLog: DomainEvent[] = [];

export const EventBus = {
  /** Subscribe a handler to an event type (simulates a Kafka consumer group). */
  subscribe<T>(eventType: DomainEventType, handler: EventHandler<T>): void {
    const existing = handlers.get(eventType) ?? [];
    handlers.set(eventType, [...existing, handler as EventHandler]);
  },

  /** Publish a domain event (simulates Kafka producer publish). */
  publish<T extends object>(
    eventType: DomainEventType,
    aggregateId: string,
    aggregateType: DomainEvent["aggregateType"],
    payload: T,
    raisedBy?: string
  ): DomainEvent<T> {
    const event: DomainEvent<T> = {
      eventId: generateId("evt"),
      eventType,
      aggregateId,
      aggregateType,
      occurredAt: new Date().toISOString(),
      raisedBy,
      payload,
    };
    eventLog.push(event as DomainEvent);
    const registered = handlers.get(eventType) ?? [];
    registered.forEach((h) => h(event as DomainEvent));
    return event;
  },

  /** Retrieve event log for an aggregate (simulates event sourcing read). */
  getEventsForAggregate(aggregateId: string): DomainEvent[] {
    return eventLog.filter((e) => e.aggregateId === aggregateId);
  },

  /** Retrieve full event log (admin / debugging). */
  getAll(): DomainEvent[] {
    return [...eventLog];
  },
};
