# PowerTrack

## Executive Summary

PowerTrack is a smart energy consumption dashboard with predictive analytics. It combines:
- 🔌 IoT hardware (ESP32 + ACS712)
- 🤖 machine learning and forecasting
- 💻 a dashboard built with Next.js + React
- 💾 local JSON persistence for readings

The application helps users monitor and optimize electricity usage with hourly history, peaks, and alerts.

---

## Key Features

- Interactive statistics cards for current, average, peak, and forecast consumption
- Historical 24-hour consumption chart
- Forecast chart aligned with hourly timestamps
- Peak detection and energy-saving recommendations
- Local readings storage in `data/readings.json`
- Backend API with GET and POST endpoints
- Demo POST script in `scripts/post-reading-example.js`

---

## Quick Start

### Install
```bash
cd powertrack
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

### Production build
```bash
npm run build
npm start
```

---

## Project Structure

```
powertrack/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── layout.tsx            # Global layout
│   ├── globals.css           # Global styles
│   └── api/                  # API routes
├── components/
│   ├── ConsumptionChart.tsx  # Historical chart
│   ├── PredictionChart.tsx   # Forecast chart
│   ├── StatCard.tsx          # Stats cards
│   ├── PeakAlert.tsx         # Peak alerts
│   ├── RecentReadings.tsx    # Recent readings list
│   └── ModelInfo.tsx         # Model details
├── lib/
│   ├── linearRegression.ts   # Prediction model logic
│   ├── mockData.ts           # Demo data generator
│   └── db.ts                 # Local storage helpers
├── scripts/
│   └── post-reading-example.js
├── data/
│   └── readings.json         # Local persisted readings
├── docs/
│   ├── ESP32_SETUP.md
│   ├── TECHNICAL.md
│   └── INDEX.md
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## Components Overview

### ConsumptionChart 📊
- File: `components/ConsumptionChart.tsx`
- Purpose: Display 24-hour historical consumption as a line chart

### PredictionChart 🔮
- File: `components/PredictionChart.tsx`
- Purpose: Display forecast aligned with the historical time axis

### StatCard / StatsGrid 📈
- File: `components/StatCard.tsx`
- Purpose: Show current, average, peak, and predicted values

### PeakAlert & Recommendations ⚠️
- File: `components/PeakAlert.tsx`
- Purpose: Warn about consumption peaks and show savings tips

### RecentReadings 📋
- File: `components/RecentReadings.tsx`
- Purpose: Display the last four hourly measurements

### ModelInfo 🧠
- File: `components/ModelInfo.tsx`
- Purpose: Show model parameters and accuracy metrics

---

## Logic Modules

### `lib/linearRegression.ts`
- Uses cyclic hourly features to capture daily consumption patterns
- Includes harmonic terms like `cos(2πh/24)` and `sin(2πh/24)` plus a second harmonic
- Produces a model that is more robust than a plain linear fit

### `lib/db.ts`
- Reads and writes readings to `data/readings.json`
- Provides `getReadings()` and `addReading()` for API usage

### `lib/mockData.ts`
- Generates realistic demo consumption data
- Computes statistics and detects peaks
- Builds personalized energy-saving recommendations

---

## API and Local Storage

### Endpoints
- `GET /api/readings` - retrieve stored readings
- `POST /api/readings` - add a new hourly reading

### Example command
```bash
npm run post-reading-example
```

### Example POST payload
```json
{
  "consumption": 4.25,
  "current": 18.5,
  "timestamp": "2026-05-18T21:00:00Z"
}
```

---

## Visual Design Notes

- Header gradient: `gray-800` to `gray-600`
- Primary accent: blue
- Warning accent: yellow/red
- Success accent: green

---

## Documentation Files

| File | Description |
|------|-------------|
| `README.md` | Main project overview |
| `docs/TECHNICAL.md` | Architecture and API details |
| `docs/ESP32_SETUP.md` | ESP32 wiring and firmware guide |
| `docs/INDEX.md` | Documentation index |

---

## Recent Updates

- Added local JSON persistence in `data/readings.json`
- Added backend API route in `app/api/readings/route.ts`
- Added a sample POST request script in `scripts/post-reading-example.js`
- Upgraded the model to include cyclic hourly features
- Aligned forecast chart with historical hour labels
- Converted documentation into English

---

## Useful Commands

```bash
npm install
npm run dev
npm run post-reading-example
npm run build
npm start
```

---

## License

MIT License
