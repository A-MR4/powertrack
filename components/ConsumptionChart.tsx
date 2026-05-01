import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ConsumptionData } from '@/lib/linearRegression';

interface ConsumptionChartProps {
  data: ConsumptionData[];
  title?: string;
}

export function ConsumptionChart({ data, title = "Consumo Histórico" }: ConsumptionChartProps) {
  const chartData = data.map(d => ({
    time: `${String(d.time).padStart(2, '0')}:00`,
    consumption: d.consumption,
  }));

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
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
            formatter={(value: number) => [`${value.toFixed(2)} kW`, 'Consumo']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="consumption"
            stroke="#3b82f6"
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
            name="Consumo (kW)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
