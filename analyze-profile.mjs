import fs from 'node:fs';
const p = JSON.parse(fs.readFileSync(process.argv[2] || '.wrangler/tmp/startup-profile-oyeMG9/worker.cpuprofile', 'utf8'));
const nodes = new Map(p.nodes.map(n => [n.id, n]));
// self time samples per node
const byUrl = new Map();
const byFn = new Map();
let total = 0;
for (const n of p.nodes) {
  const h = n.hitCount || 0;
  if (!h) continue;
  total += h;
  const cf = n.callFrame || {};
  const url = cf.url || '(no url)';
  const fn = cf.functionName || '(anonymous)';
  byUrl.set(url, (byUrl.get(url) || 0) + h);
  byFn.set(fn, (byFn.get(fn) || 0) + h);
}
console.log('TOTAL self samples:', total, '\n');
console.log('=== Top by URL ===');
[...byUrl.entries()].sort((a,b)=>b[1]-a[1]).slice(0,25).forEach(([u,h])=>{
  console.log(String(h).padStart(6), u.slice(0,160));
});
console.log('\n=== Top by function ===');
[...byFn.entries()].sort((a,b)=>b[1]-a[1]).slice(0,25).forEach(([f,h])=>{
  console.log(String(h).padStart(6), f.slice(0,120));
});
// Heaviest leaf-ish nodes (high self time) with ancestor chain
console.log('\n=== Heaviest self-time nodes with call stack ===');
const heavy = p.nodes.filter(n=>(n.hitCount||0)>0).sort((a,b)=>(b.hitCount||0)-(a.hitCount||0)).slice(0,15);
for (const n of heavy) {
  const chain = [];
  let cur = n;
  while (cur && chain.length < 12) {
    const cf = cur.callFrame || {};
    chain.push(`${cf.functionName||'(anon)'} @ ${cf.url?cf.url.split('/').pop():'?'}:${cf.lineNumber}`);
    cur = cur.parent && nodes.get(cur.parent) || null;
    // cpuprofile uses children references; build parent map
  }
  console.log(`\n[hits=${n.hitCount}] ${n.callFrame.functionName||'(anon)'}`);
}
// build parent map properly
const parent = new Map();
for (const n of p.nodes) for (const c of (n.children||[])) parent.set(c, n.id);
console.log('\n=== Heaviest nodes with real parent chain ===');
for (const n of heavy) {
  const chain = [];
  let cur = n;
  while (cur && chain.length < 14) {
    const cf = cur.callFrame || {};
    chain.push(`${cf.functionName||'(anon)'} | ${(cf.url||'?').split('/').pop()}:${cf.lineNumber}`);
    cur = parent.has(cur.id) ? nodes.get(parent.get(cur.id)) : null;
  }
  console.log(`\n[hits=${n.hitCount}]`);
  chain.forEach((c,i)=>console.log('  '.repeat(i)+c));
}
