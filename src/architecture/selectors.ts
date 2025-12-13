import type { MSAUEvent } from './types.js';

export const reduceViewModel = (events: MSAUEvent[]) => {
  // Simple reducer that just keeps track of the last event and count
  // Since we don't have specific requirements for the VM, this is a placeholder
  // that satisfies the usage in useMSAU.ts (which expects an object)
  const lastEvent = events.length > 0 ? events[events.length - 1] : null;
  return {
    eventCount: events.length,
    lastEvent,
    lastUpdate: Date.now(),
    // Add other properties as needed by the application
  };
};
