import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import { ConsumptionData } from '@/lib/linearRegression';

interface PredictionData {
  hour: number;
  consumption: number;
  timestamp: Date;
}

interface PredictionChartProps {
  predictions: PredictionData[];
  historicalData?: ConsumptionData[];
}

export function PredictionChart({ predictions, historicalData }: PredictionChartProps) {
  const [hours, setHours] = useState<number>(12);
  const [startIndex, setStartIndex] = useState<number>(0);

  // Build the visible window of predictions starting at `startIndex` and wrapping around
  const visible = Array.from({ length: Math.min(hours, predictions.length) }, (_, i) => {
    return predictions[(startIndex + i) % predictions.length];
  });

  // Ensure startIndex stays valid when `hours` changes
  // Reset startIndex to point to hour 0 (midnight) when predictions or horizon change
  useEffect(() => {
    const zeroIdx = predictions.findIndex((p) => p.hour === 0);
    setStartIndex(zeroIdx >= 0 ? zeroIdx : 0);
  }, [hours, predictions.length]);

  const chartData = visible.map((p) => {
    const historicalMatch = historicalData?.find((hist) => hist.time === p.hour);

    return {
      time: `${String(p.hour).padStart(2, '0')}:00`,
      prediction: p.consumption,
      historical: historicalMatch ? historicalMatch.consumption : null,
    };
  });

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Predicción de Consumo ({hours}h)</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Horizon:</label>
          <select
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm text-gray-600"
          >
            <option value={3}>3h</option>
            <option value={6}>6h</option>
            <option value={12}>12h</option>
            <option value={24}>24h</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex-1">
          <label className="text-sm text-gray-600 mr-2">Start hour:</label>
          <input
            type="range"
            className="no-fill-slider"
            min={0}
            max={Math.max(0, predictions.length - Math.min(hours, predictions.length))}
            value={startIndex}
            onChange={(e) => setStartIndex(Number(e.target.value))}
          />
        </div>
        <div className="w-32 text-right text-sm text-gray-600">
          <span>From: </span>
          <strong>{visible[0] ? `${String(visible[0].hour).padStart(2, '0')}:00` : '--:--'}</strong>
        </div>
      </div>

      <style jsx>{`
        .no-fill-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 9999px;
          outline: none;
        }
        .no-fill-slider:focus {
          box-shadow: none;
        }
        .no-fill-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg,#10b981,#06b6d4);
          box-shadow: 0 2px 6px rgba(16,185,129,0.28);
          border: 2px solid #ffffff;
          cursor: pointer;
          margin-top: -5px; /* center thumb on track */
        }
        .no-fill-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg,#10b981,#06b6d4);
          box-shadow: 0 2px 6px rgba(16,185,129,0.28);
          border: 2px solid #ffffff;
          cursor: pointer;
        }
        .no-fill-slider::-ms-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg,#10b981,#06b6d4);
          box-shadow: 0 2px 6px rgba(16,185,129,0.28);
          border: 2px solid #ffffff;
          cursor: pointer;
        }
        /* Remove default filled track in webkit browsers */
        .no-fill-slider::-webkit-slider-runnable-track {
          height: 8px;
          background: #e5e7eb;
          border-radius: 9999px;
        }
      `}</style>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#6b7280"
            label={{ value: 'Consumo (kW)', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value: any) => typeof value === 'number' ? [`${value.toFixed(2)} kW`, ''] : value}
          />
          <Legend />
          {historicalData && (
            <Bar 
              dataKey="historical" 
              fill="#fbbf24" 
              name="Histórico"
              opacity={0.6}
            />
          )}
          <Line
            type="monotone"
            dataKey="prediction"
            stroke="#10b981"
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
            name="Predicción (Regresión Lineal)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
