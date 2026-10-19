# Spreadsheets

Reference spreadsheets used when generating projects. Examples of what belongs here: rate cards, project-type catalogs, phase and task libraries, historical project data, resource and capacity tables.

## Adding a spreadsheet

1. Drop the file in this folder (or a subfolder per topic, e.g. `rates/`, `history/`).
2. Name it `<topic>-<descriptor>.<ext>` in lowercase, hyphenated.
3. Add an entry to `../manifest.json` with its tabs and key columns.
4. Add a **Data dictionary** row below for every tab.

## Layout rules for sheets

- One header row, no merged cells, no blank rows inside a table.
- One table per tab. Put notes in a separate `README` tab.
- Stable column names; renaming a column is a breaking change for any reference that cites it.

## Data dictionary

| Spreadsheet id | Tab | Column | Meaning | Type / allowed values |
| --- | --- | --- | --- | --- |
| TBD | TBD | TBD | TBD | TBD |
