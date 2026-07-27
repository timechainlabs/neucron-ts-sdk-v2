#!/usr/bin/env node
/**
 * Add every platform-specific optional native binding to package-lock.json.
 *
 * Why this exists
 * ---------------
 * npm records an optional dependency in the lockfile only when its `os`, `cpu`,
 * and `libc` fields match the machine that generated the lockfile. A lockfile
 * written on macOS arm64 therefore omits every Linux binding, and `npm ci` on a
 * Linux CI runner then fails in one of two ways:
 *
 *   npm error Missing: lightningcss-linux-x64-gnu@1.33.0 from lock file   (npm 11+)
 *   Error: Failed to load native binding for linux-x64.                   (build time)
 *
 * npm 11 validates lockfile completeness up front, so what npm 10 tolerated is
 * now a hard `npm ci` failure.
 *
 * Passing `npm install --os=linux --cpu=x64` does not fix this: packages that
 * declare a `libc` field trip an arborist crash ("Cannot read properties of
 * null (reading 'edgesOut')").
 *
 * This script walks the declared `optionalDependencies` of every package in the
 * lockfile and inserts any entry that is missing, using metadata fetched from
 * the registry, including the real `integrity` hash so `npm ci` stays
 * verifiable. Only platform-gated packages (those declaring os/cpu/libc) are
 * added, so ordinary optional dependencies are left to npm.
 *
 * Run it after any dependency change that touches a native toolchain package:
 *
 *     node scripts/patch-lockfile-bindings.mjs
 *
 * It is idempotent, prints nothing but a summary when there is no work to do,
 * and exits non-zero only on failure.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const LOCKFILE = 'package-lock.json';
const REGISTRY = 'https://registry.npmjs.org';

const lock = JSON.parse(readFileSync(LOCKFILE, 'utf8'));
const pkgs = lock.packages;

/**
 * Every `node_modules/...` path npm could resolve `name` to from `parentPath`,
 * walking up the nesting chain the way node resolution does.
 */
function candidatePaths(parentPath, name) {
    const paths = [`node_modules/${name}`];
    if (parentPath) {
        paths.push(`${parentPath}/node_modules/${name}`);
        // Also consider each ancestor level, e.g. a binding hoisted to the
        // parent of a nested dependency rather than to the tree root.
        const segments = parentPath.split('/node_modules/');
        for (let i = segments.length - 1; i > 0; i -= 1) {
            paths.push(`${segments.slice(0, i).join('/node_modules/')}/node_modules/${name}`);
        }
    }
    return paths;
}

async function fetchManifest(name, version) {
    const res = await fetch(`${REGISTRY}/${name}/${version}`);
    if (!res.ok) throw new Error(`${name}@${version}: HTTP ${res.status}`);
    return res.json();
}

// Collect every optional dependency that no lockfile entry satisfies.
const candidates = new Map();
for (const [path, meta] of Object.entries(pkgs)) {
    for (const [depName, range] of Object.entries(meta.optionalDependencies ?? {})) {
        if (candidatePaths(path, depName).some((p) => pkgs[p])) continue;
        const version = range.replace(/^[\^~]/, '');
        candidates.set(`${depName}@${version}`, { depName, version });
    }
}

if (candidates.size === 0) {
    console.log('All optional native bindings already present. No changes.');
    process.exit(0);
}

// Fetch manifests in parallel; only platform-gated packages are worth adding.
const resolved = await Promise.all(
    [...candidates.values()].map(async ({ depName, version }) => ({
        depName,
        version,
        manifest: await fetchManifest(depName, version),
    })),
);

const added = [];
for (const { depName, manifest } of resolved) {
    const { os, cpu, libc, engines } = manifest;
    // Skip optional deps that are not platform-gated: npm can resolve those on
    // any machine, so their absence is a real constraint rather than an artifact
    // of which OS generated the lockfile.
    if (!os && !cpu && !libc) continue;

    const record = {
        version: manifest.version,
        resolved: manifest.dist.tarball,
        integrity: manifest.dist.integrity,
        dev: true,
        optional: true,
    };
    if (cpu) record.cpu = cpu;
    if (os) record.os = os;
    if (libc) record.libc = libc;
    if (engines) record.engines = engines;

    pkgs[`node_modules/${depName}`] = record;
    added.push({ depName, os, cpu, libc });
}

if (added.length === 0) {
    console.log('No platform-gated bindings were missing. No changes.');
    process.exit(0);
}

console.log(`Adding ${added.length} missing binding entries:\n`);
for (const { depName, os, cpu, libc } of added.sort((a, b) => (a.depName < b.depName ? -1 : 1))) {
    console.log(
        `  + node_modules/${depName}  (os=${os ?? 'any'} cpu=${cpu ?? 'any'}${libc ? ` libc=${libc}` : ''})`,
    );
}

// Keep the lockfile key order stable so diffs stay readable.
lock.packages = Object.fromEntries(
    Object.entries(pkgs).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
);

writeFileSync(LOCKFILE, `${JSON.stringify(lock, null, 2)}\n`);
console.log(`\nWrote ${LOCKFILE}.`);
