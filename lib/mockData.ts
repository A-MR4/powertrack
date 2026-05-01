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
    4.5,  // 7h
    5.2,  // 8h  - Pico mañana
    4.8,  // 9h
    3.9,  // 10h
    3.5,  // 11h
    3.8,  // 12h - Mediodía
    4.1,  // 13h
    3.9,  // 14h
    3.6,  // 15h
    3.4,  // 16h
    3.7,  // 17h
    4.9,  // 18h - Tarde-noche
    5.8,  // 19h
    6.2,  // 20h - Pico noche
    5.5,  // 21h
    4.3,  // 22h
    3.1,  // 23h
  ];

  // Agregar variabilidad realista a los datos
  consumptionPattern.forEach((baseConsumption, hour) => {
    // Agregar ruido aleatorio (±15%)
    const noise = (Math.random() - 0.5) * 0.3 * baseConsumption;
    const consumption = Math.max(0.5, baseConsumption + noise);
    
    data.push({
      time: hour,
      consumption: Math.round(consumption * 100) / 100,
    });
  });

  return data;
}

/**
 * Simula lecturas recientes del sensor (últimas 4 horas)
 */
export function getRecentReadings() {
  const now = new Date();
  const currentHour = now.getHours();
  const readings = [];

  for (let i = 3; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Usar patrón base + ruido
    const basePattern = [
      2.1, 1.8, 1.5, 1.3, 1.4, 1.6, 3.2, 4.5, 5.2, 4.8,
      3.9, 3.5, 3.8, 4.1, 3.9, 3.6, 3.4, 3.7, 4.9, 5.8,
      6.2, 5.5, 4.3, 3.1
    ];
    
    const baseConsumption = basePattern[hour] || 3.5;
    const noise = (Math.random() - 0.5) * 0.3 * baseConsumption;
    const consumption = Math.max(0.5, baseConsumption + noise);

    readings.push({
      time: time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      consumption: Math.round(consumption * 100) / 100,
      timestamp: time,
    });
  }

  return readings;
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
  const recommendations = [];
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
