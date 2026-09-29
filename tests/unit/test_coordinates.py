import unittest
from preprocessing.validation import DatasetValidator

class TestCoordinatesValidation(unittest.TestCase):
    def setUp(self):
        self.validator = DatasetValidator({
            "validation_rules": {
                "spatial": {"lat_min": 0.0, "lat_max": 35.0, "lon_min": 45.0, "lon_max": 105.0}
            }
        })

    def test_valid_coordinates(self):
        valid_rows = [
            {"latitude": "12.5", "longitude": "85.0"},
            {"latitude": "20.1", "longitude": "68.4"},
        ]
        passed, details = self.validator._check_coordinates(valid_rows)
        self.assertTrue(passed)
        self.assertEqual(details["out_of_bounds_count"], 0)

    def test_out_of_bounds_coordinates(self):
        invalid_rows = [
            {"latitude": "-10.0", "longitude": "85.0"}, # lat too low
            {"latitude": "15.0", "longitude": "120.0"}, # lon too high
            {"latitude": "corrupt", "longitude": "85.0"} # corrupt
        ]
        passed, details = self.validator._check_coordinates(invalid_rows)
        self.assertFalse(passed)
        self.assertEqual(details["out_of_bounds_count"], 3)

if __name__ == "__main__":
    unittest.main()
