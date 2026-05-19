# PowerTrack Documentation

## Executive Overview

PowerTrack is a web-based energy consumption forecast platform that combines:
- 🔌 IoT hardware (ESP32 + ACS712)
- 🤖 predictive modeling with a cyclic regression engine
- 💻 interactive dashboard built with Next.js + React
- 💾 local JSON data persistence for hourly measurements

The platform helps users monitor and optimize electricity usage with hourly history, peak detection, and alerts.

---

## Project Structure

```
powertrack/
│
├── app/                          # Next.js app
│   ├── page.tsx                  # Main dashboard
│   ├── layout.tsx                # Global layout
│   ├── globals.css               # Base styles
│   └── api/                      # API routes
│
├── components/                   # Reusable UI components
│   ├── ConsumptionChart.tsx      # Historical consumption chart
│   ├── PredictionChart.tsx       # Forecast chart aligned with history
│   ├── StatCard.tsx              # Stats cards
│   ├── PeakAlert.tsx             # Peak alert cards
│   ├── RecentReadings.tsx        # Recent readings list
│   └── ModelInfo.tsx             # Model details panel
│
├── lib/                          # Business logic
│   ├── linearRegression.ts       # Prediction model
│   ├── mockData.ts               # Demo data generator
│   └── db.ts                     # Local storage helpers
│
├── scripts/                      # Utility scripts
│   └── post-reading-example.js   # Example POST request
│
├── data/                         # Local persistence
│   └── readings.json             # Hourly readings storage
│
├── docs/                         # Documentation files
│   ├── ESP32_SETUP.md            # ESP32 wiring and firmware guide
│   ├── TECHNICAL.md              # Architecture and API reference
│   └── INDEX.md                  # This documentation index
│
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
└── README.md                     # Main README
```

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

## Main Components

### ConsumptionChart 📊
- File: `components/ConsumptionChart.tsx`
- Purpose: Show 24-hour historical consumption

### PredictionChart 🔮
- File: `components/PredictionChart.tsx`
- Purpose: Show hourly forecast aligned with the historical axis

### StatCard / StatsGrid 📈
- File: `components/StatCard.tsx`
- Purpose: Display current, average, peak, and predicted values

### PeakAlert & Recommendations ⚠️
- File: `components/PeakAlert.tsx`
- Purpose: Alert on consumption peaks and provide savings tips

### RecentReadings 📋
- File: `components/RecentReadings.tsx`
- Purpose: Display the last four readings with trend indicators

### ModelInfo 🧠
- File: `components/ModelInfo.tsx`
- Purpose: Display model parameters and accuracy metrics

---

## Logic Modules

### `lib/linearRegression.ts`
- Uses cyclic hourly features to capture daily consumption patterns
- Includes harmonic terms such as `cos(2πh/24)` and `sin(2πh/24)` plus a second harmonic
- Produces a model that is more robust than a straight line

### `lib/db.ts`
- Reads and writes readings in `data/readings.json`
- Provides `getReadings()` and `addReading()` for the API

### `lib/mockData.ts`
- Generates demo consumption data
- Computes stats, detects peaks, and builds recommendations

---

## Local Storage and API

### API endpoints
- `GET /api/readings` - retrieve stored readings
- `POST /api/readings` - add a new hourly reading

### Example command
```bash
npm run post-reading-example
```

### Example payload
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
- Added example POST script in `scripts/post-reading-example.js`
- Updated the prediction model to use cyclic hourly features
- Aligned forecast chart with historical hour labels
- Translated documentation into English

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
