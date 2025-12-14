import type {
  EventBus,
  EventStore,
  AudioAdapter,
  LLMAdapter,
  StorageAdapter,
  MSAUEvent
} from './types.js';
import { createEvent, EventTypes } from './createEvent.js';

export class MSAUOrchestrator {
  private currentSessionId: string | undefined;

  constructor(
    public readonly bus: EventBus,
    public readonly store: EventStore,
    private audioAdapter: AudioAdapter,
    private illmAdapter: LLMAdapter,
    private storageAdapter: StorageAdapter
  ) {}

  public startSession(sessionId?: string): void {
    // Basic ID generation if not provided
    this.currentSessionId = sessionId ||
      (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `session-${Date.now()}`);

    const event = createEvent({
      type: EventTypes.SESSION_STARTED,
      payload: {},
      sessionId: this.currentSessionId,
      actor: 'system'
    });

    this.dispatch(event);
  }

  public endSession(): void {
    if (!this.currentSessionId) {
      // Logic for when there is no session? Just ignore or log.
      return;
    }

    const event = createEvent({
      type: EventTypes.SESSION_ENDED,
      payload: {},
      sessionId: this.currentSessionId,
      actor: 'system'
    });

    this.dispatch(event);
    this.currentSessionId = undefined;
  }

  public async teach(input: { concept: string; profile?: unknown }): Promise<void> {
    // Possibly dispatch an event before calling adapter
    const event = createEvent({
      type: 'teach.requested',
      payload: input,
      sessionId: this.currentSessionId,
      actor: 'user' // or system? assuming user request or system trigger. Let's say user request.
    });
    this.dispatch(event);

    await this.audioAdapter.teach(input);
  }

  public async validate(input: { answer: string }): Promise<void> {
    const event = createEvent({
      type: 'validate.requested',
      payload: input,
      sessionId: this.currentSessionId,
      actor: 'user'
    });
    this.dispatch(event);

    await this.illmAdapter.validate(input);
  }

  public dispatch(event: MSAUEvent): void {
    // Centralize publish + append
    this.store.append(event);
    this.bus.publish(event);
  }
}
