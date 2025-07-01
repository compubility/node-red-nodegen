#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();
import { handleInit } from './commands/init.js';
import { handleGenerate } from './commands/generate.js';

program
    .name('nrg')
    .description('Node-RED node generator CLI')
    .version('1.0.0');

program
    .command('init')
    .description('Initialize a blank Node-RED node')
    .option('-n, --name <string>', 'Name of the node')
    .option('-c, --category <string>', 'Node-RED category')
    .option('-o, --output <path>', 'Output directory')
    .option('-p, --prefix <prefix>', 'Package name prefix', 'node-red-contrib')
    .option('-f, --force', 'Overwrite directory if it exists', false)
    .action(handleInit);

program
    .command('generate')
    .description('Generate Node-RED nodes from OpenAPI spec')
    .argument('<spec>', 'Path or URL to OpenAPI spec')
    .option('-n, --name <string>', 'Base name for the nodes')
    .option('-o, --output <path>', 'Output directory')
    .option('-b, --base-url <string>', 'Override base URL')
    .option('-p, --prefix <prefix>', 'Package name prefix', 'node-red-contrib')
    .option('-f, --force', 'Overwrite directory if it exists', false)
    .action(handleGenerate);

program.parse(process.argv);
