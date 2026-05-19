import React from 'react';
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
  const chartData = predictions.map((p) => {
    const historicalMatch = historicalData?.find((hist) => hist.time === p.hour);

    return {
      time: `${String(p.hour).padStart(2, '0')}:00`,
      prediction: p.consumption,
      historical: historicalMatch ? historicalMatch.consumption : null,
    };
  });

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Predicción de Consumo (24h)</h2>
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
