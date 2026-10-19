# CLAUDE.md

This repo is a collection of Agent Skills, published as a Claude Code plugin marketplace.

## Structure rules

- Every skill lives in `skills/<name>/` with a `SKILL.md`. The folder name must equal the frontmatter `name`.
- Every skill must be listed in `.claude-plugin/marketplace.json` under `plugins[0].skills`. `npm run new -- <name>` does this automatically.
- Do not put non-skill folders inside `skills/`. Templates go in `templates/`, tooling in `scripts/`.
- Run `npm run validate` after any change to a skill or the marketplace.

## Writing a skill

- **`name`**: lowercase, hyphen-separated, ≤64 chars, no "claude"/"anthropic".
- **`description`**: the only part Claude sees before deciding to load the skill, so it carries triggering. State what it does *and* when to use it, including phrases a user would actually say. ≤1024 chars, no `<` or `>`.
- **Body**: keep `SKILL.md` under ~500 lines. Lead with the workflow and output format. Write instructions as direct imperatives and explain the *why* behind any rule that isn't obvious.
- **Progressive disclosure**: move long checklists, specs, and examples into `references/` and link them from `SKILL.md` with a note on when to read each.
- **Scripts**: put deterministic or repetitive work in `scripts/` rather than asking Claude to regenerate it each time. Scripts must run without network access or unlisted dependencies.
- **Assets**: files used *in* the output (templates, fonts, logos) go in `assets/`, not `references/`.
- One skill, one job. If a description needs "and also", split it.

## Versioning

Bump `metadata.version` in `marketplace.json` when releasing changes users should pull.
