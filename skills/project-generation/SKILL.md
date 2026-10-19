---
name: project-generation
description: Generates complete, reusable Zoho Projects templates for Cape Fear Energy Systems (CFES) procedurally from a project type and parameters (AHJ, utility, HOA, equipment, financing, crew). Produces phases, task lists, tasks, subtasks, dependencies, durations, owner roles, tags, a JSON spec, and manual build notes. Use when asked to build, design, generate, update, or rebuild a Zoho Projects template, project blueprint, task chain, or timeline for any CFES job type (residential retrofit, battery add-on, EV charger, ground mount, addition, new construction, service, commercial maintenance), or to start or set up a new project, or what a template should contain or how long a job should take, even if "template" is never said.
---

# Project Generation (Zoho Projects templates)

The user defines a project type and its parameters. Apply fixed rules and return a complete template they can build in Zoho Projects. The procedural approach exists so the same inputs always give the same structure, order, names, and numbers, which makes diffs between template versions meaningful.

Prose stays minimal. The outline and the JSON spec are the deliverable.

Do not use for critiquing finished design work (use `design-critique`).

## Workflow

1. **Resolve parameters.** Identify the inputs that change the template: project type, scope/products, AHJ, utility, HOA required (and name), equipment (inverter/battery brand), financing, state, inspection requirements, crew type. See [references/process/intake-questions.md](references/process/intake-questions.md). If a missing parameter would change the output, ask once, briefly. Otherwise assume a default and state the assumption at the top of the output.
2. **Inspect what exists.** Use the Zoho Projects connector (read-only) to look at the current live template or a recent comparable project: task lists, task names, priorities, teams, tags. Match what is there. If the connector cannot reach it, say so and fall back to the reference files. Connection details are in [data/connections/](data/connections/README.md).
3. **Pick blocks.** Start from the base template for the type, then add or remove modular blocks from the parameters. List every block as included or excluded with the reason. See [references/templates/retrofit-rules.md](references/templates/retrofit-rules.md) for the Retrofit base and block rules, and [references/templates/non-retrofit-types.md](references/templates/non-retrofit-types.md) for every other type.
4. **Compute the timeline.** For Retrofit-family types, run `python scripts/compute_timeline.py` rather than doing the arithmetic by hand. It encodes the timing rules and lookup tables, so the numbers are identical every run. Pass the AHJ, utility, and HOA flag. Use its day numbers for offsets and report any warnings (default row used, thin sample) in the assumptions.
5. **Generate the spec.** Phases in lifecycle order, task lists inside each phase, tasks with offsets and dependencies. Follow [references/templates/spec-format.md](references/templates/spec-format.md) for the JSON shape, ID scheme, and ordering rules.
6. **Run the quality checks** (below) before delivering.
7. **Zoho writes are separate and gated.** Never create or change anything in Zoho until the user has seen exactly what will be created and said yes. See "Zoho Projects tool use".

## Output format

Return these four sections in this order:

1. **Assumptions and parameters used.** Short list. Include which lookup rows were specific and which fell back to a default, and which data sources were unavailable or stale.
2. **Outline.** Phases, task lists, and tasks in a readable hierarchy with durations and dependencies. State the total duration.
3. **Machine-readable spec.** One JSON block, ready for scripting or import.
4. **Build notes.** Manual setup in Zoho Projects: custom fields, roles, automation, Blueprint rules, and the final "save as template" step. Pull the relevant limits from [references/templates/zoho-connector-limits.md](references/templates/zoho-connector-limits.md) so the user sees what the connector cannot do before asking.

## Template model

- **Phases** (milestones) in lifecycle order, each ending with a clear completion check or milestone.
- **Task lists** inside each phase.
- **Tasks** with: name, description, owner role (never a person's name), duration in days, start offset from project start or from a predecessor, priority, tags, dependencies.
- **Subtasks** for checklists inside a task.
- **Placeholders** in names and descriptions so the template is reusable: `{customer_name}`, `{site_address}`, `{ahj}`, `{utility}`, `{system_size_kw}`, `{hoa_name}`, `{deal_id}`. Use these exact tokens everywhere; do not invent variants.

Rules that keep templates valid:

- Offsets and dependencies only, never calendar dates. Day 0 is the project creation date.
- Owner roles in the structure; the role-to-user mapping is a separate block so it can change without touching the structure. Default mapping and team names are in `references/templates/retrofit-rules.md`.
- No orphan tasks. Every task has a phase and either a predecessor or a start offset.
- Phase names are nouns. Tasks mirroring a task in the live CFES template keep the live name, because existing projects, automations and reporting match on it. New tasks are Title Case and start with a verb. Say in the assumptions when a name was kept for this reason.

## Quality checks before delivering

Check each of these and fix anything that fails:

- No circular dependencies.
- Offsets and durations give a sensible timeline; the stated total matches the last milestone.
- Every parameterized block either appears or is explicitly listed as excluded.
- Placeholders are used consistently across all tasks.
- Task, task-list and phase names and counts in the outline match the JSON spec exactly.
- Compare the total against the typical-length figures in the reference for that type; if it is far outside the typical range, explain why in one line.

## Zoho Projects tool use

- Use the connector to inspect existing projects, phases, task lists, and tasks so new templates match.
- Before creating or changing anything, show exactly what will be created and wait for confirmation.
- Build only into a clearly named test project with the prefix `TEMPLATE BUILD - `, never a live customer project. Never modify or delete existing projects or tasks unless the user asks.
- If the connector cannot do something (converting a project into a template, dependency links, phases on this plan, adding members), say so plainly and give the manual steps. Do not guess or try workarounds that might touch live data.

## Design choices

When there is a real choice (one large template with conditional blocks versus several smaller ones, for example), give a short recommendation with the tradeoff, then proceed with it unless the user says otherwise. For Retrofit, the recommendation is one template with conditional blocks, because most of the structure is shared and the conditional parts (HOA, NCUC, Enphase-only) are small.

## Data and connections

- Lookup tables live in [data/timing_lookups.json](data/timing_lookups.json). Edit the numbers there, never the script. Read [data/manifest.json](data/manifest.json) to see every registered source and its status.
- Treat data files as read-only during a run; write results to new files.
- Credentials never live in this repo. If a source is marked `stale` or `unavailable`, say so in the output instead of guessing its contents.

## References

Load only when needed:

- [references/process/intake-questions.md](references/process/intake-questions.md) — parameters to resolve and what to ask
- [references/templates/retrofit-rules.md](references/templates/retrofit-rules.md) — Retrofit base template, block rules, timing algorithm, duration defaults, roles and teams. Read for any Retrofit, Non-PV Install (battery add-on), or other PV-based type.
- [references/templates/non-retrofit-types.md](references/templates/non-retrofit-types.md) — Addition, Ground Mount, New Construction, Service, Non-PV Install, EV: what the data supports and what to ask. Read for any type other than Retrofit.
- [references/templates/spec-format.md](references/templates/spec-format.md) — JSON schema, ID scheme, ordering rules, a short worked example.
- [references/templates/zoho-connector-limits.md](references/templates/zoho-connector-limits.md) — what the Zoho Projects connector cannot do and the manual steps. Read before writing build notes or proposing any Zoho write.
- [references/README.md](references/README.md) — index and status of all reference material
- [data/README.md](data/README.md) — how the data folder is organized and maintained
- [evals/evals.json](evals/evals.json) — test prompts and assertions for iterating on the skill
