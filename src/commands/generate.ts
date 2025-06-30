import path from "path";
import fs from "fs/promises";
import { parseOpenAPISpec } from "../parse-openapi.js";
import { generateNodeFiles } from "../generate-node.js";
import { toTitleCase } from '../scripts/to-title-case.js';
import { existsSync } from 'fs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'process';

export async function handleGenerate(
    specPath: string,
    options: {
        force?: boolean;
        name?: string;
        output?: string;
        baseUrl?: string;
        prefix?: string;
    }
) {
    const name = options.name ?? "openapi-node";
    const output = path.resolve(options.output ?? "./nodes", name);
    const prefix = options.prefix ?? "node-red-contrib";

    // Parse OpenAPI into normalized node list
    const { version, nodes } = await parseOpenAPISpec(specPath);

    if (existsSync(output)) {
        if (!options.force) {
            // prompt user
            const rl = createInterface({ input: stdin, output: stdout });
            const ans = await rl.question(
                `Directory "${output}" already exists. Overwrite? (y/N) `
            );
            rl.close();

            if (!/^y(es)?$/i.test(ans.trim())) {
                console.log("🛑 Aborted. Directory not overwritten.");
                process.exit(0);
            }
        }
        await fs.rm(output, { recursive: true, force: true });

    }

    await fs.mkdir(output, { recursive: true });

    // Generate .js and .html files per node
    for (const node of nodes) {
        await generateNodeFiles(node, output);
    }
    const packagePrefix = prefix?.startsWith('@') ? `${prefix}/` : `${prefix}-`
    const packageName = `${packagePrefix}${name}`;
    const functionName = toTitleCase(name);

    // Create package.json
    const pkg = {
        functionName,
        name: packageName,
        version: "1.0.0",
        description: `Auto-generated Node-RED nodes from OpenAPI ${version} spec: ${specPath}`,
        keywords: ["node-red", "openapi", `openapi-${version}`],
        'node-red': {
        nodes: Object.fromEntries(
            nodes.map((n) => [n.name, `./${n.name}/${n.name}.js`])
        ),
    },
};

    await fs.writeFile(
        path.join(output, "package.json"),
        JSON.stringify(pkg, null, 2)
    );

    console.log(`✅ Generated ${nodes.length} nodes at: ${output}`);
}
