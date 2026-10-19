# Zoho Projects connector limits

Observed while building P-2920 (2026-10-19) and importing P-2867 (2026-10-14). State these in the build notes up front so Zach knows what is manual before he approves a build. Re-test when the plan or connector changes; update this file, with the date, if a limit goes away.

## Contents

1. What the connector cannot do
2. Field and assignment rejections
3. Safe build procedure
4. Manual steps after any connector build

## 1. What the connector cannot do

| Gap | Why | Manual step |
|---|---|---|
| Phases (milestones) | The Phases module is turned off on this plan, so the API cannot create them. Milestones are derived from task lists. | A project built from the saved Zoho template carries them over. For a connector-built test project, record the milestone for each task list in the task descriptions. |
| Dependency links | No tool creates them. | Write the predecessor name in each task description, then set the links in Gantt view. |
| Teams | Teams must be attached to the project first, and the connector cannot attach them. | Attach teams in project settings, then assign team per task. |
| Blueprints | They come from the Zoho template, not the API. | Configure Blueprint rules in the template or on the saved template. |
| Project members | The connector cannot add members. | Add role holders to the project before assigning. Zoho rejects assignees who are not members. |
| Convert project to template | No tool for it. | Open the finished `TEMPLATE BUILD - ` project and use Save as Template manually, then check that phases, dependencies, teams, tags and Blueprints came through. |
| Tags | Tags are sent but responses did not confirm them. | Check them after the build and fix by hand. |
| CRM write-back | The Project ID on the CRM deal is not written unless CRM changes are approved. | Set it by hand on the deal, or approve the CRM update separately. |

## 2. Field and assignment rejections

- Lookup fields such as Customer Name and Flood Plane need a Projects-to-CRM integration authorization the connector does not have. Leave them blank and link by hand.
- Picklist values must already exist in Zoho Projects. Surge Protector (SP) was rejected as a product because it is not in the Projects product picklist; it was dropped and noted in the project notes. Check picklists before sending a value, and add missing values by hand.
- Assignees who are not project members are rejected. Leave the task unassigned and write "ASSIGN TO: <names>" in the description.
- Empty source fields stay empty. Do not guess values to get past a rejection.

## 3. Safe build procedure

1. Show Zach exactly what will be created: project name, task lists, each task with owner, offsets, priority, tags, and which items the connector will skip.
2. Wait for his confirmation.
3. Build into a project named `TEMPLATE BUILD - <template name> <version>`. Never write into a live customer project, and never modify or delete existing projects or tasks unless he asks.
4. After the build, read the project back and diff it against the spec: task count, names, task-list membership, owners, durations. Report mismatches.

## 4. Manual steps after any connector build

Return these as the Build notes list, trimmed to what applies:

- [ ] Add role holders as project members, then assign their tasks
- [ ] Attach teams, then set the team on each task
- [ ] Set dependency links in Gantt view from the predecessors written in the descriptions
- [ ] Confirm tags
- [ ] Link lookup fields (Customer Name, Flood Plane) by hand
- [ ] Add any missing picklist values (for example Surge Protector)
- [ ] Configure Blueprints
- [ ] Save as Template, then verify phases, dependencies, teams, tags and Blueprints on the saved template
