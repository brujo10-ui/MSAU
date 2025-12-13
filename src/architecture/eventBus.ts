import type { EventBus, EventHandler, MSAUEvent, Subscription } from './types.js';

type SubscriptionEntry = { handler: EventHandler; unsubscribe: Subscription };

export class InMemoryEventBus implements EventBus {
  private subscribers: Map<string, SubscriptionEntry[]> = new Map();
  private allSubscribers: SubscriptionEntry[] = [];

  subscribe(arg1: string | EventHandler, arg2?: EventHandler): Subscription {
    // Check if it's a "subscribe all" call (1 argument, which is a function)
    if (typeof arg1 === 'function' && arg2 === undefined) {
      const handler = arg1;
      const entry: SubscriptionEntry = {
        handler,
        unsubscribe: () => {
          this.allSubscribers = this.allSubscribers.filter(s => s !== entry);
        }
      };
      this.allSubscribers.push(entry);
      return entry.unsubscribe;
    }

    // Check if it's a specific event subscription (2 arguments: string, function)
    if (typeof arg1 === 'string' && typeof arg2 === 'function') {
      const eventType = arg1;
      const handler = arg2;
      const handlers = this.subscribers.get(eventType) || [];

      const entry: SubscriptionEntry = {
        handler,
        unsubscribe: () => {
          const list = this.subscribers.get(eventType);
          if (list) {
             const next = list.filter(s => s !== entry);
             if (next.length === 0) {
               this.subscribers.delete(eventType);
             } else {
               this.subscribers.set(eventType, next);
             }
          }
        }
      };

      handlers.push(entry);
      this.subscribers.set(eventType, handlers);
      return entry.unsubscribe;
    }

    throw new Error("Invalid arguments for subscribe");
  }

  unsubscribe(subscription: Subscription): void {
    if (typeof subscription === 'function') {
      subscription();
    }
  }

  publish(event: MSAUEvent): void {
    // Rule 2.2: Events are immutable.
    Object.freeze(event);
    if (event.payload && typeof event.payload === 'object') {
      Object.freeze(event.payload);
    }

    // Notify specific subscribers
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

    // Notify "all" subscribers
    this.allSubscribers.forEach((sub) => {
      try {
        sub.handler(event);
      } catch (error) {
        console.error(`[InMemoryEventBus] Error handling event * (all):`, error);
      }
    });
  }
}
