# PowerTrack - Índice de Proyecto

## Resumen Ejecutivo

**PowerTrack** es una aplicación web de **predicción de consumo eléctrico** que combina:
- 🔌 **Hardware IoT** (ESP32 + ACS712)
- 🤖 **Machine Learning** (Regresión Lineal)
- 💻 **Dashboard Interactivo** (Next.js + React)

**Propósito**: Ayudar a usuarios a entender, monitorear y reducir su consumo eléctrico mediante predicciones inteligentes.

---

## Estructura del Proyecto

```
powertrack/
│
├── app/                          # Aplicación Next.js (App Router)
│   ├── page.tsx                  # Dashboard principal
│   ├── layout.tsx                # Layout global
│   ├── globals.css               # Estilos base
│   └── api/                      # API routes (futuro)
│
├── components/                   # Componentes React reutilizables
│   ├── ConsumptionChart.tsx      # Gráfico histórico 24h
│   ├── PredictionChart.tsx       # Gráfico de predicciones
│   ├── StatCard.tsx              # Tarjetas de estadísticas
│   ├── PeakAlert.tsx             # Alertas de picos
│   ├── RecentReadings.tsx        # Lecturas recientes
│   └── ModelInfo.tsx             # Info del modelo ML
│
├── lib/                          # Lógica y utilidades
│   ├── linearRegression.ts       # Algoritmo ML (core)
│   └── mockData.ts               # Generador de datos demo
│
├── docs/                         # Documentación
│   ├── ESP32_SETUP.md            # Guía hardware
│   ├── TECHNICAL.md              # Documentación técnica
│   └── INDEX.md                  # Este archivo
│
├── public/                       # Activos estáticos
│   └── [placeholder]
│
├── package.json                  # Dependencias del proyecto
├── tsconfig.json                 # Configuración TypeScript
├── next.config.ts                # Configuración Next.js
├── tailwind.config.js            # Configuración Tailwind CSS
├── README.md                     # Documentación principal
└── .gitignore                    # Archivos ignorados por Git
```

---

## Quick Start

### Instalación
```bash
# Clonar repositorio (o descargar ZIP)
cd powertrack

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build para Producción
```bash
npm run build
npm start
```

---

## Componentes Principales

### 1. **ConsumptionChart** 📊
- **Archivo**: `components/ConsumptionChart.tsx`
- **Función**: Visualizar consumo histórico de 24 horas
- **Props**: `data: ConsumptionData[]`, `title?: string`
- **Output**: Gráfico de líneas interactivo

### 2. **PredictionChart** 🔮
- **Archivo**: `components/PredictionChart.tsx`
- **Función**: Mostrar predicciones de próximas 12 horas
- **Props**: `predictions`, `historicalConsumption?`
- **Output**: Gráfico combinado (barras + línea)

### 3. **StatCard / StatsGrid** 📈
- **Archivo**: `components/StatCard.tsx`
- **Funciones**:
  - Consumo Actual
  - Promedio 24h
  - Pico del día
  - Predicción (1h)
- **Props**: Estadísticas, opcional R² de precisión

### 4. **PeakAlert & Recommendations** ⚠️
- **Archivo**: `components/PeakAlert.tsx`
- **Funciones**:
  - Detectar y alertar picos
  - Mostrar recomendaciones de ahorro
  - Codificadas por prioridad (rojo/amarillo/azul)

### 5. **RecentReadings** 📋
- **Archivo**: `components/RecentReadings.tsx`
- **Función**: Mostrar últimas 4 lecturas
- **Extra**: Indicador de tendencia (↑ / ↓)

### 6. **ModelInfo** 🧠
- **Archivo**: `components/ModelInfo.tsx`
- **Función**: Detalles técnicos del modelo ML
- **Muestra**: Fórmula, R², Pendiente, Muestras

---

## 🔧 Módulos de Lógica

### linearRegression.ts 🤖
**Funciones principales:**

```typescript
calculateLinearRegression(data)    // Calcular modelo (m, b)
predictConsumption(model, hour)    // Predecir consumo
calculateRSquared(data, model)     // Precisión
generateHourlyPredictions(model)   // Predicciones 24h
```

**Maths:**
- Fórmula: `y = mx + b`
- Método: Mínimos cuadrados
- R²: Coeficiente de determinación

### mockData.ts 📊
**Funciones principales:**

```typescript
generateMockConsumptionData()       // Datos históricos realistas
getRecentReadings()                // Últimas 4 horas
calculateConsumptionStats()        // Media, Max, Min, StdDev
detectPeaks()                      // Horas con alto consumo
generateSavingsRecommendations()   // Sugerencias de ahorro
```

**Patrón de consumo:**
```
Madrugada (00-06h): Mín 1-2 kW
Mañana (06-10h):    Máx 4-5 kW
Tarde (12-17h):     Med 3-4 kW
Noche (18-23h):     Máx 5-6 kW
```

---

## 📊 Flujo de Datos

### 1️⃣ Inicialización (On Mount)
```
Generar Mock Data (24h)
        ↓
Calcular Regresión Lineal
        ↓
