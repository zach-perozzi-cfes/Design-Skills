# Intake questions

Read at the start of every request. Skip any question already answered by the request or the live Zoho template.

## Parameters that change the template

| Field | Notes |
| --- | --- |
| Project type | Retrofit, Non-PV Install (battery add-on), Addition, Ground Mount, New Construction, Service, EV charger, commercial maintenance |
| Scope / products | PV, battery, both |
| State | NC adds the NCUC block |
| AHJ | Blank: fall back to county and say so |
| Utility | Drives interconnection and export timing |
| HOA required (and name) | Blank means ask once |
| Inverter / battery brand | Enphase adds the labor reimbursement block. Inverter blank: use battery brand if a battery is present, else ask |
| Financing | e.g. LightReach lease |
| Crew type | Install tasks stay unassigned (Install Crew) |

## Rules

- Ask once, briefly, and only for a parameter that would change the output. Otherwise assume a default and state it in the assumptions.
- For EV charger or commercial maintenance there is no usable task data: ask for the task chain or a comparable live project before generating, and do not present Retrofit durations as validated.
- Anything that is not New Construction or Residential Retrofit routes to Clay Warren as PM (see roles in `references/templates/retrofit-rules.md`).
