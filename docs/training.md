# CycloneFusion-AI Training & Multi-Task Loss Specification

## Multi-Task Optimization Objective
The system solves detection, categorization, center localization, wind intensity, central pressure, and trajectory forecasting concurrently:

$$L_{\text{total}} = \lambda_{\text{det}} L_{\text{det}} + \lambda_{\text{cls}} L_{\text{cls}} + \lambda_{\text{loc}} L_{\text{loc}} + \lambda_{\text{int}} L_{\text{int}} + \lambda_{\text{pres}} L_{\text{pres}} + \lambda_{\text{track}} L_{\text{track}} + \lambda_{\text{ext}} L_{\text{ext}}$$

### Configurable Weights
- $\lambda_{\text{det}} = 1.0$: Binary focal loss for disturbance vs non-cyclonic cloud clusters
- $\lambda_{\text{cls}} = 1.5$: Class-weighted cross entropy for IMD 7-stage taxonomy
- $\lambda_{\text{loc}} = 2.0$: Smooth L1 on localized coordinate offsets
- $\lambda_{\text{int}} = 2.5$: Pinball quantile loss ($\tau \in [0.1, 0.5, 0.9]$) across horizons +6h, +12h, +24h, +48h
- $\lambda_{\text{pres}} = 1.0$: Huber regression loss for central pressure
- $\lambda_{\text{track}} = 3.0$: Great-circle geodesic distance loss (Haversine formulation)
- $\lambda_{\text{ext}} = 2.0$: Penalty scaling on severe and rapid intensification (RI $\ge 30$ kt/24h) episodes

## Experiment Tracking
- Every training step logs independently to MLflow backend.
- Checkpoints save model weights, normalizers, class boundaries, and random seeds.
