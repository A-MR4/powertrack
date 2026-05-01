// Implementación de Regresión Lineal Simple para predicción de consumo
export interface ConsumptionData {
  time: number; // Hora del día (0-23)
  consumption: number; // Consumo en valores relativos
}

export interface RegressionModel {
  slope: number;
  intercept: number;
}

/**
 * Calcula el modelo de regresión lineal (y = mx + b)
 * @param data - Array de datos con hora y consumo
 * @returns Objeto con pendiente (slope) e intersección (intercept)
 */
export function calculateLinearRegression(data: ConsumptionData[]): RegressionModel {
  const n = data.length;
  if (n === 0) throw new Error("No data provided");

  // Calcular sumas necesarias
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  data.forEach((point) => {
    sumX += point.time;
    sumY += point.consumption;
    sumXY += point.time * point.consumption;
    sumX2 += point.time * point.time;
  });

  // Aplicar fórmulas de mínimos cuadrados
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

/**
 * Predice el consumo para una hora específica usando el modelo
 * @param model - Modelo de regresión
 * @param hour - Hora para predecir (0-23)
 * @returns Predicción de consumo
 */
export function predictConsumption(model: RegressionModel, hour: number): number {
  const prediction = model.slope * hour + model.intercept;
  return Math.max(0, prediction); // Asegurar que no sea negativo
}

/**
 * Calcula el coeficiente de determinación (R²)
 * @param data - Datos de entrenamiento
 * @param model - Modelo de regresión
 * @returns Valor de R² entre 0 y 1
 */
export function calculateRSquared(data: ConsumptionData[], model: RegressionModel): number {
  const meanY = data.reduce((acc, point) => acc + point.consumption, 0) / data.length;
  
  let ssRes = 0;
  let ssTot = 0;

  data.forEach((point) => {
    const predicted = predictConsumption(model, point.time);
    ssRes += Math.pow(point.consumption - predicted, 2);
    ssTot += Math.pow(point.consumption - meanY, 2);
  });

  return 1 - ssRes / (ssTot || 1);
}

/**
 * Genera predicciones para las próximas 24 horas
 * @param model - Modelo de regresión
 * @param currentHour - Hora actual (0-23)
 * @returns Array con predicciones para las próximas 24 horas
 */
export function generateHourlyPredictions(model: RegressionModel, currentHour: number) {
  const predictions = [];
  
  for (let i = 0; i < 24; i++) {
    const hour = (currentHour + i) % 24;
    const consumption = predictConsumption(model, hour);
    predictions.push({
      hour,
      consumption: Math.round(consumption * 100) / 100,
      timestamp: new Date(new Date().setHours(hour, 0, 0, 0)),
    });
  }
  
  return predictions;
}
