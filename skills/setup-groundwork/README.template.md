# Groundwork

This folder, together with any `<!-- groundwork:begin … -->` marked blocks in `docs/agents/`, is everything Groundwork has put into this project. Groundwork shows in the browser what the engineering skills record here: specs, tickets and their status, decisions, the glossary. It only reads the project.

## Start

From the project root:

```bash
npx -y --prefer-offline {{package}}@{{version}}
```

It serves on `http://localhost:4477` (or the next free port), reachable from this machine only, and opens the browser. `--help` lists the options.

## Change or remove

Run `/setup-groundwork` in your agent to change the version or to remove Groundwork from this project; removing takes out this folder and the marked blocks, nothing else. `config.json` is the source of truth and this file is generated from it, so edit neither by hand.
