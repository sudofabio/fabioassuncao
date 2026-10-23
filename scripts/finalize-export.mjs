#!/usr/bin/env node
/**
 * Completes the static export that `vinext build` writes to `dist/client/`.
 *
 * vinext 1.3.0 implements `output: 'export'` for pages but leaves two gaps that
 * `next build` did not have, and both would ship a site missing files it
 * advertises:
 *
 * 1. Dynamic metadata routes (`app/sitemap.ts`, marked "use cache" so vinext
 *    prerenders them at all) are written as `<name>.route`, the artifact the
 *    Workers cache reads, instead of the file itself. They are renamed here.
 * 2. Route handlers are never prerendered ("API routes are not supported with
 *    output: 'export'"), so `/feed.xml` and `/resume.json` would be missing.
 *    Every `app/**\/route.ts` must declare `dynamic = 'force-static'` and is
 *    executed once here through Vite, exactly as the export would have, with
 *    its GET response written to the matching path.
 *
 * It also writes the Content-Security-Policy in `dist/client/_headers` from the
 * trackers enabled for this build (`scripts/lib/csp.mjs`), so an analytics or
 * ads origin is allowed only when its ID is set.
 *
 * Fails closed: a route handler that is not force-static, a non-200 response,
 * or a file that already exists stops the build rather than shipping a guess.
 * `npm run verify-export` then checks the result like any other export.
 */
import { existsSync, readdirSync, renameSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';

import { buildCsp, enabledTrackerKinds, rewriteCspHeader } from './lib/csp.mjs';
import { EXPORT_DIR } from './lib/site.mjs';

const ROOT = process.cwd();
const OUT = resolve(ROOT, EXPORT_DIR);
const APP = resolve(ROOT, 'app');
const ROUTE_ARTIFACT = '.route';
const ROUTE_FILE = /^route\.(?:ts|tsx|js|mjs)$/;

function die(message) {
  console.error(`finalize-export: ${message}`);
  process.exit(1);
}

function walk(dir, visit) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, visit);
    else if (entry.isFile()) visit(path);
  }
}

if (!existsSync(OUT)) die(`${EXPORT_DIR}/ not found. Run vinext build first.`);

// 1. Metadata route artifacts -> real files.
const renamed = [];
walk(OUT, (path) => {
  if (!path.endsWith(ROUTE_ARTIFACT)) return;
  const target = path.slice(0, -ROUTE_ARTIFACT.length);
  if (existsSync(target))
    die(`refusing to overwrite ${relative(ROOT, target)}`);
  renameSync(path, target);
  renamed.push(relative(OUT, target));
});

// 2. Force-static route handlers -> files.
const handlers = [];
walk(APP, (path) => {
  const name = path.slice(path.lastIndexOf(sep) + 1);
  if (ROUTE_FILE.test(name) && !path.includes(`${sep}__tests__${sep}`)) {
    handlers.push(path);
  }
});

// Drafts are visible only in development (`isPublished` in src/lib/posts.ts),
// and Vite would otherwise default the mode to development.
process.env.NODE_ENV = 'production';

const emitted = [];
if (handlers.length > 0) {
  const { createServer, createServerModuleRunner } = await import('vite');
  const server = await createServer({
    root: ROOT,
    configFile: false,
    mode: 'production',
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, ws: false },
    resolve: { alias: { '@': resolve(ROOT, 'src') } },
  });
  const runner = createServerModuleRunner(server.environments.ssr, {
    hmr: false,
  });

  try {
    for (const file of handlers) {
      const routePath = relative(APP, dirname(file)).split(sep).join('/');
      const mod = await runner.import(file);

      if (mod.dynamic !== 'force-static') {
        die(
          `app/${routePath}/ must export dynamic = 'force-static' to be part of a static export`,
        );
      }
      if (typeof mod.GET !== 'function') {
        die(`app/${routePath}/ has no GET handler to export`);
      }

      const response = await mod.GET(
        new Request(`http://localhost/${routePath}`),
      );
      if (response.status !== 200) {
        die(`app/${routePath}/ answered ${response.status}`);
      }

      const target = join(OUT, ...routePath.split('/'));
      if (existsSync(target)) die(`refusing to overwrite ${routePath}`);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, new Uint8Array(await response.arrayBuffer()));
      emitted.push(routePath);
    }
  } finally {
    await runner.close();
    await server.close();
  }
}

// 3. Content-Security-Policy for the trackers this build enables.
const headersPath = join(OUT, '_headers');
if (!existsSync(headersPath)) die(`${EXPORT_DIR}/_headers not found`);
const trackers = enabledTrackerKinds();
try {
  const headers = await readFile(headersPath, 'utf8');
  await writeFile(headersPath, rewriteCspHeader(headers, buildCsp(trackers)));
} catch (error) {
  die(error.message);
}

console.log(
  `finalize-export: ${[...renamed, ...emitted].length} file(s) completed in ${EXPORT_DIR}/` +
    `\n  CSP trackers: ${trackers.length ? trackers.join(', ') : 'none'}` +
    (renamed.length ? `\n  metadata routes: ${renamed.join(', ')}` : '') +
    (emitted.length ? `\n  route handlers: ${emitted.join(', ')}` : ''),
);
