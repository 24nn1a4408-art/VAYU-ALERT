import unittest
from preprocessing.validation import DatasetValidator

class TestSchemaValidation(unittest.TestCase):
    def setUp(self):
        self.validator = DatasetValidator({})

    def test_complete_schema(self):
        track_sample = [{
            "cyclone_id": "TEST_01", "storm_name": "Test", "basin": "BOB",
            "iso_time": "2023-01-01 00:00:00", "latitude": "10.0", "longitude": "85.0",
            "wind_kt": "45", "pressure_hpa": "995", "category": "CS"
        }]
        env_sample = [{
            "cyclone_id": "TEST_01", "iso_time": "2023-01-01 00:00:00",
            "sst_kelvin": "301.2", "vertical_wind_shear_ms": "8.5", "relative_humidity_700hpa": "80",
            "mean_sea_level_pressure_hpa": "995", "vorticity_850hpa": "0.0002"
        }]
        sat_sample = [{
            "cyclone_id": "TEST_01", "iso_time": "2023-01-01 00:00:00",
            "sensor": "INSAT-3D", "tir1_available": "1", "tir2_available": "1",
            "wv_available": "1", "vis_available": "1"
        }]

        passed, details = self.validator._check_schemas(track_sample, env_sample, sat_sample)
        self.assertTrue(passed)
        self.assertTrue(details["tracks_valid"])
        self.assertTrue(details["envs_valid"])
        self.assertTrue(details["sats_valid"])

    def test_missing_column_schema(self):
        corrupt_track = [{"cyclone_id": "TEST_01"}] # missing latitude, longitude, wind_kt, etc.
        passed, details = self.validator._check_schemas(corrupt_track, [], [])
        self.assertFalse(passed)
        self.assertIn("latitude", details["missing_track_cols"])

if __name__ == "__main__":
    unittest.main()
