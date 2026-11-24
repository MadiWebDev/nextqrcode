// scripts/patch-opennext.cjs
// Ensures @opennextjs/aws works reliably on Windows & Cloudflare Workers:
// 1. Fixes copyTracedFiles symlink EPERM on Windows NTFS.
// 2. Fixes cookie parser TypeError (Cannot read properties of undefined reading 'parse') in OpenNext edge/middleware.
const fs = require('fs');
const path = require('path');

// 1. Patch copyTracedFiles.js
const copyTracedFilesPath = path.join(__dirname, '..', 'node_modules', '@opennextjs', 'aws', 'dist', 'build', 'copyTracedFiles.js');
if (fs.existsSync(copyTracedFilesPath)) {
  let content = fs.readFileSync(copyTracedFilesPath, 'utf8');
  const unpatched = `        if (symlink) {
            try {
                symlinkSync(symlink, to);
            }
            catch (e) {
                if (e.code !== "EEXIST") {
                    throw e;
                }
            }
        }`;

  const patched = `        if (symlink) {
            try {
                if (process.platform === "win32") {
                    try {
                        symlinkSync(symlink, to, "junction");
                    } catch {
                        cpSync(symlink, to, { recursive: true });
                    }
                } else {
                    symlinkSync(symlink, to);
                }
            }
            catch (e) {
                if (e.code !== "EEXIST") {
                    throw e;
                }
            }
        }`;

  if (content.includes(unpatched)) {
    content = content.replace(unpatched, patched);
    fs.writeFileSync(copyTracedFilesPath, content, 'utf8');
    console.log('[patch-opennext] Patched copyTracedFiles.js for Windows NTFS symlink compatibility.');
  }
}

// 2. Patch cookie/dist/index.js to export default for CJS/ESM interop
const cookieDistPath = path.join(__dirname, '..', 'node_modules', 'cookie', 'dist', 'index.js');
if (fs.existsSync(cookieDistPath)) {
  let cookieContent = fs.readFileSync(cookieDistPath, 'utf8');
  if (!cookieContent.includes('exports.default = exports;')) {
    cookieContent += '\nexports.default = exports;\n';
    fs.writeFileSync(cookieDistPath, cookieContent, 'utf8');
    console.log('[patch-opennext] Patched cookie/dist/index.js to provide default export.');
  }
}

// 3. Patch edge.js and node.js converters in @opennextjs/aws
for (const file of ['edge.js', 'node.js']) {
  const converterPath = path.join(__dirname, '..', 'node_modules', '@opennextjs', 'aws', 'dist', 'overrides', 'converters', file);
  if (fs.existsSync(converterPath)) {
    let convContent = fs.readFileSync(converterPath, 'utf8');
    const bug = 'cookieParser.parse(cookieHeader)';
    const fix = '(cookieParser.parse ? cookieParser.parse(cookieHeader) : (cookieParser.default?.parse ? cookieParser.default.parse(cookieHeader) : {}))';
    if (convContent.includes(bug)) {
      convContent = convContent.split(bug).join(fix);
      fs.writeFileSync(converterPath, convContent, 'utf8');
      console.log(`[patch-opennext] Patched ${file} converter for robust cookie parsing.`);
    }
  }
}

// 4. If .open-next/middleware/handler.mjs or server-functions exists, patch directly as well
for (const relPath of [
  path.join('.open-next', 'middleware', 'handler.mjs'),
  path.join('.open-next', 'server-functions', 'default', 'handler.mjs'),
]) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (fs.existsSync(fullPath)) {
    let code = fs.readFileSync(fullPath, 'utf8');
    const broken = 'import_cookie.default.parse(cookieHeader)';
    const safe = '(import_cookie.parse ? import_cookie.parse(cookieHeader) : (import_cookie.default?.parse ? import_cookie.default.parse(cookieHeader) : {}))';
    if (code.includes(broken)) {
      code = code.split(broken).join(safe);
      fs.writeFileSync(fullPath, code, 'utf8');
      console.log(`[patch-opennext] Patched cookie parser in ${relPath}.`);
    }
  }
}
