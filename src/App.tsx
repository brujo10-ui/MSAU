import React, { useEffect } from 'react';
import { useMSAU } from './hooks/useMSAU.js';
import { orchestrator } from './architecture/instance.js';

function App() {
  const { vm, startSession, teach } = useMSAU(orchestrator);

  useEffect(() => {
    console.log('VM Updated:', vm);
  }, [vm]);

  useEffect(() => {
    // Start a session on mount for testing
    startSession();

    // Test teach method after a short delay
    setTimeout(() => {
      teach({ concept: 'Testing Bridge' });
    }, 500);
  }, [startSession, teach]);

  return (
    <div style={{ padding: 20 }}>
      <h1>MSAU Bridge Test</h1>
      <pre>{JSON.stringify(vm, null, 2)}</pre>
    </div>
  );
}

export default App;
