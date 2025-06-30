import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function resolveTemplatePath(filename: string): string {
    const devPath = resolve(__dirname, '../templates', filename);
    const prodPath = resolve(__dirname, './templates', filename);
    return existsSync(prodPath) ? prodPath : devPath;
}
