# CycloneFusion-AI Evaluation & Metrics Framework

## Metrics Standards
In compliance with Rule 1 (Never fabricate results), metrics are computed strictly across real evaluated splits. Untrained models report `"Not yet evaluated"`.

### Tasks & Evaluation Metrics
1. **Identification**:
   - Detection Precision, Recall, F1, ROC-AUC
   - Brier Score for probability calibration

2. **Classification**:
   - Macro F1 & Weighted F1 across IMD categories
   - Per-class confusion matrix
   - Severe category recall (VSCS, ESCS, SuCS)

3. **Intensity Estimation (+6h, +12h, +24h, +48h)**:
   - Mean Absolute Error (MAE in knots)
   - Root Mean Squared Error (RMSE in knots)
   - Mean Bias Error (MBE in knots)
   - Prediction interval coverage probability (PICP 80% and 95%)

4. **Track Forecasting (+6h, +12h, +24h, +48h)**:
   - Direct Position Error (DPE in kilometers via Haversine great-circle)
   - Cross-track error (CTE) and along-track error (ATE)
   - Uncertainty cone 70% and 95% radius calibration

5. **Ablation Matrix**:
   - M1: Satellite only
   - M2: Satellite + Historical Track
   - M3: Satellite + ERA5 Environment
   - M4: Satellite + History + ERA5 Environment
   - M5: Full Multimodal Fusion (deterministic)
   - M6: Full Multimodal Fusion + Calibrated Uncertainty (Quantile)
   - M7: Full Multimodal Fusion + Extreme Event Weighted Loss
