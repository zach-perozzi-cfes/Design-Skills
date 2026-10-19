# Design Skills

Design-focused [Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) for Claude Code and claude.ai.

## Skills

| Skill | What it does |
| --- | --- |
| [design-critique](skills/design-critique/SKILL.md) | Structured, prioritized critique of a visual design with concrete fixes |

## Install

**Claude Code** — add this repo as a plugin marketplace, then install the plugin:

```
/plugin marketplace add zach-perozzi-cfes/Design-Skills
/plugin install design-skills@design-skills
```

**claude.ai / Claude Desktop** — run `npm run package`, then upload a zip from `dist/` under Settings → Capabilities → Skills. CI also builds the zips as a `skill-zips` artifact on every push.

**Local, single project** — copy a skill folder into `.claude/skills/` in that project (or `~/.claude/skills/` for all projects).

## Repo layout

```
.claude-plugin/marketplace.json   Marketplace + plugin manifest; lists every skill
skills/<name>/                    One folder per skill
  SKILL.md                        Required: frontmatter (name, description) + instructions
  references/                     Optional: detail Claude loads only when needed
  scripts/                        Optional: executable helpers the skill runs
  assets/                         Optional: templates, fonts, images used in output
templates/skill/                  Starting point for new skills
scripts/                          validate, new-skill, package (Node, no dependencies)
.github/workflows/validate.yml    CI: validate + build zips
```

## Adding a skill

```bash
npm run new -- my-skill-name
```

This copies `templates/skill/` to `skills/my-skill-name/` and registers it in `marketplace.json`. Edit the `SKILL.md`, then:

```bash
npm run validate
```

Validation checks that each skill has valid frontmatter, its `name` matches its folder, its `description` is under 1024 characters, relative links resolve, and it is listed in the marketplace.

See [CLAUDE.md](CLAUDE.md) for authoring guidelines.
