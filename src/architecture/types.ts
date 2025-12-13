export interface MSAUEvent<T = unknown> {
  id: string;
  type: string;
  timestamp: number;
  correlationId: string;
  payload: T;
}

export type EventHandler = (event: MSAUEvent) => void;

export interface EventBus {
  publish(event: MSAUEvent): void;
  subscribe(eventType: string, handler: EventHandler): void;
  unsubscribe(eventType: string, handler: EventHandler): void;
}

export interface EventStore {
  append(event: MSAUEvent): void;
  getAll(): MSAUEvent[];
}
