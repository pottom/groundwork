# Prepare

Builds the plan for a project without `.groundwork/`. Steps 3–5 of [SKILL.md](SKILL.md) then show it, write it and finish.

## 1. The version

Look up the current version: `npm view <package> version`, with the package named in [SKILL.md](SKILL.md). Pin exactly that version, e.g. `0.2.0`.

If the lookup fails (the package is not published yet, or there is no network), say so and ask the user which exact version to pin, before you show the plan. Pin `latest` only when the user asks for it in so many words.

## 2. The launch mode

The launch mode is `npx`. The plan names the command it gives: `npx -y --prefer-offline <package>@<version>`, run from the project root.

## 3. The closing rule

Decide what happens to `docs/agents/issue-tracker.md`. The first case that matches wins:

- **Tracker not local** (GitHub, GitLab, Jira or anything other than markdown files under `.scratch/`), or **`issue-tracker.md` missing**, so the tracker is unknown: the file stays as it is, and the plan adds no marked block, since its text speaks of the local tracker. Warn the user that Groundwork reads only the local tracker today, so their tickets will not show in it; the glossary, ADRs and README still will. A missing file is a gap in the `/setup-matt-pocock-skills` setup: say that rerunning it fills the gap.
- **Unmarked `## Closing a ticket` section**: the user's own rule. It stays exactly as it is, with no markers around it, and the plan adds no marked block. Tell the user the rule is already there, that Groundwork did not put it in, and that removing Groundwork later will leave it too. Compare its text with the rule in [closing-a-ticket.md](closing-a-ticket.md) (the lines between the markers): if they match, say so; if they differ, show the difference as a unified diff (theirs as `-`, Groundwork's as `+`), name the words that changed, and say theirs stays.
- **Otherwise** the tracker is local and has no such section: the plan adds the `closing-a-ticket` marked block, placed as below.

Done when exactly one case applies and you hold what it tells the user, ready to go into the plan.

### Placing the block

Insert the text of [closing-a-ticket.md](closing-a-ticket.md) right after the `## Conventions` section: before the next `## ` heading that follows it. Exactly one blank line separates the block from the text before it and from the heading after it. If the file has no `## Conventions` section, append the block at the end of the file, after exactly one blank line.

## 4. The plan

- Create `.groundwork/config.json` with the version and `"launch": "npx"`, in the shape given in [SKILL.md](SKILL.md).
- Create `.groundwork/README.md` from [README.template.md](README.template.md): replace `{{package}}` with the package name and `{{version}}` with the pinned version.
- The outcome of step 3: the marked block to add, or the warning or notice, with the diff when there is one, and the statement that `docs/agents/issue-tracker.md` stays unchanged.
