# Reference index

Every reference file for `project-generation`, with its status.

| File | Purpose | Status |
| --- | --- | --- |
| process/intake-questions.md | Parameters to resolve at kickoff | draft |
| templates/retrofit-rules.md | Retrofit base, block rules, timing algorithm, roles | draft |
| templates/non-retrofit-types.md | Non-Retrofit types (thin samples) | draft |
| templates/spec-format.md | JSON shape, ID scheme, ordering | draft |
| templates/zoho-connector-limits.md | Connector gaps and safe build procedure | draft |
| examples/ | Worked example packages | empty |

Status values: `blueprint` (structure only), `draft` (content present, unreviewed), `approved`.

Source documents: Project Timeline Template.md (2026-10-14), P-2920 build logic (2026-10-19), P-2867 Smedley import (2026-10-14), Project Intake Checklist summary (2026-10-07).

## Open decisions

1. The "+14 days on late flags" allowance for default-row AHJs recorded in P-2920 is undefined, so it is not applied.
2. Minimum sample size before trusting an AHJ or utility row (currently: use and flag below n of 3).
3. Whether a named HOA's history should replace the flat 40-day HOA approval.
4. Buffer for utilities with no retrofit data (Santee Cooper).
5. Task naming: live-template names (Customer Documentation, Design Process) are not verb-first, so they are kept to match existing projects; new tasks are verb-first.
6. Non-Retrofit types rest on 1 to 5 projects each and have no rule set yet.
7. The PM rotation in the source workflow doc is dated 08/06 and needs confirming.

## Conventions for adding material

- One topic per file. Split a file once it passes ~300 lines.
- Start each file with a one-line statement of when Claude should read it.
- Put long lookups in `data/`, not here. Reference files hold rules and explanations.
- Update `templates/zoho-connector-limits.md` with a date whenever a connector limit changes.
