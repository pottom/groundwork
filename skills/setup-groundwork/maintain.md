# Maintain

The flow for a project that already has `.groundwork/`: check the footprint, then offer what this skill can do. The option the user picks builds the plan; steps 3–5 of [SKILL.md](SKILL.md) then show it, write it and finish.

When the call names a goal (e.g. `/setup-groundwork remove`), run the check, then go straight to that option's plan instead of offering the list; mention any deviation the check found alongside it.

## 1. Check

Compare the footprint with what [SKILL.md](SKILL.md) says it must be:

- **`config.json`**: valid JSON in exactly the shape given in SKILL.md: a `version` string and `"launch": "npx"`, nothing else, two-space indented, trailing newline.
- **`README.md`**: byte-identical to [README.template.md](README.template.md) rendered with the package name and the `version` from `config.json`.
- **The `closing-a-ticket` block**, when the tracker is local and `docs/agents/issue-tracker.md` has no unmarked `## Closing a ticket` section: exactly one such marked block, its lines byte-identical to [closing-a-ticket.md](closing-a-ticket.md), placed as [prepare.md](prepare.md) describes. In every other case the expected number of these blocks is zero.

Report the result to the user: either that everything is in order, or each deviation with what you expected and what you found (show the differing lines). Write nothing in this step.

Done when every one of the three items is either confirmed or reported as a deviation.

## 2. Offer

List the options and wait for the user's choice:

- **Repair** (only when the check found a deviation): the plan rewrites each deviating item to its expected form: `config.json` in the SKILL.md shape (keep a readable `version`; if there is none, ask for one as in [prepare.md](prepare.md) step 1), `README.md` regenerated from it, the block replaced by or inserted as the template, extra copies removed.
- **Remove**: see below.
- **Update the pinned version**: follow [update.md](update.md).
- **Catch up open tickets** (only with a local tracker and open tickets): follow [catch-up.md](catch-up.md).
- **Change the launch mode** and **the offline image command**: listed as coming later, with container support.

Done when the user has picked one option. Until then, write nothing. When they pick none, tell them nothing changed, and stop.

## Remove

The plan deletes the footprint and keeps everything else exactly as it is:

- Delete the `.groundwork/` folder; list each file in it.
- Find every marker line in the project: a line that is exactly `<!-- groundwork:begin <name> -->` (search the files under `docs/agents/`, where prepare puts them). For each one, delete the lines from it through its matching `<!-- groundwork:end <name> -->` line, plus exactly one adjacent blank line: the one right after the block, or the one right before it when the block ends the file. Prepare inserted the block with one blank line on each side, so this leaves the file byte-identical to before.

An unmarked `## Closing a ticket` section is the user's own and stays. Ticket files stay as they are, closed tickets included.

After writing, check that no marker line and no `.groundwork/` remain. In the finish, there is no start command to give: say that Groundwork is removed, and ask the user to review it with `git status` and `git diff` and commit it themselves.
