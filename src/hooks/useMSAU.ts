// src/hooks/useMSAU.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MSAUEvent, EventBus, EventStore } from "../architecture/types.js";
import { reduceViewModel } from "../architecture/selectors.js";

export type MSAUViewModel = ReturnType<typeof reduceViewModel> & {
  revision: number;
};

export interface MSAUOrchestratorLike {
  bus: EventBus;
  store: EventStore;
  startSession?: (sessionId?: string) => void;
  endSession?: () => void;
  teach?: (input: { concept: string; profile?: unknown }) => Promise<void> | void;
  validate?: (input: { answer: string }) => Promise<void> | void;
}

function subscribeToAll(bus: any, handler: (event: MSAUEvent) => void): () => void {
  if (typeof bus.subscribe === "function" && bus.subscribe.length === 2) {
    return bus.subscribe(handler);
  }
  return bus.subscribe("*", handler);
}

export function useMSAU(orchestrator: MSAUOrchestratorLike) {
  const { bus, store } = orchestrator;

  const initial = useMemo(() => {
    const events = store.getAll() as MSAUEvent[];
    const baseVM = reduceViewModel(events);
    return {
      ...baseVM,
      revision: events.length,
    } as MSAUViewModel;
  }, [store]);

  const [vm, setVm] = useState<MSAUViewModel>(initial);

  const lastRevisionRef = useRef(initial.revision);

  const recompute = useCallback(() => {
    const events = store.getAll() as MSAUEvent[];
    const nextRevision = events.length;
    if (nextRevision === lastRevisionRef.current) return;

    const nextBaseVM = reduceViewModel(events);
    lastRevisionRef.current = nextRevision;
    setVm({
      ...nextBaseVM,
      revision: nextRevision,
    } as MSAUViewModel);
  }, [store]);

  useEffect(() => {
    recompute();
    const subId = subscribeToAll(bus as any, (_event: MSAUEvent) => {
      recompute();
    });
    return () => {
      try {
        bus.unsubscribe(subId);
      } catch {}
    };
  }, [bus, store, recompute]);

  const startSession = useCallback(
    (sessionId?: string) => orchestrator.startSession?.(sessionId),
    [orchestrator]
  );

  const endSession = useCallback(
    () => orchestrator.endSession?.(),
    [orchestrator]
  );

  const teach = useCallback(
    (input: { concept: string; profile?: unknown }) => orchestrator.teach?.(input),
    [orchestrator]
  );

  const validate = useCallback(
    (input: { answer: string }) => orchestrator.validate?.(input),
    [orchestrator]
  );

  return {
    vm,
    startSession,
    endSession,
    teach,
    validate,
    getEvents: useCallback(() => store.getAll() as MSAUEvent[], [store]),
    revision: vm.revision,
  };
}
