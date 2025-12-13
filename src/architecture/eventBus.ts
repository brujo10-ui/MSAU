import type { EventBus, EventHandler, MSAUEvent } from './types.js';

export class InMemoryEventBus implements EventBus {
  private subscribers: Map<string, EventHandler[]> = new Map();

  subscribe(eventType: string, handler: EventHandler): void {
    const handlers = this.subscribers.get(eventType) || [];
    handlers.push(handler);
    this.subscribers.set(eventType, handlers);
  }

  publish(event: MSAUEvent): void {
    // Rule 2.2: Events are immutable.
    Object.freeze(event);
    if (event.payload && typeof event.payload === 'object') {
      Object.freeze(event.payload);
    }

    const handlers = this.subscribers.get(event.type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error(`[InMemoryEventBus] Error handling event ${event.type}:`, error);
        }
      });
    }
  }
}
