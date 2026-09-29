import unittest
import os
from preprocessing.validation import DatasetValidator

class TestDatasetValidator(unittest.TestCase):
    def setUp(self):
        self.config = {
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
        self.validator = DatasetValidator(self.config)

    def test_run_all_checks_completes(self):
        results = self.validator.run_all_checks()
        self.assertIn("status", results)
        self.assertIn("gates", results)
        self.assertTrue(results["mandatory_checks_passed"])
        self.assertEqual(results["gates_failed"], 0)

    def test_gate_count(self):
        results = self.validator.run_all_checks()
        self.assertGreaterEqual(results["gates_passed"], 10)

if __name__ == "__main__":
    unittest.main()
