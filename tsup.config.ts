import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    splitting: false,
    sourcemap: true,
    clean: true,
    target: 'node22',
    dts: false,
    banner: {
        js: '#!/usr/bin/env node'
    },
    onSuccess: () => {
        const src = resolve('src/templates');
        const dest = resolve('dist/templates');
        mkdirSync(dest, { recursive: true });
        for (const file of readdirSync(src)) {
            copyFileSync(resolve(src, file), resolve(dest, file));
        }
        console.log('📦 Templates copied to dist/templates');
    }
});
