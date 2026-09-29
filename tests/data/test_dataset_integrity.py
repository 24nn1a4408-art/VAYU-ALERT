import unittest
import json
import os

class TestDatasetIntegrityArtifacts(unittest.TestCase):
    def test_validation_reports_exist(self):
        json_path = "reports/data_quality.json"
        html_path = "reports/data_quality_report.html"
        md_path = "reports/data_readiness_assessment.md"

        self.assertTrue(os.path.exists(json_path), f"{json_path} missing")
        self.assertTrue(os.path.exists(html_path), f"{html_path} missing")
        self.assertTrue(os.path.exists(md_path), f"{md_path} missing")

    def test_json_report_structure(self):
        with open("reports/data_quality.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertEqual(data["status"], "PASS")
        self.assertTrue(data["mandatory_checks_passed"])
        self.assertIn("eda", data)
        self.assertIn("class_imbalance", data)
        self.assertIn("extreme_events", data)
        self.assertIn("missingness", data)

        # Check extreme events section
        self.assertIn("rapid_intensification_episodes_detected", data["extreme_events"])
        self.assertGreaterEqual(data["extreme_events"]["rapid_intensification_episodes_detected"], 1)

if __name__ == "__main__":
    unittest.main()
