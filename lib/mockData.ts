import { ConsumptionData } from './linearRegression';

/**
 * Genera datos históricos simulados de consumo eléctrico
 * Simula un patrón realista de consumo durante el día:
 * - Mínimo en madrugada (0-6h)
 * - Picos en mañana y noche (6-9h, 18-23h)
 * - Consumo moderado en tarde (12-17h)
 */
export function generateMockConsumptionData(): ConsumptionData[] {
  const data: ConsumptionData[] = [];
  
  // Patrón de consumo típico durante 24 horas
  const consumptionPattern = [
    2.1,  // 0h  - Madrugada (mínimo)
    1.8,  // 1h
    1.5,  // 2h
    1.3,  // 3h
    1.4,  // 4h
    1.6,  // 5h
    3.2,  // 6h  - Mañana (inicio)
    3,  // 7h
    3,  // 8h  - Pico mañana
    1,  // 9h
    3.9,  // 10h
    3.5,  // 11h
    3.8,  // 12h - Mediodía
    2,  // 13h
    3.9,  // 14h
    3.6,  // 15h
    3.4,  // 16h
    3.7,  // 17h
    2,  // 18h - Tarde-noche
    3,  // 19h
    3,  // 20h - Pico noche
    3,  // 21h
    2,  // 22h
    3.1,  // 23h
  ];

  consumptionPattern.forEach((baseConsumption, hour) => {
    data.push({
      time: hour,
      consumption: Math.round(baseConsumption * 100) / 100,
    });
  });

  return data;
}

/**
 * Simula lecturas recientes del sensor (últimas 4 horas)
 */
export function getRecentReadings() {
  return [
    {
      time: '09:00',
      consumption: 3.2,
      timestamp: new Date('2026-01-01T09:00:00Z'),
    },
    {
      time: '10:00',
      consumption: 3.8,
      timestamp: new Date('2026-01-01T10:00:00Z'),
    },
    {
      time: '11:00',
      consumption: 4.1,
      timestamp: new Date('2026-01-01T11:00:00Z'),
    },
    {
      time: '12:00',
      consumption: 4.5,
      timestamp: new Date('2026-01-01T12:00:00Z'),
    },
  ];
}

/**
 * Calcula estadísticas del consumo
 */
export function calculateConsumptionStats(data: ConsumptionData[]) {
  const consumptions = data.map(d => d.consumption);
  
  const average = consumptions.reduce((a, b) => a + b, 0) / consumptions.length;
  const max = Math.max(...consumptions);
  const min = Math.min(...consumptions);
  
  // Desviación estándar
  const variance = consumptions.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / consumptions.length;
  const stdDev = Math.sqrt(variance);

  return {
    average: Math.round(average * 100) / 100,
    max: Math.round(max * 100) / 100,
    min: Math.round(min * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
  };
}

/**
 * Detecta picos de consumo
 */
export function detectPeaks(data: ConsumptionData[], threshold: number = 1.2) {
  const avg = data.reduce((a, b) => a + b.consumption, 0) / data.length;
  
  return data.filter(point => point.consumption > avg * threshold)
    .map(point => ({
      hour: point.time,
      consumption: point.consumption,
      intensity: Math.round((point.consumption / avg) * 100) / 100,
    }));
}

/**
 * Genera recomendaciones de ahorro
 */
export function generateSavingsRecommendations(data: ConsumptionData[], predictions: any[]) {
  const recommendations: { icon: string; title: string; description: string; priority: 'high' | 'medium' | 'low' }[] = [];
  const stats = calculateConsumptionStats(data);
  const peaks = detectPeaks(data);

  // Recomendación basada en picos
  if (peaks.length > 0) {
    recommendations.push({
      icon: '⚡',
      title: 'Picos detectados',
      description: `Se han detectado ${peaks.length} horas con consumo alto. Considera desconectar dispositivos no esenciales durante esas horas.`,
      priority: 'high',
    });
  }

  // Recomendación basada en consumo promedio
  if (stats.average > 4) {
    recommendations.push({
      icon: '💡',
      title: 'Consumo elevado',
      description: 'El consumo promedio es alto. Revisa los dispositivos conectados y considera usar electrodomésticos en horas de menor demanda.',
      priority: 'medium',
    });
  }

  // Recomendación general de ahorro
  recommendations.push({
    icon: '💰',
    title: 'Ahorro potencial',
    description: 'Reducir consumo en horas pico podría ahorrar hasta un 20% en tu factura eléctrica.',
    priority: 'low',
  });

  return recommendations;
}
