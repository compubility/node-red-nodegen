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
    .option('--name <string>', 'Name of the node')
    .option('--category <string>', 'Node-RED category')
    .option('--output <path>', 'Output directory')
    .option('-p, --prefix <prefix>', 'Package name prefix', 'node-red-contrib')
    .option('-f, --force', 'Overwrite directory if it exists', false)
    .action(handleInit);

program
    .command('generate')
    .description('Generate Node-RED nodes from OpenAPI spec')
    .argument('<spec>', 'Path or URL to OpenAPI spec')
    .option('--name <string>', 'Base name for the nodes')
    .option('--output <path>', 'Output directory')
    .option('--base-url <string>', 'Override base URL')
    .option('-p, --prefix <prefix>', 'Package name prefix', 'node-red-contrib')
    .option('-f, --force', 'Overwrite directory if it exists', false)
    .action(handleGenerate);

program.parse(process.argv);
