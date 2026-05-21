import React from 'react';
import { RegressionModel } from '@/lib/linearRegression';

interface ModelInfoProps {
  rSquared: number;
  model: RegressionModel;
  sampleCount: number;
}

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export function ModelInfo({ rSquared, model, sampleCount }: ModelInfoProps) {
  const accuracy = Math.round(rSquared * 100);
  const qualityStr = accuracy > 0.9 ? 'Excelente' : accuracy > 0.75 ? 'Buena' : 'Regular';
  const qualityColor = accuracy > 0.9 ? 'green' : accuracy > 0.75 ? 'amber' : 'orange';

  return (
    <div className="surface-card p-6 rounded-lg border surface-border shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <InfoIcon className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-surface-default">Modelo de Predicción</h3>
          <p className="text-sm text-surface-muted mt-1">
            Usa <span className="font-mono font-bold">Regresión cíclica</span> para capturar el patrón diario de consumo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="surface-card p-3 rounded-lg border surface-border md:col-span-2">
          <p className="text-xs text-surface-muted font-semibold">Fórmula</p>
          <div className="text-sm font-mono text-surface-default mt-1 space-y-1">
            <p>y = {model.intercept.toFixed(3)}</p>
            <p>+ {model.cos1.toFixed(3)}·cos(2πx/24)</p>
            <p>+ {model.sin1.toFixed(3)}·sin(2πx/24)</p>
            <p>+ {model.cos2.toFixed(3)}·cos(4πx/24)</p>
            <p>+ {model.sin2.toFixed(3)}·sin(4πx/24)</p>
          </div>
          <p className="text-xs text-surface-muted mt-2">x = hora del día</p>
        </div>

        <div className="surface-card p-3 rounded-lg border surface-border">
          <p className="text-xs text-surface-muted font-semibold">Precisión (R²)</p>
          <p className={`text-lg font-bold mt-1 text-${qualityColor}-600`}>
            {(rSquared * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-surface-muted mt-1 font-semibold">{qualityStr}</p>
        </div>

        <div className="surface-card p-3 rounded-lg border surface-border">
          <p className="text-xs text-surface-muted font-semibold">Periodicidad</p>
          <p className="text-sm font-bold text-surface-default mt-1">2 armónicos</p>
          <p className="text-xs text-surface-muted mt-1">Captura mañana + noche</p>
        </div>

        <div className="surface-card p-3 rounded-lg border surface-border">
          <p className="text-xs text-surface-muted font-semibold">Muestras</p>
          <p className="text-lg font-bold text-surface-default mt-1">{sampleCount}</p>
          <p className="text-xs text-surface-muted mt-1">datos históricos</p>
        </div>
      </div>

      <div className="mt-4 p-3 surface-card border surface-border rounded-lg">
        <p className="text-xs text-surface-muted leading-relaxed">
          <span className="font-semibold">¿Cómo funciona?</span> El modelo aprovecha componentes sinusoidales para representar el ciclo diario de consumo y predecir picos en la mañana y la tarde.
        </p>
      </div>
    </div>
  );
}
