---
name: setup-groundwork
description: "Prepare this project for Groundwork, keep that setup current, or remove Groundwork from it."
disable-model-invocation: true
---

# Setup Groundwork

Groundwork is a local, read-only viewer for what the engineering skills (`/setup-matt-pocock-skills` and the rest) leave in a repo. This skill puts in place the little a project needs for it, and takes it out again.

Prompt-driven, not a script: explore, show the plan, and write only after the user approves that exact plan. Talk to the user in the language of the conversation. Everything written to files is English and comes from the templates in this folder, verbatim except for the `{{placeholders}}`, so two runs in the same situation write the same bytes.

## The footprint

This is everything Groundwork ever puts into a project; every flow adds, checks or removes exactly these:

- **`.groundwork/config.json`**: the source of truth, two-space indented, with a trailing newline:
  ```json
  {
    "version": "<exact version>",
    "launch": "npx"
  }
  ```
- **`.groundwork/README.md`**: generated from [README.template.md](README.template.md) with the values from `config.json`; never edited by hand, regenerated on every write.
- **Marked blocks** in the engineering skills' files, each one between `<!-- groundwork:begin <name> -->` and `<!-- groundwork:end <name> -->` lines. There is one today: `closing-a-ticket` in `docs/agents/issue-tracker.md`, its text in [closing-a-ticket.md](closing-a-ticket.md).

The package is **`@pottom/groundwork`**. This line is the one place its name is written; the templates say `{{package}}`.

The project's `CLAUDE.md` / `AGENTS.md`, `.gitignore`, ticket files and everything else stay outside the footprint.

## Process

### 1. Explore

Read what exists; assume nothing:

- `docs/agents/`: has `/setup-matt-pocock-skills` run here?
- `docs/agents/issue-tracker.md`: is the tracker **local** (markdown files under `.scratch/`) or something else (GitHub, GitLab, Jira…)?
- A `## Closing a ticket` section in that file: absent, inside a `closing-a-ticket` marked block, or **unmarked** (the user's own). If unmarked, compare its text with [closing-a-ticket.md](closing-a-ticket.md).
- `.groundwork/`: absent, or what its two files hold.

Done when you can state each of these four facts, or have found that `docs/agents/` is missing, which settles the route on its own.

### 2. Route

- **No `docs/agents/`**: stop here and write nothing. Tell the user to run `/setup-matt-pocock-skills` first (only they can start it), then run this skill again.
- **No `.groundwork/`**: follow [prepare.md](prepare.md) to build the plan.
- **`.groundwork/` present**: tell the user the project is already prepared and what you found; stop.

### 3. Show the plan and ask

Present what you found (the four facts), then the plan: every file you will create, change or delete, with the exact content of each new file and the exact lines of each block added or removed. Ask for approval of this plan.

Done when the user has clearly approved this exact plan. Anything else (a question, a change, a no) means you write nothing yet: answer, adjust the plan and show it again, or stop.

### 4. Write

Make exactly the approved changes, nothing more. Never commit.

### 5. Finish

Tell the user what you wrote, and ask them to review it with `git diff` and commit it themselves. Tell them how to start Groundwork: the command in `.groundwork/README.md`. If the version lookup failed earlier, add that the command works once that version is published.
