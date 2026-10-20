# Catch-up

Brings a running project's tickets up to date: open tickets whose work is already in the code get closed, but only the ones the user accepts. It runs when the tracker is local and at least one ticket is open (step 1 of [SKILL.md](SKILL.md) establishes both); otherwise tell the user there is nothing to catch up, and stop.

## 1. Gather the evidence

Work through every open ticket, feature folder by feature folder, in ticket-number order:

- **Commits**: search `git log` for commits whose message names the ticket (its number with the feature's wording, or its title), and list the files they touch.
- **Files**: open the files the ticket implies (the modules, tests and pages its text names or the commits touched).
- **Criteria**: judge each acceptance criterion against the code and tests as **met** (a run shows it, or the code shows it beyond doubt), **not met** (the code lacks or contradicts it), or **unverified** (only a person, or a run you cannot do, could tell: how a page looks or reads, sizes and contrast, a manual check on a device). Run the project's own test or check command when it runs as the project stands; install nothing.

A ticket is **closable** when it has commits or files that carry its work and none of its criteria is not met. Every other ticket is **not closable**.

Done when every criterion of every open ticket has a verdict with its evidence: a commit hash, a file and what it shows, or a run's result.

## 2. Show the table and ask

Show one table, one row per open ticket, with three columns:

- **Ticket**: number, title and path.
- **Evidence**: the commits (short hash), the key files, and the criteria met, not met and unverified.
- **Recommendation**: closable or not closable, with the reason in a few words.

Below it, ask which tickets to close, and suggest the closable ones. Say that closing ticks the met criteria, and that an unverified criterion stays unticked unless the user confirms it in the answer.

Done when the user has named exactly which tickets to close; "the recommended ones" names the closable ones, and "none" is a complete answer. Anything else (a question, a doubt) means you write nothing yet: answer it and ask again. When the answer is none, tell the user that no ticket changed, and stop.

## 3. Close the accepted tickets

Close each accepted ticket by the project's closing rule (the `## Closing a ticket` section of `docs/agents/issue-tracker.md`, or [closing-a-ticket.md](closing-a-ticket.md) when the project has none). In its file, change exactly these lines:

- **Criteria**: `- [ ]` becomes `- [x]` on each criterion that is met or that the user confirmed.
- **Status**: the value of the `Status:` line becomes `done`; its formatting stays (`**Status:** ready-for-agent` becomes `**Status:** done`).
- **Comment**: one new entry at the end of the file, under `## Comments` (add the heading at the end of the file if it is missing), in the shape of the entries already in the project: `**<today, YYYY-MM-DD>, <accepted in the Groundwork catch-up>:** <what was accepted>`. Name the criteria ticked, the commits that did the work, and any criterion left unticked and why. The whole entry, its label included, is in the language of the ticket. One blank line separates the heading and each entry; the file ends with a single newline.

Every other file, every other ticket among them, stays byte-identical. Never commit.

Done when each accepted ticket reads `done` with its comment, and `git status` lists among the tickets exactly the accepted ones.

## 4. Finish

Name the tickets you closed, and ask the user to review them with `git diff` and commit them themselves. Catch-up writes the ticket files only; the footprint is untouched.
