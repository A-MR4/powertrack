import React from 'react';

export interface Peak {
  hour: number;
  consumption: number;
  intensity: number;
}

interface PeakAlertProps {
  peaks: Peak[];
}

export function PeakAlert({ peaks }: PeakAlertProps) {
  if (peaks.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 dark:bg-slate-950 dark:border-green-700">
        <div className="text-green-600 dark:text-green-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-green-900 dark:text-green-200">Consumo Normal</p>
          <p className="text-sm text-green-800 dark:text-green-300">No se detectan picos anormales en las últimas 24 horas</p>
        </div>
      </div>
    );
  }

  const maxPeak = Math.max(...peaks.map(p => p.intensity));
  const alertType = maxPeak > 1.5 ? 'critical' : 'warning';

  return (
    <div className={`border rounded-lg p-4 ${
      alertType === 'critical' 
        ? 'bg-red-50 border-red-200 dark:bg-slate-950 dark:border-red-600' 
        : 'bg-amber-50 border-amber-200 dark:bg-slate-950 dark:border-amber-600'
    }`}>
      <div className="flex items-start gap-3">
        <div className={alertType === 'critical' ? 'text-red-500 dark:text-red-300' : 'text-amber-600 dark:text-amber-300'}>
          {alertType === 'critical' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p className={`font-semibold ${
            alertType === 'critical' 
              ? 'text-red-900 dark:text-red-200' 
              : 'text-amber-900 dark:text-amber-200'
          }`}>
            {alertType === 'critical' ? '⚠️ Picos Críticos Detectados' : '⚡ Picos de Consumo Detectados'}
          </p>
          <p className={`text-sm mt-1 ${
            alertType === 'critical' 
              ? 'text-slate-700 dark:text-slate-200' 
              : 'text-slate-700 dark:text-slate-200'
          }`}>
            Se registraron {peaks.length} hora(s) con consumo elevado. Máxima intensidad: {maxPeak.toFixed(2)}x el promedio.
          </p>
          
          <div className="mt-3 space-y-1">
            {peaks.map((peak, index) => (
              <div key={index} className="text-slate-700 dark:text-slate-200 flex items-center justify-between text-xs">
                <span className="font-mono">{String(peak.hour).padStart(2, '0')}:00</span>
                <span className="font-semibold">{peak.consumption.toFixed(2)} kW</span>
                <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden dark:bg-slate-700">
                  <div 
                    className={`h-full ${
                      peak.intensity > 1.5 
                        ? 'bg-red-500' 
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(peak.intensity * 20, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SavingsRecommendation {
  icon: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface RecommendationsProps {
  recommendations: SavingsRecommendation[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  const priorityColors = {
    high: 'border-red-200 bg-red-50 dark:border-red-600 dark:bg-slate-950',
    medium: 'border-amber-200 bg-amber-50 dark:border-amber-600 dark:bg-slate-950',
    low: 'border-blue-200 bg-blue-50 dark:border-blue-600 dark:bg-slate-950',
  };

  const priorityTextColors = {
    high: 'text-red-900 dark:text-red-200',
    medium: 'text-amber-900 dark:text-amber-200',
    low: 'text-blue-900 dark:text-blue-200',
  };

  const priorityLabels = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  };

  return (
    <div className="space-y-3">
      {recommendations.map((rec, index) => (
        <div 
          key={index} 
          className={`border rounded-lg p-4 ${priorityColors[rec.priority]}`}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">{rec.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={`font-semibold ${priorityTextColors[rec.priority]}`}>
                  {rec.title}
                </h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  rec.priority === 'high' 
                    ? 'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-200' 
                    : rec.priority === 'medium'
                    ? 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-200'
                    : 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-200'
                }`}>
                  Prioridad: {priorityLabels[rec.priority]}
                </span>
              </div>
              <p className={`text-sm mt-1 ${priorityTextColors[rec.priority]}`}>
                {rec.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
