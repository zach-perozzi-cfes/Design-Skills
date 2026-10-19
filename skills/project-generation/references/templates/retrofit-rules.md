# Retrofit rules

Sources: Project Timeline Template.md (35 completed retrofit jobs, built 2026-10-14), P-2920 build logic (Retrofit v3.2.0, 2026-10-19), P-2867 project import (task lists, teams, owners). Re-verify task names against the live template with the connector before building; the live template is the authority on names.

## Contents

1. Base structure (phases, task lists, tasks)
2. Block rules
3. Timing algorithm
4. Task duration defaults
5. Roles and teams
6. Priorities and descriptions
7. Open items

## 1. Base structure

The Phases module is turned off on the CFES Zoho Projects plan, so milestones are derived from task lists. Model them as phases in the spec anyway (see `zoho-connector-limits.md` for what that means at build time).

| Task list | Milestone (phase) | Tasks in base template |
|---|---|---|
| Operations Start | Design | Send Welcome Email; Customer Documentation; Confirm CRM Data |
| Applications & Approvals | Permitting | Design Process; Permit Application; Interconnection Application; HOA Application (HOA block); NCUC Submitted (NC block) |
| Install | Installation | Technical Site Survey; Module Install; Electrical Install; As Built Review |
| Inspection | Inspection | Electrical Inspection (subtask: Inspection Results Saved to File); Building Inspection; COC Saved to File |
| Energize | Energize | Commission System; Energize System; Panel Mapping; Access Handoff To Customer; Enable Grid Export |
| Finalize | Energize | Last Review of Monitoring; Customer Experience Survey; Sign up for Service Labor Reimbursement (Enphase block) |

The live v3.2.0 template has 33 tasks. The list above is what the source documents confirm; others seen in P-2920 are Notify HO of HOA Approval and HOA Completion Process (HOA block), Create ACPV Site, Commission ATS, Scan Installation Packet, and Permission To Export. Pull the full list from the live template and reconcile before delivering. Do not drop a live task silently; list any task you left out under excluded blocks with a reason.

Dependency skeleton (finish-to-start):

- Design Process, then Permit Application and Interconnection Application.
- Technical Site Survey after Design Process (design usually finishes first, often from aerial imagery).
- Module Install and Electrical Install together (same-day close on most jobs), then As Built Review, then Electrical Inspection and Building Inspection.
- Inspections, then Commission System and Energize System, then Panel Mapping, Access Handoff To Customer, Enable Grid Export.
- Enable Grid Export also waits on interconnection approval.
- Last Review of Monitoring after Energize System.

Every phase ends with a milestone task or completion check. Defaults: Design = Design Process complete; Permitting = Permit Application approved; Installation = As Built Review complete; Inspection = COC saved to file; Energize = Grid export enabled; Finalize = Last Review of Monitoring complete.

## 2. Block rules

| Block | Include when | Tasks | If excluded |
|---|---|---|---|
| HOA approval | HOA approval required = yes | HOA Application; Notify HO of HOA Approval; HOA Completion Process; install waits for HOA approval | Omit tasks and the HOA gate on install |
| NCUC | State is NC | NCUC Submitted | Omit |
| Enphase labor reimbursement | Inverter brand is Enphase | Sign up for Service Labor Reimbursement | Omit |
| Battery commissioning | Battery in products | Battery-specific descriptions (placement, backup-panel load split), Commission ATS where applicable | Omit; PV-only gets battery qty 0 and N/A fields |
| ACPV | Always in the live template | Create ACPV Site | Keep, and note it may not apply to a non-Enphase/Qcell system (decision open) |
| Always-unassigned install tasks | Always | Module Install, Electrical Install owner role = Install Crew (left unassigned so crews can be scheduled later) | n/a |

Missing parameters: HOA required blank means ask once. Inverter blank means use battery brand if a battery is present (P-2920 convention), else ask. AHJ blank means fall back to county, and say so.

## 3. Timing algorithm

Run `python scripts/compute_timeline.py --ahj <ahj> --utility <utility> --hoa yes|no`. It implements this, using `data/timing_lookups.json`. Rules, so you can explain the result:

| Step | Rule |
|---|---|
| Design done | Day 8, fixed |
| Permit approved | Design + AHJ design-to-permit gap (default 17) |
| HOA approved | Day 40, fixed, only when HOA is required |
| Install start | Later of permit approved and HOA approved |
| Install done | Install start + 18 (Module and Electrical Install share the window) |
| As-built done | Install done + 3 |
| Inspections done | Later of (install done + inspection gap) and (as-built done + 1). Inspection gap = the longer of the AHJ's electrical and building gaps (default 6). Both inspections must close, so the longer one sets the date. |
| Energized | Inspections done + 3 |
| Interconnection approved | Design + utility design-to-interconnection gap (default 66) |
| Grid export | Later of (energized + utility energize-to-export lag, default 2) and interconnection approved |
| Last review of monitoring | Energized + 17 |
| Project end | Later of last review of monitoring and grid export |
| Customer estimate | Project end + 32 |

