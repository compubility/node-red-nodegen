# Node-Red Node Generator CLI
The CLI to generate custom node-red nodes.


## Installation
```
npm i -g @a8n/node-red-nodegen
```

## Usage
When in doubt, use the `--help` flag to any command.

Start from scratch:
```
nrg init --name my-first-node
```
Use an OpenAPI Spec file:
```
nrg generate ./my-spec-file.yml --name my-node-from-spec
```
