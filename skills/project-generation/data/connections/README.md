# Connections

Definitions of live systems the skill can query or write to (project management, CRM, file storage, time tracking, etc.). This folder holds **descriptions only**.

## Credentials

- Never commit secrets. Entries name the environment variable or connector that supplies a credential (`auth.env`) — never the value.
- Machine-specific overrides go in `connections.local.json`, which is gitignored.

## Adding a connection

1. Copy an entry in `connections.example.json` and fill it in.
2. Register it in `../manifest.json` (`definition` points at the entry).
3. Record scopes, rate limits, and who owns access below.

## Access log

| Connection id | Owner | Scope granted | Review date |
| --- | --- | --- | --- |
| TBD | TBD | TBD | TBD |
