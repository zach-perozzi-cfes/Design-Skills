#!/usr/bin/env python3
"""Compute the Retrofit milestone timeline for a CFES job.

Deterministic: same inputs give the same output. All numbers come from
data/timing_lookups.json; edit that file, not this script, when they change.

Usage:
    python scripts/compute_timeline.py --ahj "New Hanover" --utility "Duke Energy Progress" --hoa yes
    python scripts/compute_timeline.py --ahj Wake --utility "Duke Energy Progress (NEM)" --hoa yes --json

Utility rider suffixes like "(NEM)", "- MNEM" are ignored when matching.
"""
import argparse
import json
import re
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data" / "timing_lookups.json"


def norm(s):
    s = re.sub(r"\((?:[A-Za-z]+)\)", "", s)          # (NEM), (MNEM), (BASA)
    s = re.sub(r"[-–]\s*(?:M?NEM|BASA)\b", "", s, flags=re.I)  # " - NEM"
    return re.sub(r"\s+", " ", s).strip().lower()


def lookup(name, table, aliases):
    """Return (canonical_name, row) or (None, None). Case-insensitive, alias aware."""
    if not name:
        return None, None
    key = norm(name)
    index = {norm(k): k for k in table}
    index.update({norm(a): c for a, c in aliases.items()})
    canon = index.get(key)
    return (canon, table[canon]) if canon in table else (None, None)


def compute(ahj, utility, hoa_required, cfg):
    f = cfg["fixed"]
    warnings = []
    lows = cfg["low_confidence_below_n"]

    ahj_name, ahj_row = lookup(ahj, cfg["ahj"], cfg["ahj_aliases"])
    if ahj_row is None:
        ahj_row, ahj_used = cfg["ahj_default"], "DEFAULT"
        warnings.append(f"AHJ '{ahj}' not in lookup table; default row used.")
    else:
        ahj_used = ahj_name
        if ahj_row["n"] < lows:
            warnings.append(f"AHJ '{ahj_name}' rests on {ahj_row['n']} project(s); low confidence.")

    util_name, util_row = lookup(utility, cfg["utility"], cfg["utility_aliases"])
    if util_row is None:
        util_row, util_used = cfg["utility_default"], "DEFAULT"
        if utility and norm(utility) in {norm(u) for u in cfg["utilities_without_retrofit_data"]}:
            warnings.append(f"Utility '{utility}' has no retrofit history; default row used.")
        else:
            warnings.append(f"Utility '{utility}' not in lookup table; default row used.")
    else:
        util_used = util_name
        if util_row["n"] < lows:
            warnings.append(f"Utility '{util_name}' rests on {util_row['n']} project(s); low confidence.")

    design = f["design_done_day"]
    permit = design + ahj_row["design_to_permit"]
    hoa = f["hoa_approved_day_when_required"] if hoa_required else None
    install_start = max(permit, hoa or 0)
    install_done = install_start + f["install_duration_days"]
    as_built = install_done + f["as_built_after_install_days"]
    # Inspections close when both are done, so use the longer of the two gaps.
    insp_gap = max(ahj_row["install_to_electrical_inspection"],
                   ahj_row["install_to_building_inspection"])
    inspections = max(install_done + insp_gap,
                      as_built + f["inspection_after_as_built_min_days"])
    energized = inspections + f["energize_after_inspections_days"]
    interconnection = design + util_row["design_to_interconnection_approval"]
    grid_export = max(energized + util_row["energize_to_grid_export"], interconnection)
    monitoring = energized + f["monitoring_review_after_energize_days"]
    project_end = max(monitoring, grid_export)
    estimate = project_end + f["customer_estimate_buffer_days"]

    drivers = {
        "install_start_driven_by": "HOA approval" if (hoa or 0) > permit else "permit",
        "grid_export_driven_by": "interconnection approval" if interconnection > energized + util_row["energize_to_grid_export"] else "energize + utility export lag",
        "project_end_driven_by": "last review of monitoring" if monitoring >= grid_export else "grid export",
    }

    return {
        "inputs": {"ahj": ahj, "utility": utility, "hoa_required": hoa_required},
        "rows_used": {"ahj": ahj_used, "utility": util_used},
        "milestones_day": {
            "design_done": design,
            "permit_approved": permit,
            "hoa_approved": hoa,
            "install_start": install_start,
            "install_done": install_done,
            "as_built_done": as_built,
            "inspections_done": inspections,
            "energized": energized,
            "interconnection_approved": interconnection,
            "grid_export": grid_export,
            "last_review_of_monitoring": monitoring,
            "project_end": project_end,
            "customer_estimate": estimate,
        },
        "total_duration_days": project_end,
        "drivers": drivers,
        "warnings": warnings,
    }


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--ahj", default="", help="AHJ name, e.g. 'New Hanover'")
    p.add_argument("--utility", default="", help="Utility name, e.g. 'Duke Energy Progress (NEM)'")
    p.add_argument("--hoa", choices=["yes", "no"], default="no", help="HOA approval required")
    p.add_argument("--json", action="store_true", help="Print JSON only")
    args = p.parse_args()

    cfg = json.loads(DATA.read_text())
    out = compute(args.ahj, args.utility, args.hoa == "yes", cfg)

    if args.json:
        print(json.dumps(out, indent=2))
        return
    m = out["milestones_day"]
    print(f"AHJ row: {out['rows_used']['ahj']} | Utility row: {out['rows_used']['utility']} | HOA: {args.hoa}")
    for k, v in m.items():
        print(f"  {k:28s} day {v if v is not None else '-'}")
    print(f"Total duration: {out['total_duration_days']} days (customer estimate day {m['customer_estimate']})")
    for k, v in out["drivers"].items():
        print(f"  {k}: {v}")
    for w in out["warnings"]:
        print(f"WARNING: {w}")


if __name__ == "__main__":
    sys.exit(main())
