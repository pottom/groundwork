# Prepare

Builds the plan for a project without `.groundwork/`. Steps 3–5 of [SKILL.md](SKILL.md) then show it, write it and finish.

## 1. The version

Look up the current version: `npm view <package> version`, with the package named in [SKILL.md](SKILL.md). Pin exactly that version, e.g. `0.2.0`.

If the lookup fails (the package is not published yet, or there is no network), say so and ask the user which exact version to pin, before you show the plan. Pin `latest` only when the user asks for it in so many words.

## 2. The launch mode

The launch mode is `npx`. The plan names the command it gives: `npx -y --prefer-offline <package>@<version>`, run from the project root.

## 3. The plan

- Create `.groundwork/config.json` with the version and `"launch": "npx"`, in the shape given in [SKILL.md](SKILL.md).
- Create `.groundwork/README.md` from [README.template.md](README.template.md): replace `{{package}}` with the package name and `{{version}}` with the pinned version.
- Add the `closing-a-ticket` marked block to `docs/agents/issue-tracker.md` only when the tracker is local and the file has no `## Closing a ticket` section in any form. If the section is already there, leave the file as it is and tell the user.

### Placing the block

Insert the text of [closing-a-ticket.md](closing-a-ticket.md) right after the `## Conventions` section: before the next `## ` heading that follows it. Exactly one blank line separates the block from the text before it and from the heading after it. If the file has no `## Conventions` section, append the block at the end of the file, after exactly one blank line.
