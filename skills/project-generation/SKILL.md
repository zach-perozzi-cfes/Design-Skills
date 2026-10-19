---
name: project-generation
description: Generates a new design project from intake through a complete project package (scope, structure, schedule, deliverables, and tracking sheets), drawing on department reference material, spreadsheets, and connected systems. Use when the user asks to start, set up, spin up, scaffold, or generate a project, build a project plan or kickoff package, or says "new project", "create the project file", or "set up the job" — even if they never name the skill.
---

# Project Generation

Turns a project request into a complete, standards-compliant project package. This skill is a blueprint: the workflow below is fixed, while the knowledge it relies on lives in `references/` and `data/` and is filled in over time.

## When to use

- A new project needs to be set up from a brief, request, or conversation
- The user wants a project plan, kickoff package, folder structure, or tracking sheet generated
- An existing project needs to be re-baselined against current department standards

Do not use for: critiquing finished design work (use `design-critique`), or one-off questions about a single spreadsheet.

## Workflow

1. **Intake.** Gather the inputs listed in [references/process/intake-questions.md](references/process/intake-questions.md). Ask only for what cannot be inferred from the request or from connected systems.
2. **Load context.** Read [data/manifest.json](data/manifest.json) to see which spreadsheets and connections exist, then open only the sources the intake points to. Never bulk-load `data/`; the manifest says what each source holds and when to use it.
3. **Plan.** Build the project against [references/process/project-lifecycle.md](references/process/project-lifecycle.md): scope, phases, milestones, roles, and risks.
4. **Generate.** Produce the package defined in [references/standards/deliverables-checklist.md](references/standards/deliverables-checklist.md), using [references/standards/naming-conventions.md](references/standards/naming-conventions.md) for every file, folder, and ID.
5. **Verify.** Check the package against the deliverables checklist and flag anything that relied on a missing or stale source.

## Output format

A project package containing the items in the deliverables checklist. State which data sources were used and which were unavailable, so the reader knows what to trust.

## Handling data and connections

- Spreadsheets in [data/spreadsheets/](data/spreadsheets/README.md) are reference data. Treat them as read-only; write results to new files.
- Connections are described in [data/connections/](data/connections/README.md). Credentials never live in this repo; connection entries name the environment variable or connector that supplies them.
- If a source in the manifest is marked `stale` or `unavailable`, say so in the output instead of guessing its contents.

## References

Load these only when needed:

- [references/README.md](references/README.md) — index of all reference material and what is still to be filled in
- [references/process/intake-questions.md](references/process/intake-questions.md) — what to ask at kickoff
- [references/process/project-lifecycle.md](references/process/project-lifecycle.md) — phases, gates, and milestones
- [references/standards/naming-conventions.md](references/standards/naming-conventions.md) — file, folder, and project ID rules
- [references/standards/deliverables-checklist.md](references/standards/deliverables-checklist.md) — what a complete package contains
- [references/examples/README.md](references/examples/README.md) — worked example packages
- [data/README.md](data/README.md) — how the data folder is organized and maintained
