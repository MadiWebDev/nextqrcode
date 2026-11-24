import { workerData, parentPort } from 'node:worker_threads';
import { performance } from 'node:perf_hooks';

const lib = workerData.lib;
const t0 = performance.now();
const c0 = process.cpuUsage();

if (lib === 'noop') {
  const c1 = process.cpuUsage(c0);
  parentPort.postMessage({ lib, ms: +(performance.now() - t0).toFixed(1), cpuMs: +(c1.user / 1000).toFixed(1) });
} else {
  try {
    await import(lib);
    const c1 = process.cpuUsage(c0);
    parentPort.postMessage({ lib, ms: +(performance.now() - t0).toFixed(1), cpuMs: +(c1.user / 1000).toFixed(1) });
  } catch (e) {
    parentPort.postMessage({ lib, error: String(e?.message || e) });
  }
}
