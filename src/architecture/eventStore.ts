import type { EventStore, MSAUEvent } from './types.js';

export class InMemoryEventStore implements EventStore {
  private events: MSAUEvent[] = [];

  append(event: MSAUEvent): void {
    // Rule 2.1: Events are append-only.
    // Rule 2.2: Events are immutable.
    // Defensive copy to prevent external mutation of the stored event shell.
    const e = { ...event };
    Object.freeze(e);
    if (e.payload && typeof e.payload === 'object') {
      Object.freeze(e.payload);
    }
    this.events.push(e);
  }

  getAll(): MSAUEvent[] {
    // Return a shallow copy to protect the internal array.
    return [...this.events];
  }
}
