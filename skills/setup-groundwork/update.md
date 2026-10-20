# Update the pinned version

Builds the plan for moving the pinned `version` in `.groundwork/config.json` to another version: an exact one, or `latest` on request. Steps 3–5 of [SKILL.md](SKILL.md) then show it, write it and finish.

## 1. The new version

Look up the current version as [prepare.md](prepare.md) step 1 does, then take the first case that matches:

- **The user asked for `latest`** in so many words: the new version is the string `latest`. Tell them that with `--prefer-offline` a cached earlier version may start instead of the newest one.
- **The user named an exact version** (e.g. `0.3.0`): that is the new version.
- **The lookup failed** (the package is not published yet, or there is no network): tell the user the current version could not be looked up, with npm's reason (a `404` means the package is not on npm yet), and that the pin stays at its current version. Add that they can name an exact version to pin instead. Write nothing, and skip steps 3–5 of SKILL.md.
- **Otherwise**: the looked-up version is the new version.

If the new version equals the pinned one, tell the user the project already pins it, naming it (for a looked-up version: it is the newest). Write nothing, and skip steps 3–5 of SKILL.md.

Done when you hold a new version that differs from the pinned one, or have told the user why nothing changes.

## 2. The plan

Show the pinned version and the new one side by side, with the start command each gives (`npx -y --prefer-offline <package>@<version>`). The plan changes exactly two lines:

- In `.groundwork/config.json`, the `version` value becomes the new version; every other byte stays.
- `.groundwork/README.md` is regenerated from [README.template.md](README.template.md) with the new version, which changes only its start command line.

After writing, `git diff` shows exactly these two changed lines; anything more means the write went beyond the plan, so restore it to the plan.
