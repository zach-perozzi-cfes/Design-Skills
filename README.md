# Design Skills

A growing library of [Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) built for the **Design department** at Cape Fear Energy Systems. This repo exists to accumulate the department's skills in one place, so design knowledge gets captured once and reused by everyone in Claude Code and claude.ai.

## Purpose

Every skill here should support the work the Design department does. If a skill doesn't help someone on that team do their job faster or more accurately, it belongs somewhere else.

## About the Design department

Design takes a sold job and turns it into a permit-ready plan set and an install hand-off. The work splits into two tracks:

- **Structural design and plan set:** confirm the design in Scanifly, create the Zoho Project, model the roof in SketchUp, fill out System Info, and build the Installation and Permit Plans in Layout. Anything that needs a structural stamp goes to the engineer before permitting.
- **Electrical design and site assessment:** verify equipment compatibility, size wire (ampacity, conduit fill, temperature derates), match the design to the site, and draft the permit-ready line diagram (LD). Before install, prepare the retrofit site assessment, install notes, and material list for the warehouse. After install, update the as-built.

Battery additions skip the structural track and go straight to the electrical one. The project manager submits the permit once the stamped plans and the LD are both ready.

**Tools the department works in:** Zoho Projects, Zoho CRM, Zoho WorkDrive, Scanifly, SketchUp / Layout, and Excel.

**Where time goes today**, and so where skills can help most:

- Hunting for site photos that are scattered or incomplete
- Sizing wire and breakers by hand, then re-sizing after the first pass
- Catching wrong string sizes or missing material that came from the sale
- Designing battery, generator, and system-addition jobs from scratch
- Re-keying data from Zoho into Excel and System Info
- Tracking material on and off the LD for install notes

Good skill candidates follow from that list: pre-design checks of the sales agreement against photos and specs, wire sizing, material list generation, install notes, and plan set QA.

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
