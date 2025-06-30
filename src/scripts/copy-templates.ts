import { mkdir, copyFile, readdir } from 'fs/promises';
import { resolve } from 'path';

async function copyTemplates() {
    const srcDir = resolve('src/templates');
    const distDir = resolve('dist/templates');

    await mkdir(distDir, { recursive: true });

    const files = await readdir(srcDir);
    for (const file of files) {
        const srcPath = resolve(srcDir, file);
        const destPath = resolve(distDir, file);
        await copyFile(srcPath, destPath);
    }

    console.log('📦 Templates copied to dist/templates');
}

copyTemplates().catch((err) => {
    console.error('❌ Failed to copy templates:', err);
    process.exit(1);
});
