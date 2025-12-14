import { InMemoryEventBus } from './eventBus.js';
import { InMemoryEventStore } from './eventStore.js';
import { MSAUOrchestrator } from './MSAUOrchestrator.js';
import { MockAudioAdapter, MockLLMAdapter, MockStorageAdapter } from '../adapters/mockAdapters.js';

// Instantiate dependencies
const eventBus = new InMemoryEventBus();
const eventStore = new InMemoryEventStore();

const audioAdapter = new MockAudioAdapter();
const llmAdapter = new MockLLMAdapter();
const storageAdapter = new MockStorageAdapter();

// Instantiate Orchestrator (Singleton)
export const orchestrator = new MSAUOrchestrator(
  eventBus,
  eventStore,
  audioAdapter,
  llmAdapter,
  storageAdapter
);

// Export store separately if needed, though it's accessible via orchestrator.store
export const store = eventStore;
