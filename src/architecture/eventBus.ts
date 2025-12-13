import type { EventBus, EventHandler, MSAUEvent } from './types.js';

type Subscription = { id: string; handler: EventHandler };

export class InMemoryEventBus implements EventBus {
  private subscribers: Map<string, Subscription[]> = new Map();
  private seq = 0;

  subscribe(eventType: string, handler: EventHandler): string {
    const id = `sub_${++this.seq}`;
    const handlers = this.subscribers.get(eventType) || [];
    handlers.push({ id, handler });
    this.subscribers.set(eventType, handlers);
    return id;
  }

  unsubscribe(id: string): void {
    for (const [type, list] of this.subscribers.entries()) {
      const next = list.filter((s) => s.id !== id);
      if (next.length !== list.length) {
        if (next.length === 0) {
          this.subscribers.delete(type);
        } else {
          this.subscribers.set(type, next);
        }
        return;
      }
    }
  }

  publish(event: MSAUEvent): void {
    // Rule 2.2: Events are immutable.
    Object.freeze(event);
    if (event.payload && typeof event.payload === 'object') {
      Object.freeze(event.payload);
    }

    const handlers = this.subscribers.get(event.type);
    if (handlers) {
      handlers.forEach((sub) => {
        try {
          sub.handler(event);
        } catch (error) {
          console.error(`[InMemoryEventBus] Error handling event ${event.type}:`, error);
        }
      });
    }
  }
}
