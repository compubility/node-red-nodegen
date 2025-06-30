import fs from "fs/promises";
import mustache from "mustache";
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { toTitleCase } from '../scripts/to-title-case.js';
import { existsSync } from 'fs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const templatesDir = resolve(__dirname, "../templates");

export async function handleInit({
    name,
    category = "function",
    force = false,
    output = "./",
    prefix = "node-red-contrib",
}: {
    name: string;
    category?: string;
    force?: boolean;
    output?: string;
    prefix?: string;
}) {
    const kebabName = name.toLowerCase().replace(/\s+/g, "-");
    const packagePrefix = prefix?.startsWith('@') ? `${prefix}/` : `${prefix}-`
    const packageName = `${packagePrefix}${kebabName}`;
    const dir = resolve(output, kebabName);

    if (existsSync(dir)) {
        if (!force) {
            // prompt user
            const rl = createInterface({ input: stdin, output: stdout });
            const ans = await rl.question(
                `Directory "${dir}" already exists. Overwrite? (y/N) `
            );
            rl.close();

            if (!/^y(es)?$/i.test(ans.trim())) {
                console.log("🛑 Aborted. Directory not overwritten.");
                process.exit(0);
            }
        }
        await fs.rm(dir, { recursive: true, force: true });
    }

    await fs.mkdir(dir, { recursive: true });

    const context = {
        functionName: toTitleCase(kebabName),
        name: kebabName,
        category,
        packageName,
    };

    // Write JS file
    const jsTemplate = await fs.readFile(`${templatesDir}/node.js.mustache`, "utf8");
    await fs.writeFile(`${dir}/${kebabName}.js`, mustache.render(jsTemplate, context));

    // Write HTML file
    const htmlTemplate = await fs.readFile(`${templatesDir}/node.html.mustache`, "utf8");
    await fs.writeFile(`${dir}/${kebabName}.html`, mustache.render(htmlTemplate, context));

    // Write package.json
    const pkgTemplate = await fs.readFile(`${templatesDir}/package.json.mustache`, "utf-8");
    await fs.writeFile(`${dir}/package.json`, mustache.render(pkgTemplate, context));

    console.log(`✅ Created blank Node-RED node in: ${dir}`);
}
