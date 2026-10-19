# Spec format

One JSON block per template. The format is fixed so the same inputs give byte-identical structure, which makes diffs between template versions useful.

## Contents

1. Determinism rules
2. Shape
3. Worked fragment

## 1. Determinism rules

- **Order.** Phases in lifecycle order. Task lists in the order of the base table. Tasks within a list sorted by start day, then by the order they appear in the base table. Never reorder between runs.
- **IDs.** `PH-<nn>` for phases, `TL-<nn>` for task lists, `T-<nn>` for tasks, `ST-<task nn>-<nn>` for subtasks. Numbers are assigned across the whole template in final sort order, two digits. Excluded blocks do not leave gaps; renumber after exclusion.
- **Keys.** Keys appear in the order shown below.
- **Names.** Title Case, as the live template spells them. Placeholders use only the standard tokens.
- **Numbers.** Days are integers. Offsets are never calendar dates.
- **Start rule.** Either `{"type": "offset", "days": n}` from project start, or `{"type": "after", "task": "T-nn", "lag_days": n}` from a predecessor. Every task has exactly one.
- **Dependencies.** `depends_on` is a list of `{"task": "T-nn", "type": "FS", "lag_days": n}`. A task with a predecessor start rule lists it here too.

## 2. Shape

```json
{
  "template": {
    "name": "Retrofit",
    "version": "<semver>",
    "project_type": "Retrofit",
    "total_duration_days": 84,
    "customer_estimate_day": 116
  },
  "parameters": {"ahj": "", "utility": "", "hoa_required": false, "state": "", "inverter_brand": "", "battery": false, "financing": ""},
  "lookups_used": {"ahj_row": "DEFAULT", "utility_row": "Duke Energy Progress", "warnings": []},
  "blocks": {
    "included": [{"block": "", "reason": ""}],
    "excluded": [{"block": "", "reason": ""}]
  },
  "role_map": {"Project Manager": "", "Designer": ""},
  "phases": [
    {
      "id": "PH-01",
      "name": "Design",
      "completion_check": "",
      "task_lists": [
        {
          "id": "TL-01",
          "name": "Operations Start",
          "team": "Operations",
          "tasks": [
            {
              "id": "T-01",
              "name": "Send Welcome Email",
              "description": "",
              "owner_role": "Project Manager",
              "duration_days": 2,
              "start": {"type": "offset", "days": 0},
              "priority": "None",
              "tags": [],
              "depends_on": [],
              "subtasks": [{"id": "ST-01-01", "name": ""}]
            }
          ]
        }
      ]
    }
  ],
  "manual_setup": []
}
```

`role_map` is separate from the structure on purpose: Zach can change who fills a role without touching any task. `manual_setup` repeats the Build notes items so a script can read them.

## 3. Worked fragment

Retrofit with HOA required, AHJ Wake (default row), Duke Energy Progress. Excerpt of the Permitting phase:

```json
{
  "id": "PH-02",
  "name": "Permitting",
  "completion_check": "Permit Application approved for {ahj}",
  "task_lists": [{
    "id": "TL-02",
    "name": "Applications & Approvals",
    "team": "Operations",
    "tasks": [
      {"id": "T-04", "name": "Design Process", "description": "Complete layout design for {customer_name}, {system_size_kw} kW at {site_address}. Late flag day 8.", "owner_role": "Designer", "duration_days": 8, "start": {"type": "offset", "days": 0}, "priority": "None", "tags": [], "depends_on": [], "subtasks": []},
      {"id": "T-05", "name": "Permit Application", "description": "Submit and track permit with {ahj}. Predecessor: Design Process. Planned end day 25.", "owner_role": "Project Manager", "duration_days": 17, "start": {"type": "after", "task": "T-04", "lag_days": 0}, "priority": "High", "tags": [], "depends_on": [{"task": "T-04", "type": "FS", "lag_days": 0}], "subtasks": []}
    ]
  }]
}
```
