#!/usr/bin/env node
/**
 * Add every platform-specific optional native binding to package-lock.json.
 *
 * Why this exists
 * ---------------
 * npm only records optional dependencies whose `os`/`cpu`/`libc` fields match
 * the machine that generated the lockfile. When the lockfile is generated on
 * macOS arm64, the Linux bindings for `yuku-codegen` / `yuku-parser` are
 * omitted entirely, so `npm ci` on a Linux CI runner cannot install them and
 * `npm run build` dies with:
 *
 *     Error: Failed to load native binding for linux-x64.
 *
 * `npm install --os=linux --cpu=x64` does not fix this: packages that declare a
 * `libc` field trip an arborist bug (`Cannot read properties of null (reading
 * 'edgesOut')`).
 *
 * This script walks the declared `optionalDependencies` of every package in the
 * lockfile, and inserts any missing binding entries with metadata fetched from
 * the registry, including the real `integrity` hash so `npm ci` stays verifiable.
 *
 * Run it after any dependency change that touches a native toolchain package:
 *
 *     node scripts/patch-lockfile-bindings.mjs
 *
 * It is idempotent and exits non-zero only on failure.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const LOCKFILE = 'package-lock.json';
const REGISTRY = 'https://registry.npmjs.org';

/** Packages whose optional native bindings must be present for all platforms. */
const BINDING_OWNERS = [/^yuku-codegen$/, /^yuku-parser$/, /^rolldown$/];

const lock = JSON.parse(readFileSync(LOCKFILE, 'utf8'));
const pkgs = lock.packages;

/** Resolve the node_modules path npm would use for a dependency of `parent`. */
function resolvePath(parentPath, name) {
    // Prefer hoisting to the same nesting level as the parent, matching npm.
    const prefix = parentPath === '' ? '' : `${parentPath}/`;
    return `${prefix}node_modules/${name}`;
}

async function fetchManifest(name, version) {
    const res = await fetch(`${REGISTRY}/${name}/${version}`);
    if (!res.ok) throw new Error(`${name}@${version}: HTTP ${res.status}`);
    return res.json();
}

const missing = [];

for (const [path, meta] of Object.entries(pkgs)) {
    const pkgName = meta.name ?? path.split('node_modules/').pop();
    if (!pkgName || !BINDING_OWNERS.some((re) => re.test(pkgName))) continue;

    const optional = meta.optionalDependencies ?? {};
    for (const [depName, range] of Object.entries(optional)) {
        const version = range.replace(/^[\^~]/, '');
        const hoisted = `node_modules/${depName}`;
        const nested = resolvePath(path, depName);
        if (pkgs[hoisted] || pkgs[nested]) continue;
        missing.push({ owner: pkgName, ownerPath: path, depName, version, target: hoisted });
    }
}

if (missing.length === 0) {
    console.log('All optional native bindings already present. No changes.');
    process.exit(0);
}

console.log(`Adding ${missing.length} missing binding entries:\n`);

for (const entry of missing) {
    const manifest = await fetchManifest(entry.depName, entry.version);
    const record = {
        version: manifest.version,
        resolved: manifest.dist.tarball,
        integrity: manifest.dist.integrity,
        dev: true,
        optional: true,
    };
    if (manifest.cpu) record.cpu = manifest.cpu;
    if (manifest.os) record.os = manifest.os;
    if (manifest.libc) record.libc = manifest.libc;
    if (manifest.engines) record.engines = manifest.engines;

    pkgs[entry.target] = record;
    console.log(
        `  + ${entry.target}  (os=${manifest.os ?? 'any'} cpu=${manifest.cpu ?? 'any'}${manifest.libc ? ` libc=${manifest.libc}` : ''})`,
    );
}

// Keep the lockfile key order stable so diffs stay readable.
lock.packages = Object.fromEntries(Object.entries(pkgs).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));

writeFileSync(LOCKFILE, `${JSON.stringify(lock, null, 2)}\n`);
console.log(`\nWrote ${LOCKFILE}.`);
