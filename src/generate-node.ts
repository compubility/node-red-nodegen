import fs from "fs/promises";
import mustache from "mustache";
import { dirname, join, resolve } from 'path';
import { NormalizedNode } from "./parse-openapi.js";
import { resolveTemplatePath } from './resolve-template-path.js';

export async function generateNodeFiles(node: NormalizedNode, outDir: string) {
    const nodeDir = join(outDir, node.name);
    await fs.mkdir(nodeDir, { recursive: true });

    const context = node;

    // JS
    const jsTpl = await fs.readFile(resolveTemplatePath(`/openapi-node.js.mustache`), "utf-8");
    const jsFile = mustache.render(jsTpl, context);
    await fs.writeFile(`${nodeDir}/${node.name}.js`, jsFile);

    // HTML
    const htmlTpl = await fs.readFile(resolveTemplatePath(`/openapi-node.html.mustache`), "utf-8");
    const htmlFile = mustache.render(htmlTpl, context);
    await fs.writeFile(`${nodeDir}/${node.name}.html`, htmlFile);
}
