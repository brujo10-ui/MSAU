import type { AudioAdapter, LLMAdapter, StorageAdapter } from '../architecture/types.js';

export class MockAudioAdapter implements AudioAdapter {
  async teach(input: { concept: string; profile?: unknown }): Promise<void> {
    console.log(`🔊 Speaking: Teaching concept "${input.concept}"...`);
    // Simulate delay
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
}

export class MockLLMAdapter implements LLMAdapter {
  async validate(input: { answer: string }): Promise<void> {
    console.log('🤖 MockLLMAdapter: validate called with', input);
  }
}

export class MockStorageAdapter implements StorageAdapter {
  async save(key: string, data: unknown): Promise<void> {
    console.log('💾 MockStorageAdapter: save', key, data);
  }

  async load(key: string): Promise<unknown> {
    console.log('💾 MockStorageAdapter: load', key);
    return null;
  }
}
