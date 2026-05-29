// Implementación de un modelo cíclico diario para predicción de consumo
export interface ConsumptionData {
  time: number; // Hora del día (0-23)
  consumption: number; // Consumo en valores relativos
}

export interface RegressionModel {
  intercept: number;
  cos1: number;
  sin1: number;
  cos2: number;
  sin2: number;
}

const TWO_PI = Math.PI * 2;

function solveLinearSystem(matrix: number[][], vector: number[]): number[] {
  const n = matrix.length;
  const A = matrix.map((row) => row.slice());
  const b = vector.slice();

  for (let i = 0; i < n; i += 1) {
    let pivotRow = i;
    for (let j = i + 1; j < n; j += 1) {
      if (Math.abs(A[j][i]) > Math.abs(A[pivotRow][i])) {
        pivotRow = j;
      }
    }

    if (pivotRow !== i) {
      [A[i], A[pivotRow]] = [A[pivotRow], A[i]];
      [b[i], b[pivotRow]] = [b[pivotRow], b[i]];
    }

    const pivot = A[i][i] || 1e-12;
    for (let j = i; j < n; j += 1) {
      A[i][j] /= pivot;
    }
    b[i] /= pivot;

    for (let j = 0; j < n; j += 1) {
      if (j === i) continue;
      const factor = A[j][i];
      for (let k = i; k < n; k += 1) {
        A[j][k] -= factor * A[i][k];
      }
      b[j] -= factor * b[i];
    }
  }

  return b;
}

function createFeatureRow(hour: number) {
  const angle1 = (TWO_PI * hour) / 24;
  const angle2 = (TWO_PI * 2 * hour) / 24;

  return [
    1,
    Math.cos(angle1),
    Math.sin(angle1),
    Math.cos(angle2),
    Math.sin(angle2),
  ];
}

/**
 * Calcula un modelo cíclico diario usando armónicos sinusoidales
 * @param data - Array de datos con hora y consumo
 * @returns Modelo con coeficientes de la serie de Fourier
 */
export function calculateLinearRegression(data: ConsumptionData[]): RegressionModel {
  const n = data.length;
  if (n === 0) throw new Error('No data provided');

  const featureRows = data.map((point) => createFeatureRow(point.time));
  const dimension = featureRows[0].length;

  const xtx = Array.from({ length: dimension }, () => Array(dimension).fill(0));
  const xty = Array(dimension).fill(0);

  data.forEach((point, index) => {
    const row = featureRows[index];

    for (let i = 0; i < dimension; i += 1) {
      for (let j = i; j < dimension; j += 1) {
        xtx[i][j] += row[i] * row[j];
      }
      xty[i] += row[i] * point.consumption;
    }
  });

  for (let i = 0; i < dimension; i += 1) {
    for (let j = 0; j < i; j += 1) {
      xtx[i][j] = xtx[j][i];
    }
  }

  const coefficients = solveLinearSystem(xtx, xty);

  return {
    intercept: coefficients[0],
    cos1: coefficients[1],
    sin1: coefficients[2],
    cos2: coefficients[3],
    sin2: coefficients[4],
  };
}

/**
 * Predice el consumo para una hora específica usando el modelo cíclico
 * @param model - Modelo de regresión
 * @param hour - Hora para predecir (0-23)
 * @returns Predicción de consumo
 */
export function predictConsumption(model: RegressionModel, hour: number): number {
  const angle1 = (TWO_PI * hour) / 24;
  const angle2 = (TWO_PI * 2 * hour) / 24;

  const prediction =
    model.intercept +
    model.cos1 * Math.cos(angle1) +
    model.sin1 * Math.sin(angle1) +
    model.cos2 * Math.cos(angle2) +
    model.sin2 * Math.sin(angle2);

  return Math.max(0, prediction);
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

  return 1 - ssRes / (ssTot || 1e-12);
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
