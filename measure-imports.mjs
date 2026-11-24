import { Worker } from 'node:worker_threads';

// Heavy/risky server-side libs from package.json. 'noop' establishes a worker baseline.
const libs = [
  'noop',
  'next-intl',
  'next-auth',
  '@auth/mongodb-adapter',
  'mongoose',
  'mongodb',
  'nodemailer',
  'cloudinary',
  'pdfjs-dist',
  'jspdf',
  'docx',
  'mammoth',
  'jszip',
  'libphonenumber-js',
  'chrono-node',
  'qrcode',
  'jsbarcode',
  'jsqr',
  '@napi-rs/canvas',
  'heic2any',
  'utif',
  'gifenc',
  'gifuct-js',
  'recharts',
  'framer-motion',
];

function runWorker(lib) {
  return new Promise((resolve) => {
    let done = false;
    const settle = (v) => { if (!done) { done = true; resolve(v); } };
    const w = new Worker(new URL('./worker-import.mjs', import.meta.url), { workerData: { lib } });
    w.on('message', settle);
    w.on('error', (e) => settle({ lib, error: String(e?.message || e) }));
    w.on('exit', (c) => { if (!done) settle({ lib, error: 'exit ' + c }); });
  });
}

console.log('lib\twallMs\tcpuMs\terror');
for (const lib of libs) {
  const res = await runWorker(lib);
  if (res.error) console.log(`${lib}\t-\t-\t${String(res.error).slice(0, 160)}`);
  else console.log(`${lib}\t${res.ms}\t${res.cpuMs}\t`);
}
