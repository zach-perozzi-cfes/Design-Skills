# Scripts

Deterministic helpers. Scripts run without network access or unlisted dependencies (stdlib only) and document usage in a header comment.

| Script | Purpose |
| --- | --- |
| compute_timeline.py | Deterministic Retrofit milestone timeline from `data/timing_lookups.json` |

Check: `python scripts/compute_timeline.py --ahj Wake --utility "Duke Energy Progress" --hoa yes` should give design 8, permit 25, HOA 40, install 40 to 58, energized 67, grid export 78, end 84, customer estimate 116 (the P-2920 numbers).
