import type { EventStore, MSAUEvent } from './types.js';

export class InMemoryEventStore implements EventStore {
  private events: MSAUEvent[] = [];

  append(event: MSAUEvent): void {
    // Rule 2.1: Events are append-only.
    // Rule 2.2: Events are immutable.
    Object.freeze(event);
    if (event.payload && typeof event.payload === 'object') {
      Object.freeze(event.payload);
    }
    this.events.push(event);
  }

  getAll(): MSAUEvent[] {
    // Return a shallow copy to protect the internal array.
    return [...this.events];
  }
}
