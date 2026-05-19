# PowerTrack Technical Documentation

## Overview

PowerTrack is a full-stack energy monitoring and prediction system that combines:
1. IoT sensors (ACS712 + ESP32)
2. A cyclic regression model
3. A real-time dashboard built on Next.js and React

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       POWERTRACK SYSTEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HARDWARE LAYER (IoT)          BACKEND LAYER       UI LAYER   │
│  ─────────────────────         ─────────────       ────────   │
│  ┌──────────────────┐          ┌──────────────┐    ┌────────┐ │
│  │  ACS712 Sensor   │          │  Next.js API │    │ React  │ │
│  │  (Current meter) │  WiFi    │  (Node.js)   │ ── │ 19.2.4 │ │
│  └────────┬─────────┘      ┌───→              │    └────────┘ │
│           │                │   │  Model Engine│       │        │
│  ┌────────▼─────────┐      │   │  (Cyclic)    │       │        │
│  │  ESP32 Control   │──────┘   └──────────────┘       │        │
│  │  (WiFi Module)   │                                 │        │
│  └──────────────────┘         Real-time Updates ──────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Core Modules

### 1. Cyclic Regression Model (`lib/linearRegression.ts`)

#### Primary Functions

```typescript
calculateLinearRegression(data: ConsumptionData[]): RegressionModel
predictConsumption(model: RegressionModel, hour: number): number
calculateRSquared(data: ConsumptionData[], model: RegressionModel): number
generateHourlyPredictions(model: RegressionModel, currentHour: number): Prediction[]
```

#### Model Design

The current model uses hourly cyclic features. Instead of a simple straight line, it fits coefficients for:
- `intercept`
- `cos(2πh / 24)`
- `sin(2πh / 24)`
- `cos(4πh / 24)`
- `sin(4πh / 24)`

This structure captures daily consumption cycles and improves prediction accuracy for morning and evening peaks.

#### Metric: R²

```
R² = 1 - (SS_res / SS_tot)
```

- `SS_res` = Σ(y_actual - y_predicted)²
- `SS_tot` = Σ(y_actual - y_mean)²
- Range: 0 to 1

Interpretation:
- > 0.9: Excellent
- 0.75-0.9: Good
- 0.5-0.75: Acceptable
- < 0.5: Needs review

---

### 2. Demo Data Generator (`lib/mockData.ts`)

#### Functions

```typescript
generateMockConsumptionData(): ConsumptionData[]
getRecentReadings(): Reading[]
calculateConsumptionStats(data: ConsumptionData[]): Stats
detectPeaks(data: ConsumptionData[], threshold?: number): Peak[]
generateSavingsRecommendations(data: ConsumptionData[], predictions: any[]): Recommendation[]
```

#### Simulated Consumption Pattern

```
Hour   Base Consumption   Description
00-06  1-2 kW             Night low usage
06-10  4-5 kW             Morning rise
12-17  3-4 kW             Afternoon moderate usage
18-23  5-6 kW             Evening peak
```

Noise: ±15% to make data feel realistic.

---

### 3. Local Persistence (`lib/db.ts`)

- Stores hourly readings in `data/readings.json`
- Provides `getReadings()` and `addReading()` for API integration
- Used by `app/api/readings/route.ts`

### 4. API Route (`app/api/readings/route.ts`)

Supported operations:
- `GET /api/readings` - return stored readings
- `POST /api/readings` - add a new reading from ESP32 or test client

Example payload:

```json
{
  "consumption": 4.8,
  "current": 19.6,
  "timestamp": "2026-05-18T21:00:00Z"
}
```

---

## React Components

#### ConsumptionChart
- Prop: `data: ConsumptionData[]`
- Renders 24-hour historical consumption as a line chart

#### PredictionChart
- Props: `predictions`, `historicalData?`
- Renders the forecast aligned to the same hourly timestamps

#### StatCard / StatsGrid
- Render current, average, peak, and predicted values

#### PeakAlert / Recommendations
- Display peak alerts and energy-saving suggestions

#### ModelInfo
- Display model parameters and R² metric

#### RecentReadings
- Show the last four readings with trend direction

---

## Data Flow

### Initialization

```text
App mount
  → load stored readings or fallback mock data
  → build the prediction model
  → generate next 24-hour forecast
  → render dashboard
```

### Real-time pipeline

```text
ACS712 sensor → ESP32 → WiFi → API endpoint → local JSON DB
         ↓                                      ↓
    request data                              frontend fetch
         ↓                                      ↓
    update model                           render new forecast
```

---

## API Reference

### `GET /api/readings`
Returns stored readings ordered by timestamp.

Example response:

```json
{
  "readings": [ ... ]
}
```

### `POST /api/readings`
Adds a new hourly reading.

Example request:

```bash
curl -X POST http://localhost:3000/api/readings \
  -H "Content-Type: application/json" \
  -d '{"consumption":4.25,"current":18.5,"timestamp":"2026-05-18T21:00:00Z"}'
```

Example response:

```json
{
  "reading": {
    "id": "...",
    "timestamp": "2026-05-18T21:00:00Z",
    "consumption": 4.25,
    "current": 18.5
  }
}
```

---

## Why cyclic regression?

A plain linear model can only learn a single trend. The current consumption pattern is cyclic: low at night, higher in the morning, a midday lull, and a strong evening peak.

A harmonic regression model captures this daily cycle by adding cosine and sine features. This makes the forecast more realistic for hourly consumption.

---

## Future Improvements

### Short term
- Add user authentication
- Improve API error handling
- Store historical data for multiple days

### Mid term
- Add anomaly detection
- Add advanced time-series models (Prophet, XGBoost)
- Add exportable reports

### Long term
- Add multi-device support
- Add notifications (email/SMS)
- Add a production-grade database

---

## References

- [Recharts](https://recharts.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Time series forecasting](https://otexts.com/fpp2/)
- [ACS712 Datasheet](https://www.allegromicro.com/)

---

*Updated to English and aligned with the latest model and local storage features.*
