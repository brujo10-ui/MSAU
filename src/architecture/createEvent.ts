import {
  EventTypes,
  type BaseEvent,
  type EventType,
  type EventActor,
  type EventVersion,
  type CreateEventParams,
  type CreateEventContext,
  type MSAUEvent
} from './types.js';

export { EventTypes };

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function createEvent<TPayload = unknown>(params: CreateEventParams<TPayload>): MSAUEvent<TPayload> {
  const { type, payload, sessionId, correlationId, actor } = params;

  const event: MSAUEvent<TPayload> = {
    id: generateId(),
    timestamp: Date.now(),
    actor: actor || 'system',
    version: '1.0',
    type,
    payload,
    correlationId: correlationId || generateId(), // Ensure correlationId is present
  };

  if (sessionId) {
    event.sessionId = sessionId;
  }

  return event;
}
