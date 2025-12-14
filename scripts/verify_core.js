import { orchestrator } from '../dist/architecture/instance.js';
import { EventTypes } from '../dist/architecture/types.js';

console.log('Verifying MSAU Core Scaffolding...');

// Subscribe to all events
orchestrator.bus.subscribe((event) => {
  console.log(`[EventBus] Received event: ${event.type} (Seq: ${orchestrator.store.getAll().length})`);
});

// Start a session
console.log('Starting session...');
orchestrator.startSession('session-123');

// Check store
const events = orchestrator.store.getAll();
console.log(`Store contains ${events.length} events.`);

if (events.length > 0 && events[0].type === EventTypes.SESSION_STARTED) {
  console.log('SUCCESS: Session started event found in store.');
} else {
  console.error('FAILURE: Session started event NOT found.');
  process.exit(1);
}

// Teach something
console.log('Teaching concept...');
await orchestrator.teach({ concept: 'Hexagonal Architecture' });

console.log('Verification Complete.');
