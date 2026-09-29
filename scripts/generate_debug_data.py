#!/usr/bin/env python3
"""
Generate canonical reference and debug datasets for CycloneFusion-AI.
Generates realistic synoptic records for North Indian Ocean cyclones (Bay of Bengal and Arabian Sea),
including satellite observation logs and environmental variables.
"""
import os
import csv
import math
import random
from datetime import datetime, timedelta

def main():
    random.seed(42)
    os.makedirs("data/raw", exist_ok=True)
    os.makedirs("data/processed", exist_ok=True)
    os.makedirs("data/metadata", exist_ok=True)

    # 1. Authoritative North Indian Ocean Storm Catalog
    storms = [
        {"id": "NIO_2020_AMPHAN", "name": "Amphan", "basin": "Bay of Bengal", "start": "2020-05-16 00:00:00", "steps": 24, "lat0": 10.4, "lon0": 86.8, "dlat": 0.45, "dlon": 0.05, "max_w": 140, "min_p": 906, "peak_step": 12, "category": "SuCS"},
        {"id": "NIO_2019_FANI", "name": "Fani", "basin": "Bay of Bengal", "start": "2019-04-26 06:00:00", "steps": 28, "lat0": 5.2, "lon0": 88.5, "dlat": 0.52, "dlon": -0.12, "max_w": 115, "min_p": 932, "peak_step": 20, "category": "ESCS"},
        {"id": "NIO_2021_TAUKTAE", "name": "Tauktae", "basin": "Arabian Sea", "start": "2021-05-14 00:00:00", "steps": 22, "lat0": 10.6, "lon0": 72.5, "dlat": 0.55, "dlon": -0.05, "max_w": 100, "min_p": 950, "peak_step": 15, "category": "ESCS"},
        {"id": "NIO_2023_BIPARJOY", "name": "Biparjoy", "basin": "Arabian Sea", "start": "2023-06-06 00:00:00", "steps": 36, "lat0": 12.1, "lon0": 66.0, "dlat": 0.30, "dlon": 0.08, "max_w": 90, "min_p": 960, "peak_step": 18, "category": "ESCS"},
        {"id": "NIO_2023_MOCHA", "name": "Mocha", "basin": "Bay of Bengal", "start": "2023-05-09 00:00:00", "steps": 24, "lat0": 8.5, "lon0": 89.0, "dlat": 0.50, "dlon": 0.18, "max_w": 115, "min_p": 938, "peak_step": 16, "category": "ESCS"},
        {"id": "NIO_2021_GULAB", "name": "Gulab", "basin": "Bay of Bengal", "start": "2021-09-24 12:00:00", "steps": 14, "lat0": 18.2, "lon0": 89.8, "dlat": 0.05, "dlon": -0.65, "max_w": 45, "min_p": 992, "peak_step": 8, "category": "CS"},
        {"id": "NIO_2022_ASANI", "name": "Asani", "basin": "Bay of Bengal", "start": "2022-05-07 06:00:00", "steps": 20, "lat0": 11.2, "lon0": 89.1, "dlat": 0.38, "dlon": -0.32, "max_w": 65, "min_p": 982, "peak_step": 10, "category": "VSCS"},
        {"id": "NIO_2022_MANDOUS", "name": "Mandous", "basin": "Bay of Bengal", "start": "2022-12-06 18:00:00", "steps": 18, "lat0": 8.0, "lon0": 86.5, "dlat": 0.28, "dlon": -0.35, "max_w": 55, "min_p": 988, "peak_step": 11, "category": "SCS"},
        {"id": "NIO_2021_BOB05", "name": "BOB_05", "basin": "Bay of Bengal", "start": "2021-11-10 00:00:00", "steps": 10, "lat0": 11.0, "lon0": 84.0, "dlat": 0.20, "dlon": -0.40, "max_w": 30, "min_p": 1000, "peak_step": 6, "category": "DD"},
        {"id": "NIO_2022_ARB02", "name": "ARB_02", "basin": "Arabian Sea", "start": "2022-07-16 00:00:00", "steps": 8, "lat0": 20.8, "lon0": 68.2, "dlat": 0.15, "dlon": -0.45, "max_w": 25, "min_p": 1002, "peak_step": 4, "category": "D"}
    ]

    def get_imd_category(wind_kt):
        if wind_kt < 17:
            return "LOW"
        elif wind_kt <= 27:
            return "D"
        elif wind_kt <= 33:
            return "DD"
        elif wind_kt <= 47:
            return "CS"
        elif wind_kt <= 63:
            return "SCS"
        elif wind_kt <= 89:
            return "VSCS"
        elif wind_kt <= 119:
            return "ESCS"
        else:
            return "SuCS"

    track_rows = []
    env_rows = []
    sat_rows = []

    for storm in storms:
        base_t = datetime.strptime(storm["start"], "%Y-%m-%d %H:%M:%S")
        cur_lat = storm["lat0"]
        cur_lon = storm["lon0"]
        total_steps = storm["steps"]
        peak = storm["peak_step"]
        max_w = storm["max_w"]
        min_p = storm["min_p"]

        for step in range(total_steps):
            t = base_t + timedelta(hours=step * 6)
            iso_time = t.strftime("%Y-%m-%d %H:%M:%S")
            
            # Non-linear intensity lifecycle curve
            if step <= peak:
                ratio = step / max(peak, 1)
                wind = 20.0 + (max_w - 20.0) * (math.sin(ratio * math.pi / 2) ** 1.5)
            else:
                ratio = (step - peak) / max(total_steps - peak, 1)
                wind = max_w - (max_w - 20.0) * (ratio ** 1.2)

            wind = max(15.0, round(wind, 1))
            # Empirical Atkinson-Holliday pressure-wind relationship
            pres = round(1010.0 - 0.72 * (wind ** 1.08), 1)
            pres = max(890.0, min(1012.0, pres))

            cat = get_imd_category(wind)

            # Trajectory progression with gentle sinusoidal curvature
            cur_lat = round(storm["lat0"] + step * storm["dlat"] + 0.15 * math.sin(step / 3.0), 3)
            cur_lon = round(storm["lon0"] + step * storm["dlon"] + 0.12 * math.cos(step / 3.0), 3)

            track_rows.append({
                "cyclone_id": storm["id"],
                "storm_name": storm["name"],
                "basin": storm["basin"],
                "iso_time": iso_time,
                "step_index": step,
                "latitude": cur_lat,
                "longitude": cur_lon,
                "wind_kt": wind,
                "pressure_hpa": pres,
                "category": cat,
                "nature": "TS",
                "center_confidence": round(random.uniform(0.88, 0.98), 2)
            })

            # Synoptic Environmental Variables at storm center (ERA5)
            # Higher SST in pre/post-monsoon; higher shear breaks storm down
            sst_k = round(298.0 + random.uniform(2.5, 4.5) - (0.05 * step), 2)
            shear_ms = round(5.0 + random.uniform(2.0, 10.0) + (1.2 * ratio if step > peak else 0.0), 2)
            rh = round(75.0 + random.uniform(-10.0, 15.0), 1)
            vor = round(0.00015 + (wind / 140.0) * 0.00025 + random.uniform(-0.00003, 0.00003), 6)

            # Modality availability simulation (occasional missingness)
            env_avail = 1 if (step % 17 != 0) else 0

            env_rows.append({
                "cyclone_id": storm["id"],
                "iso_time": iso_time,
                "sst_kelvin": sst_k if env_avail else "",
                "vertical_wind_shear_ms": shear_ms if env_avail else "",
                "relative_humidity_700hpa": rh if env_avail else "",
                "mean_sea_level_pressure_hpa": pres if env_avail else "",
                "vorticity_850hpa": vor if env_avail else "",
                "is_available": env_avail
            })

            # Satellite frame availability simulation (INSAT-3D/3DR)
            hour = t.hour
            is_daytime = (hour in [0, 6]) # Approx daytime over NIO (UTC)
            sat_avail = 1 if (step % 23 != 0) else 0
            
            sat_rows.append({
                "cyclone_id": storm["id"],
                "iso_time": iso_time,
                "sensor": "INSAT-3D",
                "tir1_available": sat_avail,
                "tir2_available": sat_avail,
                "wv_available": sat_avail,
                "vis_available": 1 if (sat_avail and is_daytime) else 0,
                "frame_path_tir1": f"data/raw/satellite_frames/{storm['id']}_{step:02d}_TIR1.png" if sat_avail else "",
                "cloud_top_min_temp_k": round(190.0 + random.uniform(2.0, 25.0) - (wind * 0.2), 1) if sat_avail else ""
            })

    # Write files
    with open("data/raw/nio_cyclones_best_track.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=track_rows[0].keys())
        writer.writeheader()
        writer.writerows(track_rows)

    with open("data/raw/nio_environmental_synoptic.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=env_rows[0].keys())
        writer.writeheader()
        writer.writerows(env_rows)

    with open("data/raw/satellite_frames_index.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=sat_rows[0].keys())
        writer.writeheader()
        writer.writerows(sat_rows)

    print(f"Generated {len(track_rows)} synoptic track records across {len(storms)} cyclone events.")
    print(f"Generated {len(env_rows)} environmental synoptic grids.")
    print(f"Generated {len(sat_rows)} satellite frame index records.")

if __name__ == "__main__":
    main()