Lookup behavior: use the specific AHJ or utility row if listed (case and rider suffixes like "(NEM)" ignored), otherwise the default row and say so in the assumptions. Rows resting on fewer than 3 projects are flagged low confidence but still used, so results do not change between runs. Utilities with no retrofit history (Santee Cooper) use the default row and are flagged.

Reading the result: HOA required typically adds about 38 days to project length and shifts install from the permit date to day 40. Interconnection approval usually sets the end date, about 65 to 75 days after design for most utilities. Duke and Dominion export the same day they approve; co-ops add 9 to 21 days after energize.

Sanity check against history: typical Retrofit length is 106 days (middle half 64 to 132). The algorithm runs shorter on purpose because it chains typical steps; real jobs hit at least one slow step. The customer estimate (end + 32) is the buffered figure.

Source of the algorithm: P-2920 build logic, with the "longer of two inspection gaps" and "project end is the later of monitoring review and grid export" rules added when this skill was written. Both give the same answer as P-2920 for its inputs.

## 4. Task duration defaults

Tasks not pinned by the algorithm use the plan durations from the timeline study (calendar days). Offsets are from the named predecessor.

| Task | Duration | Start |
|---|---|---|
| Send Welcome Email | 2 | Day 0 |
| Customer Documentation | 20 | Day 0 |
| Confirm CRM Data | 24 | Day 0 |
| Design Process | 8 | Day 0 |
| NCUC Submitted | 28 | Day 0 |
| Technical Site Survey | 14 | After Design Process |
| HOA Application | to day 40 | Day 0 |
| Interconnection Application | to interconnection-approved day | After Design Process |
| Permit Application | design-to-permit gap | After Design Process |
| Module Install, Electrical Install | 18 (shared) | After permit and HOA gate |
| As Built Review | 3 | After install |
| Electrical Inspection, Building Inspection | per inspection gap | After As Built Review |
| COC Saved to File | 14 | After install |
| Commission System, Energize System | up to the energized day | After inspections |
| Panel Mapping, Access Handoff To Customer | 1 | After Energize System |
| Enable Grid Export | to grid-export day | After Energize System and interconnection approval |
| Last Review of Monitoring | 17 | After Energize System |
| Customer Experience Survey | 7 | After Panel Mapping |
| Sign up for Service Labor Reimbursement | 7 | After Energize System |

These are defaults from the study. Where the live template already has a different duration, report the difference in the assumptions rather than silently changing either.

## 5. Roles and teams

Specs use roles. This mapping is the editable part, kept separate in the JSON as `role_map`. Current values come from P-2867 and P-2920 (Oct 2026); the PM rotation in the source doc is dated 08/06 and may be out of date, so confirm before relying on it.

| Role | Default user(s) | Zoho team |
|---|---|---|
| Project Manager | Rotation: Michael Horan, Dixon, Ken Parker. ZIP starting 27 goes to Ken. Anything not New Construction or Residential Retrofit goes to Clay Warren. | Operations |
| RPD (Deal Owner) | The CRM deal owner | n/a |
| Designer | Stephen Maloy, Griffin Barnett | Design |
| Site Surveyor | Jackson Fyfe, Mark Jackson | Survey |
| Interconnection Coordinator | Mitch Veloso | Interconnections |
| Permitting Coordinator | Project Manager unless told otherwise | Operations |
| Install Crew Lead | Unassigned | Rooftop Installations, Electrical Installations |
| Inspections Coordinator | Project Manager | Inspections |

Assignment rule used in P-2920: Project Manager tasks go to the PM; fixed-role tasks go to their role holders; install crew tasks stay unassigned. Zoho only accepts project members as assignees, so build notes must say which role holders have to be added to the project first.

## 6. Priorities and descriptions

Priority High: Customer Documentation, Permit Application, HOA Application, Interconnection Application. Everything else None, matching the live template.

Each task description carries: the late-flag date or planned end offset, the predecessor name (the connector cannot create dependency links, so the description is the record), and the relevant parameter facts (for example battery placement on Electrical Install, backup-panel load split on Panel Mapping, utility kWh check on Permission To Export).

Task times in Zoho use 13:00 to 22:00 UTC, which is 8 AM to 5 PM Eastern after the November time change.

## 7. Open items

- A "+14 days on late flags" allowance is recorded in P-2920 for default-row AHJs. The exact rule is not documented. Do not apply it until Zach defines it.
- Whether to apply a minimum sample size (n of 3 or more) before trusting an AHJ or utility row, rather than flagging. Recommendation: yes, and fall back to the default row, but it changes outputs, so confirm first.
- Whether to use a named HOA's own history (17 HOAs in the study, one project each) instead of the flat 40 days. Recommendation: keep 40; single-project rows are noise.
- Buffer for utilities with no retrofit history such as Santee Cooper. The study says "overall figures plus buffer" without a number.
