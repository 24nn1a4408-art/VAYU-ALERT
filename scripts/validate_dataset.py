#!/usr/bin/env python3
"""
CLI entry point for CycloneFusion-AI Dataset Validation (Phase 1).
Usage:
    python scripts/validate_dataset.py --config configs/data.yaml
"""

import os
import sys
import argparse
import json

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

try:
    import yaml
    def load_yaml(path):
        with open(path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
except ImportError:
    # Minimal fallback parser if pyyaml is not yet installed in host python
    def load_yaml(path):
        # Fallback simple dictionary for configs/data.yaml
        return {
            "data_paths": {
                "raw_dir": "data/raw",
                "processed_dir": "data/processed",
                "sequences_dir": "data/sequences",
                "metadata_dir": "data/metadata",
                "reports_dir": "reports"
            },
            "validation_rules": {
                "spatial": {"lat_min": -5.0, "lat_max": 40.0, "lon_min": 40.0, "lon_max": 110.0},
                "meteorological": {"min_wind_kt": 0.0, "max_wind_kt": 200.0, "min_pressure_hpa": 850.0, "max_pressure_hpa": 1045.0}
            }
        }

from preprocessing.validation import DatasetValidator

def main():
    parser = argparse.ArgumentParser(description="CycloneFusion-AI Dataset Validation Suite (Phase 1)")
    parser.add_argument("--config", type=str, default="configs/data.yaml", help="Path to data configuration YAML")
    parser.add_argument("--strict", action="store_true", help="Exit with non-zero code if any gate fails")
    args = parser.parse_args()

    print(f"[*] Loading configuration from: {args.config}")
    config = load_yaml(args.config)

    print("[*] Initializing Phase 1 Dataset Validator...")
    validator = DatasetValidator(config)

    print("[*] Executing 10 validation gates across North Indian Ocean records...")
    results = validator.run_all_checks()

    print(f"\n==================================================")
    print(f"CYCLONEFUSION-AI VALIDATION CERTIFICATION REPORT")
    print(f"==================================================")
    print(f"Overall Status          : {results['status']}")
    print(f"Mandatory Checks Passed : {results['mandatory_checks_passed']}")
    print(f"Gates Passed            : {results['gates_passed']} / {len(results['gates'])}")
    print(f"Gates Warned            : {results['gates_warned']}")
    print(f"Gates Failed            : {results['gates_failed']}")
    print(f"Cyclone Events Evaluated: {results.get('eda', {}).get('total_events', 0)}")
    print(f"Total Observations      : {results.get('eda', {}).get('total_observations', 0)}")
    print(f"==================================================\n")

    for g_name, g_info in results["gates"].items():
        mark = "✓" if g_info["passed"] else "✗"
        print(f"  [{mark}] {g_name:32} : {g_info['status']}")

    print("\n[*] Exporting scientific reports to reports/ ...")
    validator.export_reports()

    if not results["mandatory_checks_passed"]:
        print("\n[!] FATAL: Mandatory dataset validation failed. Halting pipeline as per Phase 1 rule.")
        sys.exit(1)
    else:
        print("\n[✓] SUCCESS: Dataset certified ready for Phase 2 Preprocessing & Sequence Construction.")

if __name__ == "__main__":
    main()
