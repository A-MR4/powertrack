import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
  color?: 'blue' | 'green' | 'amber' | 'red';
}

const colorStyles = {
  blue: 'bg-blue-50 border-blue-200 text-blue-900',
  green: 'bg-green-50 border-green-200 text-green-900',
  amber: 'bg-amber-50 border-amber-200 text-amber-900',
  red: 'bg-red-50 border-red-200 text-red-900',
};

const iconColors = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  amber: 'text-amber-500',
  red: 'text-red-500',
};

// SVG Icons
const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ActivityIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export function StatCard({ 
  title, 
  value, 
  unit, 
  icon,
  trend,
  description,
  color = 'blue'
}: StatCardProps) {
  return (
    <div className={`p-6 rounded-lg border ${colorStyles[color]} shadow-sm`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <div className={`${iconColors[color]} w-6 h-6`}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">{value}</span>
        {unit && <span className="text-lg text-gray-500">{unit}</span>}
      </div>

      {description && (
        <p className="text-xs text-gray-600 mt-2">{description}</p>
      )}

      {trend && (
        <div className="mt-2 text-xs flex items-center gap-1">
          {trend === 'up' && <span className="text-red-500">↑ Aumentando</span>}
          {trend === 'down' && <span className="text-green-500">↓ Disminuyendo</span>}
          {trend === 'stable' && <span className="text-blue-500">→ Estable</span>}
        </div>
      )}
    </div>
  );
}

interface StatsGridProps {
  stats: {
    currentConsumption: number;
    average: number;
    peak: number;
    predicted: number;
  };
  rSquared?: number;
}

export function StatsGrid({ stats, rSquared }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Consumo Actual"
        value={stats.currentConsumption}
        unit="kW"
        icon={<ZapIcon className="w-6 h-6" />}
        color="blue"
      />
      <StatCard
        title="Promedio 24h"
        value={stats.average}
        unit="kW"
        icon={<ActivityIcon className="w-6 h-6" />}
        color="green"
      />
      <StatCard
        title="Pico Today"
        value={stats.peak}
        unit="kW"
        icon={<TrendingUpIcon className="w-6 h-6" />}
        color="amber"
        description="Máximo consumo del día"
      />
      <StatCard
        title="Predicción (1h)"
        value={stats.predicted}
        unit="kW"
        icon={<ActivityIcon className="w-6 h-6" />}
        color="blue"
        description={rSquared !== undefined ? `Precisión: ${Math.round(rSquared * 100)}%` : ''}
      />
    </div>
  );
}
