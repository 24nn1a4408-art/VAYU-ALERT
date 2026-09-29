"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import * as d3 from "d3"
import { Play, Pause, Compass, Eye, ShieldAlert, Crosshair, Layers } from "lucide-react"

export interface CycloneTrajectoryPoint {
  lat: number
  lon: number
  timeStep?: string
  hoursAhead?: number
  windKmh?: number
  windKt?: number
  category?: string
  landfallStatus?: string
  notes?: string
}

export interface CycloneTrajectoryData {
  id: string
  name: string
  basinId?: string
  basinName?: string
  alertLevel?: "red" | "yellow" | "green" | string
  status?: string
  location: {
    lat: number
    lon: number
    distanceToCoastKm?: number
    nearestLandmark?: string
  }
  intensity?: {
    windKmh?: number
    windKt?: number
    categoryName?: string
    categoryCode?: string
  }
  direction?: string
  forwardSpeedKmh?: number
  headingAngleDeg?: number
  trackForecast?: CycloneTrajectoryPoint[]
  historicalTrack?: CycloneTrajectoryPoint[]
}

export interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
  cyclones?: CycloneTrajectoryData[]
  selectedCycloneId?: string | null
  onSelectCyclone?: (cycloneId: string) => void
  showHistoricalTracks?: boolean
  showForecastTracks?: boolean
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export default function RotatingEarth({
  width = 800,
  height = 600,
  className = "",
  cyclones = [],
  selectedCycloneId = null,
  onSelectCyclone,
  showHistoricalTracks: initialShowHistorical = true,
  showForecastTracks: initialShowForecast = true,
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Interactive controls state
  const [autoRotate, setAutoRotate] = useState(true)
  const [showHistorical, setShowHistorical] = useState(initialShowHistorical)
  const [showForecast, setShowForecast] = useState(initialShowForecast)
  const [focusedCycloneId, setFocusedCycloneId] = useState<string | null>(selectedCycloneId)
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null)

  // References to keep animation loop clean
  const cyclonesRef = useRef(cyclones)
  cyclonesRef.current = cyclones

  const showHistoricalRef = useRef(showHistorical)
  showHistoricalRef.current = showHistorical

  const showForecastRef = useRef(showForecast)
  showForecastRef.current = showForecast

  const focusedCycloneIdRef = useRef(focusedCycloneId)
  focusedCycloneIdRef.current = focusedCycloneId

  const autoRotateRef = useRef(autoRotate)
  autoRotateRef.current = autoRotate

  // Focus transition tracking
  const targetRotationRef = useRef<[number, number] | null>(null)
  const rotationRef = useRef<[number, number]>([0, 0])

  // Sync external selectedCycloneId
  useEffect(() => {
    if (selectedCycloneId) {
      setFocusedCycloneId(selectedCycloneId)
      const targetCyc = cyclones.find((c) => c.id === selectedCycloneId)
      if (targetCyc) {
        targetRotationRef.current = [-targetCyc.location.lon, -targetCyc.location.lat]
      }
    }
  }, [selectedCycloneId, cyclones])

  const handleFocusCyclone = (cycloneId: string | null) => {
    setFocusedCycloneId(cycloneId)
    if (onSelectCyclone && cycloneId) {
      onSelectCyclone(cycloneId)
    }

    if (cycloneId) {
      const cyc = cyclones.find((c) => c.id === cycloneId)
      if (cyc) {
        targetRotationRef.current = [-cyc.location.lon, -cyc.location.lat]
      }
    } else {
      targetRotationRef.current = null
    }
  }

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    // Responsive sizing
    const containerWidth = Math.min(width, window.innerWidth - 30)
    const containerHeight = Math.min(height, window.innerHeight - 100)
    const radius = Math.min(containerWidth, containerHeight) / 2.45

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`
    context.scale(dpr, dpr)

    // Orthographic projection
    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    // Point in polygon math for Natural Earth land dots
    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point
      let inside = false
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside
        }
      }
      return inside
    }

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry
      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates
        if (!pointInPolygon(point, coordinates[0])) return false
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) return false
        }
        return true
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true
                break
              }
            }
            if (!inHole) return true
          }
        }
        return false
      }
      return false
    }

    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = []
      const bounds = d3.geoBounds(feature)
      const [[minLng, minLat], [maxLng, maxLat]] = bounds
      const stepSize = dotSpacing * 0.08

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat]
          if (pointInFeature(point, feature)) {
            dots.push(point)
          }
        }
      }
      return dots
    }

    interface DotData {
      lng: number
      lat: number
      visible: boolean
    }

    const allDots: DotData[] = []
    let landFeatures: any = null

    // Check if coordinate is on the visible front hemisphere of the globe
    const isPointVisibleOnGlobe = (lon: number, lat: number): boolean => {
      if (!projection.invert) return false
      const center = projection.invert([containerWidth / 2, containerHeight / 2])
      if (!center) return false
      return d3.geoDistance(center, [lon, lat]) < Math.PI / 2 * 0.98
    }

    // Main render frame
    const render = (elapsedMs: number) => {
      context.clearRect(0, 0, containerWidth, containerHeight)

      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius

      // 1. Draw ocean globe background
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      context.fillStyle = "#081b14"
      context.fill()

      // Subtle atmospheric halo around Earth
      const haloGrad = context.createRadialGradient(
        containerWidth / 2,
        containerHeight / 2,
        currentScale * 0.94,
        containerWidth / 2,
        containerHeight / 2,
        currentScale * 1.03
      )
      haloGrad.addColorStop(0, "rgba(65, 100, 74, 0.4)")
      haloGrad.addColorStop(1, "rgba(65, 100, 74, 0)")
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale * 1.03, 0, 2 * Math.PI)
      context.fillStyle = haloGrad
      context.fill()

      context.strokeStyle = "#41644A"
      context.lineWidth = 1.8 * scaleFactor
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      context.stroke()

      // 2. Draw graticule
      const graticule = d3.geoGraticule()
      context.beginPath()
      path(graticule())
      context.strokeStyle = "#4d7a5b"
      context.lineWidth = 0.8 * scaleFactor
      context.globalAlpha = 0.22
      context.stroke()
      context.globalAlpha = 1

      // 3. Draw land outlines
      if (landFeatures) {
        context.beginPath()
        landFeatures.features.forEach((feature: any) => {
          path(feature)
        })
        context.strokeStyle = "#6f9e7b"
        context.lineWidth = 0.9 * scaleFactor
        context.globalAlpha = 0.85
        context.stroke()
        context.globalAlpha = 1

        // 4. Draw halftone land dots
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat])
          if (
            projected &&
            projected[0] >= 0 &&
            projected[0] <= containerWidth &&
            projected[1] >= 0 &&
            projected[1] <= containerHeight
          ) {
            context.beginPath()
            context.arc(projected[0], projected[1], 1.15 * scaleFactor, 0, 2 * Math.PI)
            context.fillStyle = "#EBE1D1"
            context.globalAlpha = 0.82
            context.fill()
          }
        })
        context.globalAlpha = 1
      }

      // 5. RENDER CYCLONE TRAJECTORIES (Historical & Forecasted Arcs)
      const currentCyclones = cyclonesRef.current || []
      const renderHistorical = showHistoricalRef.current
      const renderForecast = showForecastRef.current
      const currentFocusedId = focusedCycloneIdRef.current

      currentCyclones.forEach((cyclone) => {
        const isFocused = currentFocusedId === cyclone.id

        // Determine theme colors based on cyclone alert level
        let alertColor = "#ef4444" // red / severe
        let alertSecondary = "#fca5a5"
        if (cyclone.alertLevel === "yellow") {
          alertColor = "#f59e0b"
          alertSecondary = "#fde68a"
        } else if (cyclone.alertLevel === "green") {
          alertColor = "#10b981"
          alertSecondary = "#a7f3d0"
        }

        const curLon = cyclone.location.lon
        const curLat = cyclone.location.lat

        // --- A. HISTORICAL TRAJECTORY ---
        if (renderHistorical) {
          // Extract historical points or backward-synthesize
          let histPoints: [number, number][] = []
          if (cyclone.historicalTrack && cyclone.historicalTrack.length > 0) {
            histPoints = cyclone.historicalTrack.map((wp) => [wp.lon, wp.lat])
          } else if (cyclone.trackForecast) {
            const past = cyclone.trackForecast.filter((wp) => wp.hoursAhead < 0)
            if (past.length > 0) {
              histPoints = past.map((wp) => [wp.lon, wp.lat])
            }
          }

          // Fallback backward projection if not present
          if (histPoints.length === 0) {
            const heading = cyclone.headingAngleDeg ?? 330
            const backwardRad = ((heading + 180) * Math.PI) / 180
            const p24: [number, number] = [
              curLon + Math.sin(backwardRad) * 4.2,
              curLat + Math.cos(backwardRad) * 4.0,
            ]
            const p12: [number, number] = [
              curLon + Math.sin(backwardRad) * 2.1,
              curLat + Math.cos(backwardRad) * 2.0,
            ]
            histPoints = [p24, p12]
          }

          const fullHistCoords: [number, number][] = [...histPoints, [curLon, curLat]]

          // Draw historical dotted path
          const histLineString: any = {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: fullHistCoords,
            },
            properties: {},
          }

          context.save()
          context.beginPath()
          path(histLineString)
          context.strokeStyle = "rgba(148, 163, 184, 0.75)" // slate-400
          context.lineWidth = 1.8 * scaleFactor
          context.setLineDash([3 * scaleFactor, 3 * scaleFactor])
          context.stroke()
          context.restore()

          // Draw historical observation nodes
          if (cyclone.historicalTrack) {
            cyclone.historicalTrack.forEach((hwp) => {
              if (isPointVisibleOnGlobe(hwp.lon, hwp.lat)) {
                const pt = projection([hwp.lon, hwp.lat])
                if (pt) {
                  context.save()
                  context.beginPath()
                  context.arc(pt[0], pt[1], 2.2 * scaleFactor, 0, 2 * Math.PI)
                  context.fillStyle = "#94a3b8"
                  context.fill()
                  context.strokeStyle = "#081b14"
                  context.lineWidth = 0.8 * scaleFactor
                  context.stroke()

                  // Historical label (T-24h etc.)
                  context.font = `${Math.max(8, Math.round(8.5 * scaleFactor))}px monospace`
                  context.fillStyle = "rgba(203, 213, 225, 0.85)"
                  const tag = hwp.timeStep ? hwp.timeStep.split(" ")[0] : "Past"
                  context.fillText(tag, pt[0] + 4 * scaleFactor, pt[1] - 3 * scaleFactor)
                  context.restore()
                }
              }
            })
          }
        }

        // --- B. FORECASTED TRAJECTORY ---
        if (renderForecast) {
          const forecastWaypoints = cyclone.trackForecast
            ? cyclone.trackForecast.filter((wp) => wp.hoursAhead >= 0)
            : []

          const foreCoords: [number, number][] = [
            [curLon, curLat],
            ...forecastWaypoints.map((wp) => [wp.lon, wp.lat] as [number, number]),
          ]

          if (foreCoords.length > 1) {
            const foreLineString: any = {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: foreCoords,
              },
              properties: {},
            }

            // 1. Uncertainty Cone Swath (Atmospheric dispersion corridor)
            context.save()
            context.beginPath()
            path(foreLineString)
            context.strokeStyle =
              cyclone.alertLevel === "red"
                ? "rgba(239, 68, 68, 0.12)"
                : "rgba(245, 158, 11, 0.12)"
            context.lineWidth = (isFocused ? 18 : 12) * scaleFactor
            context.setLineDash([])
            context.stroke()
            context.restore()

            // 2. Animated marching-dash forecast line
            context.save()
            context.beginPath()
            path(foreLineString)
            context.strokeStyle = alertColor
            context.lineWidth = (isFocused ? 3 : 2.4) * scaleFactor
            context.setLineDash([7 * scaleFactor, 4 * scaleFactor])
            context.lineDashOffset = -(elapsedMs * 0.025 * scaleFactor)
            context.stroke()
            context.restore()

            // 3. Animated Travelling Particles / Comets along the forecast arc
            const segDistances: number[] = []
            let totalArcDist = 0
            for (let i = 0; i < foreCoords.length - 1; i++) {
              const d = d3.geoDistance(foreCoords[i], foreCoords[i + 1])
              segDistances.push(d)
              totalArcDist += d
            }

            if (totalArcDist > 0) {
              const numParticles = 2
              for (let p = 0; p < numParticles; p++) {
                const progress = (elapsedMs * 0.00025 + p * 0.5) % 1
                const targetDist = progress * totalArcDist

                let accum = 0
                let segIdx = 0
                let segFrac = 0
                for (let i = 0; i < segDistances.length; i++) {
                  if (accum + segDistances[i] >= targetDist) {
                    segIdx = i
                    segFrac = (targetDist - accum) / (segDistances[i] || 1e-5)
                    break
                  }
                  accum += segDistances[i]
                }

                const interp = d3.geoInterpolate(foreCoords[segIdx], foreCoords[segIdx + 1])
                const pCoord = interp(segFrac)

                if (isPointVisibleOnGlobe(pCoord[0], pCoord[1])) {
                  const sPt = projection(pCoord)
                  if (sPt) {
                    context.save()
                    // Outer pulse
                    context.beginPath()
                    context.arc(sPt[0], sPt[1], 5.5 * scaleFactor, 0, 2 * Math.PI)
                    context.fillStyle = alertColor
                    context.globalAlpha = 0.5
                    context.fill()

                    // Core bright bead
                    context.beginPath()
                    context.arc(sPt[0], sPt[1], 2.8 * scaleFactor, 0, 2 * Math.PI)
                    context.fillStyle = "#ffffff"
                    context.globalAlpha = 0.95
                    context.fill()
                    context.restore()
                  }
                }
              }
            }

            // 4. Forecast Waypoint Nodes & Landfall Marker
            forecastWaypoints.forEach((fwp) => {
              if (isPointVisibleOnGlobe(fwp.lon, fwp.lat)) {
                const pt = projection([fwp.lon, fwp.lat])
                if (pt) {
                  const isLandfall =
                    fwp.landfallStatus &&
                    (fwp.landfallStatus.includes("Landfall") ||
                      fwp.landfallStatus.includes("Coastal"))

                  context.save()
                  if (isLandfall) {
                    // Concentric pulsing landfall target
                    const pulseFrac = (elapsedMs * 0.0025) % 1
                    context.beginPath()
                    context.arc(pt[0], pt[1], (4 + pulseFrac * 9) * scaleFactor, 0, 2 * Math.PI)
                    context.strokeStyle = "#f43f5e"
                    context.lineWidth = 1.5 * scaleFactor
                    context.globalAlpha = 1 - pulseFrac
                    context.stroke()
                    context.globalAlpha = 1

                    // Target center diamond
                    context.beginPath()
                    context.arc(pt[0], pt[1], 4.2 * scaleFactor, 0, 2 * Math.PI)
                    context.fillStyle = "#e11d48"
                    context.fill()
                    context.strokeStyle = "#ffffff"
                    context.lineWidth = 1.4 * scaleFactor
                    context.stroke()

                    // Landfall pill badge
                    context.font = `bold ${Math.max(9, Math.round(9.5 * scaleFactor))}px sans-serif`
                    const text = `LANDFALL (${fwp.timeStep.split(" ")[0]})`
                    const textWidth = context.measureText(text).width
                    const tagW = textWidth + 8 * scaleFactor
                    const tagH = 14 * scaleFactor
                    context.fillStyle = "rgba(225, 29, 72, 0.92)"
                    roundRect(context, pt[0] + 6 * scaleFactor, pt[1] - 16 * scaleFactor, tagW, tagH, 3 * scaleFactor)
                    context.fill()
                    context.fillStyle = "#ffffff"
                    context.fillText(text, pt[0] + 10 * scaleFactor, pt[1] - 5 * scaleFactor)
                  } else {
                    // Standard forecast node
                    context.beginPath()
                    context.arc(pt[0], pt[1], 3.2 * scaleFactor, 0, 2 * Math.PI)
                    context.fillStyle = alertColor
                    context.fill()
                    context.strokeStyle = "#ffffff"
                    context.lineWidth = 1 * scaleFactor
                    context.stroke()

                    // Timestep text
                    context.font = `${Math.max(8, Math.round(8.5 * scaleFactor))}px monospace`
                    context.fillStyle = "rgba(235, 225, 209, 0.9)"
                    const stepLabel = fwp.timeStep.split(" ")[0]
                    context.fillText(stepLabel, pt[0] + 5 * scaleFactor, pt[1] + 3 * scaleFactor)
                  }
                  context.restore()
                }
              }
            })
          }
        }

        // --- C. CYCLONE CENTER (EYE & VORTEX) ---
        if (isPointVisibleOnGlobe(curLon, curLat)) {
          const eyePt = projection([curLon, curLat])
          if (eyePt) {
            const eyeX = eyePt[0]
            const eyeY = eyePt[1]

            context.save()
            // 1. Radar pulse rings
            const pulse1 = (elapsedMs * 0.0014) % 1
            const pulse2 = (elapsedMs * 0.0014 + 0.5) % 1
            ;[pulse1, pulse2].forEach((p) => {
              context.beginPath()
              context.arc(eyeX, eyeY, (5 + p * 22) * scaleFactor, 0, 2 * Math.PI)
              context.strokeStyle = alertColor
              context.lineWidth = (isFocused ? 2.2 : 1.6) * scaleFactor
              context.globalAlpha = Math.max(0, 1 - p)
              context.stroke()
            })
            context.globalAlpha = 1

            // 2. Rotating hurricane vortex arms
            context.save()
            context.translate(eyeX, eyeY)
            context.rotate(elapsedMs * 0.0035)
            context.strokeStyle = "#ffffff"
            context.lineWidth = 1.6 * scaleFactor
            // Arm 1
            context.beginPath()
            context.arc(0, 0, 8.5 * scaleFactor, 0, Math.PI * 0.65)
            context.stroke()
            // Arm 2
            context.beginPath()
            context.arc(0, 0, 8.5 * scaleFactor, Math.PI, Math.PI * 1.65)
            context.stroke()
            context.restore()

            // 3. Central Eye Core
            context.beginPath()
            context.arc(eyeX, eyeY, 5 * scaleFactor, 0, 2 * Math.PI)
            context.fillStyle = alertColor
            context.fill()
            context.strokeStyle = "#ffffff"
            context.lineWidth = 1.8 * scaleFactor
            context.stroke()

            // 4. Cyclone Name & Wind Badge
            const title = cyclone.name
            const wind = cyclone.intensity?.windKmh
              ? `${cyclone.intensity.windKmh} km/h`
              : cyclone.status || ""

            context.font = `bold ${Math.max(10, Math.round(11 * scaleFactor))}px sans-serif`
            const titleWidth = context.measureText(title).width
            const badgeW = Math.max(titleWidth + 18, 85) * scaleFactor
            const badgeH = 26 * scaleFactor
            const badgeX = eyeX + 12 * scaleFactor
            const badgeY = eyeY - 26 * scaleFactor

            // Lead line to badge
            context.beginPath()
            context.moveTo(eyeX, eyeY)
            context.lineTo(badgeX, badgeY + badgeH / 2)
            context.strokeStyle = alertColor
            context.lineWidth = 1.2 * scaleFactor
            context.stroke()

            // Badge card container
            context.fillStyle = "rgba(8, 27, 20, 0.94)"
            context.strokeStyle = isFocused ? "#ffffff" : alertColor
            context.lineWidth = (isFocused ? 1.8 : 1.2) * scaleFactor
            roundRect(context, badgeX, badgeY, badgeW, badgeH, 5 * scaleFactor)
            context.fill()
            context.stroke()

            // Badge text lines
            context.fillStyle = "#ffffff"
            context.font = `bold ${Math.max(10, Math.round(10.5 * scaleFactor))}px sans-serif`
            context.fillText(title, badgeX + 6 * scaleFactor, badgeY + 11 * scaleFactor)

            context.fillStyle = alertSecondary
            context.font = `${Math.max(8, Math.round(8.5 * scaleFactor))}px monospace`
            context.fillText(wind, badgeX + 6 * scaleFactor, badgeY + 21 * scaleFactor)

            context.restore()
          }
        }
      })
    }

    // Load Natural Earth land map
    const loadWorldData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
        )
        if (!response.ok) throw new Error("Failed to load land data")

        landFeatures = await response.json()

        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 16)
          dots.forEach(([lng, lat]) => {
            allDots.push({ lng, lat, visible: true })
          })
        })

        setIsLoading(false)
      } catch (err) {
        setError("Failed to load land map data")
        setIsLoading(false)
      }
    }

    // Rotation and smooth focus transition loop
    const rotationSpeed = 0.4
    let userInteracting = false

    const frameLoop = (elapsed: number) => {
      // If targeting a specific cyclone, smoothly glide toward it
      if (targetRotationRef.current && !userInteracting) {
        const [targetX, targetY] = targetRotationRef.current
        const dx = targetX - rotationRef.current[0]
        const dy = targetY - rotationRef.current[1]

        rotationRef.current[0] += dx * 0.05
        rotationRef.current[1] += dy * 0.05

        projection.rotate(rotationRef.current)

        // Once close enough to target, resume slow orbit
        if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
          targetRotationRef.current = null
        }
      } else if (autoRotateRef.current && !userInteracting) {
        rotationRef.current[0] += rotationSpeed
        projection.rotate(rotationRef.current)
      }

      render(elapsed)
    }

    const timer = d3.timer(frameLoop)

    // Mouse drag interaction
    const handleMouseDown = (event: MouseEvent) => {
      userInteracting = true
      targetRotationRef.current = null

      const startX = event.clientX
      const startY = event.clientY
      const startRotation = [...rotationRef.current] as [number, number]

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const sensitivity = 0.45
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY

        rotationRef.current[0] = startRotation[0] + dx * sensitivity
        rotationRef.current[1] = Math.max(-85, Math.min(85, startRotation[1] - dy * sensitivity))

        projection.rotate(rotationRef.current)
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        setTimeout(() => {
          userInteracting = false
        }, 150)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const scaleFactor = event.deltaY > 0 ? 0.92 : 1.08
      const newRadius = Math.max(radius * 0.6, Math.min(radius * 2.8, projection.scale() * scaleFactor))
      projection.scale(newRadius)
    }

    // Hit test cyclone on click
    const handleCanvasClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      const list = cyclonesRef.current || []
      for (const cyc of list) {
        if (isPointVisibleOnGlobe(cyc.location.lon, cyc.location.lat)) {
          const pt = projection([cyc.location.lon, cyc.location.lat])
          if (pt) {
            const dist = Math.hypot(pt[0] - mouseX, pt[1] - mouseY)
            if (dist < 28) {
              handleFocusCyclone(cyc.id)
              break
            }
          }
        }
      }
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("wheel", handleWheel, { passive: false })
    canvas.addEventListener("click", handleCanvasClick)

    loadWorldData()

    return () => {
      timer.stop()
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("wheel", handleWheel)
      canvas.removeEventListener("click", handleCanvasClick)
    }
  }, [width, height])

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-emerald-950/20 rounded-2xl p-8 border border-rose-400/30 ${className}`}>
        <div className="text-center">
          <p className="text-rose-400 font-semibold mb-2">Error loading Earth visualization</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className} space-y-3`}>
      {/* Globe Controls & Cyclone Focus Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-[#41644A]/40 backdrop-blur-md text-xs">
        {/* Cyclone Quick-Focus Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1 mr-1">
            <Crosshair className="h-3 w-3" />
            <span>Target Cyclone:</span>
          </span>

          {cyclones.map((cyc) => {
            const isSelected = focusedCycloneId === cyc.id
            return (
              <button
                key={cyc.id}
                onClick={() => handleFocusCyclone(isSelected ? null : cyc.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? cyc.alertLevel === "red"
                      ? "bg-rose-700 text-white shadow-xs ring-1 ring-rose-400"
                      : "bg-amber-600 text-white shadow-xs ring-1 ring-amber-300"
                    : "bg-[#0D4715]/70 hover:bg-[#0D4715] text-[#EBE1D1] border border-[#41644A]/30"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    cyc.alertLevel === "red" ? "bg-rose-400 animate-pulse" : "bg-amber-400"
                  }`}
                />
                <span>{cyc.name}</span>
              </button>
            )
          })}

          {focusedCycloneId && (
            <button
              onClick={() => handleFocusCyclone(null)}
              className="px-2 py-1 rounded-lg text-[10px] text-slate-400 hover:text-white bg-slate-800 border border-slate-700 font-mono"
            >
              Reset View
            </button>
          )}
        </div>

        {/* Trajectory Layer Toggles */}
        <div className="flex items-center space-x-1.5 text-xs">
          <button
            onClick={() => setShowHistorical(!showHistorical)}
            className={`px-2 py-1 rounded-md text-[11px] font-mono transition-all border ${
              showHistorical
                ? "bg-slate-800 text-cyan-300 border-cyan-500/50"
                : "bg-slate-900/60 text-slate-500 border-slate-800"
            }`}
            title="Toggle Historical Trajectory (-24h)"
          >
            Past Track (-24h)
          </button>

          <button
            onClick={() => setShowForecast(!showForecast)}
            className={`px-2 py-1 rounded-md text-[11px] font-mono transition-all border ${
              showForecast
                ? "bg-slate-800 text-rose-300 border-rose-500/50"
                : "bg-slate-900/60 text-slate-500 border-slate-800"
            }`}
            title="Toggle Forecast Trajectory (+48h)"
          >
            Forecast Arc (+48h)
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[#EBE1D1] border border-slate-700"
            title={autoRotate ? "Pause Auto-Rotation" : "Resume Auto-Rotation"}
          >
            {autoRotate ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#41644A]/40 bg-[#081b14]">
        <canvas
          ref={canvasRef}
          className="w-full h-auto cursor-grab active:cursor-grabbing block"
          style={{ maxWidth: "100%", height: "auto" }}
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#081b14]/85 backdrop-blur-xs text-xs text-[#EBE1D1] font-mono">
            <div className="flex items-center space-x-2.5">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <span>Projecting Dotted Earth & Geodesic Trajectories...</span>
            </div>
          </div>
        )}

        {/* Informative Meteorological Overlay Legend */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950/85 border border-[#41644A]/30 backdrop-blur-md text-[10px] text-slate-300 font-mono shadow-lg">
          <div className="flex items-center space-x-1">
            <span className="h-1.5 w-4 border-b border-dashed border-slate-400 inline-block"></span>
            <span className="text-slate-400">Past Track</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="h-1.5 w-4 bg-rose-500 rounded-xs inline-block"></span>
            <span className="text-rose-300 font-semibold">Forecast Arc</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white animate-ping"></span>
            <span className="text-emerald-300">Live Eye</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-rose-700 ring-1 ring-rose-400"></span>
            <span className="text-rose-400 font-bold">Landfall Target</span>
          </div>

          <span className="text-slate-500 hidden md:inline">| Drag to orbit • Scroll to zoom</span>
        </div>
      </div>
    </div>
  )
}
