'use client';

import React, { useMemo } from 'react';
import { ConsumptionChart } from '@/components/ConsumptionChart';
import { PredictionChart } from '@/components/PredictionChart';
import { StatsGrid } from '@/components/StatCard';
import { PeakAlert, Recommendations } from '@/components/PeakAlert';
import { RecentReadings } from '@/components/RecentReadings';
import { ModelInfo } from '@/components/ModelInfo';
import { 
  calculateLinearRegression, 
  generateHourlyPredictions, 
  calculateRSquared 
} from '@/lib/linearRegression';
import {
  generateMockConsumptionData,
  getRecentReadings,
  calculateConsumptionStats,
  detectPeaks,
  generateSavingsRecommendations,
} from '@/lib/mockData';

export default function Home() {
  // Generar datos y modelo de predicción
  const { 
    historicalData, 
    model, 
    predictions, 
    rSquared, 
    stats, 
    peaks, 
    recommendations,
    recentReadings,
    currentConsumption,
  } = useMemo(() => {
    const data = generateMockConsumptionData();
    const model = calculateLinearRegression(data);
    const rSquared = calculateRSquared(data, model);
    const currentHour = new Date().getHours();
    const predictions = generateHourlyPredictions(model, currentHour);
    const stats = calculateConsumptionStats(data);
    const peaks = detectPeaks(data);
    const recommendations = generateSavingsRecommendations(data, predictions);
    const recentReadings = getRecentReadings();
    const currentConsumption = recentReadings[recentReadings.length - 1]?.consumption || stats.average;

    return {
      historicalData: data,
      model,
      predictions,
      rSquared,
      stats,
      peaks,
      recommendations,
      recentReadings,
      currentConsumption,
    };
  }, []);

  const peakData = historicalData.map(d => d.consumption);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">⚡ PowerTrack</h1>
              <p className="text-blue-100 mt-2">Predicción inteligente de consumo eléctrico con IA</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Última actualización</p>
              <p className="text-lg font-semibold">{new Date().toLocaleTimeString('es-ES')}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <section>
          <StatsGrid 
            stats={{
              currentConsumption,
              average: stats.average,
              peak: stats.max,
              predicted: predictions[0]?.consumption || stats.average,
            }}
            rSquared={rSquared}
          />
        </section>

        {/* Alerts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Estado de Alertas</h2>
            <PeakAlert peaks={peaks} />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Recomendaciones</h2>
            <Recommendations recommendations={recommendations} />
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConsumptionChart 
            data={historicalData}
            title="📊 Consumo Histórico (24h)"
          />
          <PredictionChart 
            predictions={predictions}
            historicalConsumption={peakData}
          />
        </section>

        {/* Recent Readings */}
        <section>
          <RecentReadings readings={recentReadings} />
        </section>

        {/* Model Information */}
        <section>
          <ModelInfo 
            rSquared={rSquared}
            slope={model.slope}
            intercept={model.intercept}
            sampleCount={historicalData.length}
          />
        </section>

        {/* Information Section */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📡 Arquitectura del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">🔌 Hardware IoT</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <span className="font-mono">ACS712</span> - Sensor de corriente</li>
                <li>• <span className="font-mono">ESP32</span> - Controlador</li>
                <li>• WiFi integrado para conectividad</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">🤖 Algoritmo IA</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <span className="font-mono">Regresión Lineal</span> (Mínimos Cuadrados)</li>
                <li>• Parámetros: hora del día + consumo</li>
                <li>• R² = {(rSquared * 100).toFixed(1)}% (precisión)</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Aplicaciones</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Detectar picos de consumo</li>
                <li>• Optimizar costos eléctricos</li>
                <li>• Mantenimiento predictivo</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold">🎯 Flujo de Datos:</span> El sensor ACS712 mide la corriente en tiempo real → ESP32 procesa los datos → 
              se envían a través de WiFi → el modelo de regresión lineal analiza patrones → PowerTrack muestra predicciones y recomendaciones personalizadas.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-sm">
            <span className="font-semibold">PowerTrack v1.0</span> - Sistema de Predicción de Consumo Eléctrico
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Desarrollado con Next.js, React y IA (Regresión Lineal)
          </p>
        </div>
      </footer>
    </div>
  );
}
