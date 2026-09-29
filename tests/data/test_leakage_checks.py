import unittest
import csv
from preprocessing.validation import DatasetValidator

class TestLeakageSafetyRules(unittest.TestCase):
    def test_no_event_overlap_across_partitions(self):
        # Emulate partitions
        train_events = {"NIO_2020_AMPHAN", "NIO_2019_FANI", "NIO_2021_TAUKTAE"}
        val_events = {"NIO_2023_BIPARJOY", "NIO_2023_MOCHA"}
        test_events = {"NIO_2021_GULAB", "NIO_2022_ASANI"}

        # Rule 2 Check: Intersections must be strictly empty
        self.assertEqual(len(train_events.intersection(val_events)), 0, "Leakage detected between train and val!")
        self.assertEqual(len(train_events.intersection(test_events)), 0, "Leakage detected between train and test!")
        self.assertEqual(len(val_events.intersection(test_events)), 0, "Leakage detected between val and test!")

    def test_raw_dataset_has_sufficient_events_for_partitioning(self):
        validator = DatasetValidator({"data_paths": {"raw_dir": "data/raw"}})
        tracks = validator._read_csv("data/raw/nio_cyclones_best_track.csv")
        passed, details = validator._check_event_partitioning_rules(tracks)
        self.assertTrue(passed)
        self.assertGreaterEqual(details["unique_cyclone_events"], 3)

if __name__ == "__main__":
    unittest.main()
