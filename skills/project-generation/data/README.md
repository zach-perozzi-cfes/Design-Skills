# Data

Reference data for `project-generation`: spreadsheets and connection definitions. Claude reads `manifest.json` first and opens other files only as needed.

```
data/
  manifest.json          registry of every source (the entry point)
  spreadsheets/          reference spreadsheets (rates, templates, catalogs, history)
  connections/           definitions of live systems (no secrets)
```

## Rules

- **Register everything.** A file or connection not in `manifest.json` is invisible to the skill.
- **Read-only.** The skill never edits files here; outputs go elsewhere.
- **No secrets.** Tokens, passwords, and keys never go in this repo. See `connections/README.md`.
- **No client-confidential data** unless the repo is private and the user has approved it.
- **Prefer CSV for lookups, XLSX when formulas or multiple tabs matter.** Keep files under ~5 MB so the skill package stays small.
- **Stamp freshness.** Each manifest entry records `last_updated` and `refresh` so stale data can be flagged.

## Maintenance

| Task | Who | Cadence |
| --- | --- | --- |
| Review manifest for stale entries | TBD | TBD |
| Refresh spreadsheets | TBD | TBD |
| Rotate connection credentials | TBD | TBD |
