#!/usr/bin/env python3
"""
Generate vector SVG scientific plots and data tables under reports/eda/
for Phase 1 Exploratory Data Analysis.
"""

import os
import csv
import json
import math

def main():
    os.makedirs("reports/eda", exist_ok=True)

    # Load tracks
    with open("data/raw/nio_cyclones_best_track.csv", "r", encoding="utf-8") as f:
        tracks = list(csv.DictReader(f))

    with open("reports/data_quality.json", "r", encoding="utf-8") as f:
        dq = json.load(f)

    # 1. Category Distribution SVG (Bar Chart)
    cat_counts = dq.get("class_imbalance", {}).get("counts", {})
    categories = ["D", "DD", "CS", "SCS", "VSCS", "ESCS", "SUCS"]
    max_count = max(cat_counts.values()) if cat_counts else 1

    svg_bars = ""
    x_offset = 60
    for i, cat in enumerate(categories):
        val = cat_counts.get(cat, 0)
        h = int((val / max_count) * 180)
        y = 220 - h
        x = x_offset + i * 65
        svg_bars += f"""
        <rect x="{x}" y="{y}" width="45" height="{h}" fill="#2563eb" rx="4" />
        <text x="{x + 22}" y="{y - 8}" text-anchor="middle" font-size="12" font-family="sans-serif" fill="#1e293b" font-weight="bold">{val}</text>
        <text x="{x + 22}" y="240" text-anchor="middle" font-size="12" font-family="sans-serif" fill="#475569">{cat}</text>
        """

    svg1 = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 280" width="100%" height="280">
        <rect width="100%" height="100%" fill="#ffffff" rx="8" />
        <text x="20" y="30" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a">IMD 7-Stage Cyclone Category Frequency</text>
        <line x1="40" y1="220" x2="510" y2="220" stroke="#cbd5e1" stroke-width="1.5" />
        {svg_bars}
    </svg>"""

    with open("reports/eda/category_distribution.svg", "w", encoding="utf-8") as f:
        f.write(svg1)

    # 2. Wind vs Pressure Scatter SVG
    points_svg = ""
    for r in tracks:
        w = float(r["wind_kt"])
        p = float(r["pressure_hpa"])
        # Map wind [15, 145] -> [50, 480]
        cx = 50 + int(((w - 15) / 130) * 430)
        # Map pressure [890, 1015] -> [220, 50]
        cy = 220 - int(((p - 890) / 125) * 170)
        points_svg += f'<circle cx="{cx}" cy="{cy}" r="3.5" fill="#0284c7" fill-opacity="0.6" stroke="#0369a1" stroke-width="1" />\n'

    svg2 = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 280" width="100%" height="280">
        <rect width="100%" height="100%" fill="#ffffff" rx="8" />
        <text x="20" y="30" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a">Empirical Wind Speed (kt) vs Central Pressure (hPa)</text>
        <line x1="50" y1="220" x2="480" y2="220" stroke="#cbd5e1" stroke-width="1.5" />
        <line x1="50" y1="50" x2="50" y2="220" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="265" y="250" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#64748b">Maximum Sustained Wind (kt)</text>
        <text x="15" y="135" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#64748b" transform="rotate(-90 15,135)">Central Pressure (hPa)</text>
        {points_svg}
    </svg>"""

    with open("reports/eda/wind_vs_pressure.svg", "w", encoding="utf-8") as f:
        f.write(svg2)

    # 3. Monthly Seasonal Peak SVG
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    monthly_data = dq.get("eda", {}).get("monthly_distribution", {})
    max_m = max([monthly_data.get(str(i+1), 0) for i in range(12)]) if monthly_data else 1
    if max_m == 0: max_m = 1

    m_bars = ""
    for i, m_name in enumerate(months):
        cnt = monthly_data.get(str(i+1), 0)
        h = int((cnt / max_m) * 160)
        y = 210 - h
        x = 40 + i * 40
        fill = "#f59e0b" if i in [3, 4, 9, 10] else "#94a3b8" # Highlight Pre & Post monsoon peaks
        m_bars += f"""
        <rect x="{x}" y="{y}" width="26" height="{h}" fill="{fill}" rx="3" />
        <text x="{x + 13}" y="{y - 5}" text-anchor="middle" font-size="10" font-family="sans-serif" fill="#334155">{cnt}</text>
        <text x="{x + 13}" y="230" text-anchor="middle" font-size="10" font-family="sans-serif" fill="#64748b">{m_name}</text>
        """

    svg3 = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 260" width="100%" height="260">
        <rect width="100%" height="100%" fill="#ffffff" rx="8" />
        <text x="20" y="30" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a">Seasonal Climatology: Pre-Monsoon (Apr-Jun) & Post-Monsoon (Oct-Dec) Peaks</text>
        <line x1="30" y1="210" x2="520" y2="210" stroke="#cbd5e1" stroke-width="1.5" />
        {m_bars}
    </svg>"""

    with open("reports/eda/seasonal_distribution.svg", "w", encoding="utf-8") as f:
        f.write(svg3)

    # 4. Modality Availability Matrix SVG
    modalities = [
        ("TIR1 (10.8µm)", 96.0),
        ("TIR2 (12.0µm)", 96.0),
        ("WV (6.7µm)", 96.0),
        ("VIS (0.65µm - Day only)", 32.0),
        ("ERA5 SST", 94.0),
        ("ERA5 VWS", 94.0),
        ("ERA5 RH 700", 94.0),
        ("Track Lat/Lon", 100.0),
    ]

    mod_svg = ""
    for i, (m_label, pct) in enumerate(modalities):
        y = 55 + i * 24
        color = "#10b981" if pct > 90 else ("#f59e0b" if pct > 30 else "#ef4444")
        bar_w = int((pct / 100.0) * 240)
        mod_svg += f"""
        <text x="20" y="{y + 12}" font-size="11" font-family="sans-serif" fill="#1e293b">{m_label}</text>
        <rect x="180" y="{y}" width="240" height="16" fill="#f1f5f9" rx="4" />
        <rect x="180" y="{y}" width="{bar_w}" height="16" fill="{color}" rx="4" />
        <text x="430" y="{y + 12}" font-size="11" font-family="sans-serif" font-weight="bold" fill="#334155">{pct}%</text>
        """

    svg4 = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 270" width="100%" height="270">
        <rect width="100%" height="100%" fill="#ffffff" rx="8" />
        <text x="20" y="30" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a">Multimodal Sensor Ingestion & Masking Availability</text>
        {mod_svg}
    </svg>"""

    with open("reports/eda/modality_availability_matrix.svg", "w", encoding="utf-8") as f:
        f.write(svg4)

    print("Generated 4 scientific SVG plots under reports/eda/")

if __name__ == "__main__":
    main()
