import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts', 'src/schemas.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    // Keep `.js` for ESM and `.cjs` for CJS so output filenames match the
    // `exports` map in package.json (dist/index.js, dist/index.cjs, dist/index.d.ts).
    fixedExtension: false,
});
