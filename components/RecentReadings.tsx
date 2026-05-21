import React from 'react';

interface Reading {
  time: string;
  consumption: number;
  timestamp: Date;
}

interface RecentReadingsProps {
  readings: Reading[];
}

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export function RecentReadings({ readings }: RecentReadingsProps) {
  // Calcular tendencia
  const trend = readings.length > 1 
    ? readings[readings.length - 1].consumption - readings[0].consumption 
    : 0;
  const trendPositive = trend > 0;

  return (
    <div className="surface-card p-6 rounded-lg shadow-md border surface-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-surface-default flex items-center gap-2">
          <ClockIcon className="w-5 h-5" />
          Lecturas Recientes
        </h2>
        {trend !== 0 && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            trendPositive ? 'text-red-600' : 'text-green-600'
          }`}>
            <TrendingUpIcon className="w-4 h-4" />
            {trendPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(2)} kW
          </div>
        )}
      </div>

      <div className="space-y-2">
        {readings.map((reading, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 surface-card-muted rounded-lg surface-card-muted-hover transition"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-mono text-sm font-semibold text-surface-muted">
                {reading.time}
              </span>
            </div>
            <div className="text-right">
              <p className="font-bold text-surface-default">
                {reading.consumption.toFixed(2)} kW
              </p>
              <p className="text-xs text-surface-muted">
                {Math.round(reading.consumption * 1000)} W
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 surface-card-muted border surface-border rounded-lg">
        <p className="text-sm text-surface-default">
          <span className="font-semibold">Info:</span> Estos datos se actualizan cada hora con lecturas reales del sensor ACS712 conectado al dispositivo IoT.
        </p>
      </div>
    </div>
  );
}