Generar Predicciones
        ↓
Detectar Picos
        ↓
Generar Recomendaciones
        ↓
Renderizar Dashboard
```

### 2️⃣ En Tiempo Real (Futuro)
```
Sensor (ACS712) → ESP32 → WiFi → API Backend → Database
                                        ↓
                          Actualizar Dashboard en Vivo
```

---

## 🎨 Diseño Visual

### Paleta de Colores
| Elemento | Color | Hex |
|----------|-------|-----|
| Header | Azul gradiente | #3B82F6 - #1E40AF |
| Cards | Blanco | #FFFFFF |
| Alerta Crítica | Rojo | #EF4444 |
| Alerta Advertencia | Amarillo | #FBBF24 |
| Info | Azul | #3B82F6 |
| Éxito | Verde | #10B981 |

### Componentes Visuales
- **Gráficos**: Recharts (LineChart, ComposedChart, BarChart)
- **Grid**: Tailwind CSS Grid (responsive)
- **Iconos**: SVG nativos (sin dependencias)
- **Animaciones**: CSS Tailwind (hover, transitions)

---

## 🧪 Datos Demo

### Consumo Simulado (24 horas)
```
00:00 - 2.1 kW
06:00 - 3.2 kW ↑ comienza actividad
08:00 - 5.2 kW ↑ PICO (mañana)
12:00 - 3.8 kW ↓ moderado
18:00 - 4.9 kW ↑ comienza noche
20:00 - 6.2 kW ↑ PICO (noche)
23:00 - 3.1 kW ↓ cierre
```

### Variabilidad
- Ruido aleatorio: ±15% por hora
- Representa: electrodomésticos irregulares

---

## 🔌 Integración Hardware (ESP32)

### Hardware Requerido
- ESP32 DevKit WiFi
- Sensor ACS712 (5A)
- Fuente 5V

### Conexión
```
ACS712 OUT → ESP32 GPIO 35 (ADC)
ACS712 GND → ESP32 GND
ACS712 VCC → ESP32 5V
```

### Código ESP32
Ver en: `docs/ESP32_SETUP.md`
- Lectura de sensor
- Calibración
- Envío por WiFi
- Troubleshooting

---

## 📚 Documentación

| Archivo | Contenido |
|---------|-----------|
| **README.md** | Descripción general + instalación |
| **docs/TECHNICAL.md** | Arquitectura, API, ejemplos |
| **docs/ESP32_SETUP.md** | Hardware + firmware + calibración |
| **docs/INDEX.md** | Este archivo (navegación) |

---

## 🎓 Conceptos Educativos

### 1. Regresión Lineal
- **Qué es**: Encontrar la mejor línea que representa datos
- **Método**: Mínimos cuadrados
- **Uso**: Predicción basada en tendencias históricas

### 2. Series Temporales
- **Concepto**: Datos ordenados por tiempo
- **Análisis**: Patrones horarios, tendencias
- **Predicción**: Extrapolar hacia el futuro

### 3. Sensor ACS712
- **Función**: Medir corriente sin contacto (AC/DC)
- **Salida**: Voltaje proporcional a corriente (0.185V/A)
- **Calibración**: Necesaria para precisión

### 4. IoT + IA
- **Integration**: Sensores → Procesamiento → Predicción
- **Aplicación**: Decisiones automáticas basadas en datos
- **Real-world**: Fábricas, hogares, ciudades inteligentes

---

## 🌟 Features Actuales

✅ Dashboard interactivo  
✅ Gráficos de consumo histórico  
✅ Predicciones usando regresión lineal  
✅ Detección de picos de consumo  
✅ Recomendaciones de ahorro  
✅ Lecturas recientes (trend)  
✅ Info técnica del modelo  
✅ Datos simulados realistas  
✅ Responsive design (mobile-first)  
✅ Documentación completa  

---

## 🚧 Features En Desarrollo

🔲 Base de datos (PostgreSQL)  
🔲 API REST completa  
🔲 Integración ESP32 real  
🔲 Autenticación usuario  
🔲 Multi-dispositivo  
🔲 Alertas email/SMS  
🔲 Exportar PDF  

---

## 📈 Mejoras Futuras

### Corto Plazo (1-2 semanas)
- Base de datos para histórico
- API completa
- Sistema de usuarios

### Mediano Plazo (1 mes)
- Modelos avanzados (LSTM, Prophet)
- Detección de anomalías
- Reportes automáticos

### Largo Plazo (2-3 meses)
- Deep Learning
- Optimización de costos
- Integración con proveedores

---

## 🔗 Enlaces Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [ACS712 Datasheet](https://www.allegromicro.com/)
- [ESP32 Docs](https://docs.espressif.com/)

---

## 📞 Soporte

Para dudas o problemas:
1. Ver documentación en `docs/`
2. Revisar función específica en componentes
3. Consultar ejemplos en `lib/mockData.ts`

---

## 📄 Licencia

MIT License - Libre para usar y modificar

---

**Última actualización**: Abril 2026  
**Versión**: 1.0  
**Estado**: Beta ✅  

