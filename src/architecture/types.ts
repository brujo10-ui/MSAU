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
  sessionId?: string;
  correlationId?: string;
  actor?: EventActor;
};

export type CreateEventParams<T> = {
  type: EventType;
  payload: T;
  sessionId?: string;
  correlationId?: string;
  actor?: EventActor;
};

export type EventHandler = (event: MSAUEvent) => void;

export interface EventBus {
  publish(event: MSAUEvent): void;
  subscribe(eventType: string, handler: EventHandler): string;
  unsubscribe(id: string): void;
}

export interface EventStore {
  append(event: MSAUEvent): void;
  getAll(): MSAUEvent[];
}

export interface AudioAdapter {
  // Placeholder for AudioAdapter methods
}

export interface LLMAdapter {
  // Placeholder for LLMAdapter methods
}

export interface StorageAdapter {
  // Placeholder for StorageAdapter methods
}
