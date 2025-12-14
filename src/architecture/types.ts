export type EventType = string;
export type EventActor = 'system' | 'user' | 'assistant';
export type EventVersion = string;

export const EventTypes = {
  SESSION_STARTED: 'session.started',
  SESSION_ENDED: 'session.ended',
} as const;

export interface BaseEvent {
  id: string;
  timestamp: number;
}

export interface MSAUEvent<T = unknown> extends BaseEvent {
  type: EventType;
  actor: EventActor;
  version: EventVersion;
  sessionId?: string;
  correlationId: string;
  payload: T;
}

export type CreateEventContext = {
  sessionId?: string | undefined;
  correlationId?: string;
  actor?: EventActor;
};

export type CreateEventParams<T> = {
  type: EventType;
  payload: T;
  sessionId?: string | undefined;
  correlationId?: string;
  actor?: EventActor;
};

export type EventHandler = (event: MSAUEvent) => void;

// Subscription returns a cleanup function (void)
export type Subscription = () => void;

export interface EventBus {
  publish(event: MSAUEvent): void;
  // Overload: subscribe to all events
  subscribe(handler: EventHandler): Subscription;
  // Overload: subscribe to specific event type
  subscribe(eventType: string, handler: EventHandler): Subscription;
  // Unsubscribe is mainly handled by the returned Subscription function,
  // but we keep this for backward compatibility or explicit usage if needed.
  unsubscribe(subscription: Subscription): void;
}

export interface EventStore {
  append(event: MSAUEvent): void;
  getAll(): MSAUEvent[];
}

export interface AudioAdapter {
  teach(input: { concept: string; profile?: unknown }): Promise<void> | void;
}

export interface LLMAdapter {
  validate(input: { answer: string }): Promise<void> | void;
}

export interface StorageAdapter {
  // Placeholder for StorageAdapter methods
  save(key: string, data: unknown): Promise<void> | void;
  load(key: string): Promise<unknown> | unknown;
}
