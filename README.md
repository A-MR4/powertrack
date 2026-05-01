# ⚡ PowerTrack - Predicción de Consumo Eléctrico con IA

Un sistema inteligente de monitoreo y predicción de consumo eléctrico que utiliza **Regresión Lineal** para analizar patrones de consumo y proporcionar recomendaciones de ahorro energético en tiempo real.

## 🎯 Descripción del Proyecto

PowerTrack es una aplicación web moderna que integra:
- **Sensores IoT** (ACS712 + ESP32) para lectura de corriente
- **Machine Learning** (Regresión Lineal) para predicciones
- **Dashboard interactivo** con visualizaciones en tiempo real

El sistema predice el consumo eléctrico futuro basado en:
- Consumo actual del dispositivo
- Patrones históricos de consumo (24 horas)
- Hora del día

## 📊 Características Principales

### 19️ Dashboard Interactivo
- **Tarjetas de Estadísticas**: Consumo actual, promedio, picos, predicción (1h)
- **Gráficos de Tendencias**: Historial de 24h con línea de predicción
- **Alertas de Picos**: Detección automática de consumo anómalo
- **Recomendaciones Personalizadas**: Estrategias de ahorro energético

### 🤖 Motor de IA (Regresión Lineal)
- Algoritmo: **Mínimos Cuadrados**
- Precisión: **R² dinámico** (adaptable según datos)
- Fórmula: `Consumo = 0.XXX × Hora + b`
- Actualización: Automática cada hora

### 🔌 Integración IoT
- **Sensor**: ACS712 (medición de corriente AC)
- **Controlador**: ESP32 (procesamiento + WiFi)
- **Comunicación**: WiFi 2.4/5GHz
- **Tasa de muestreo**: Lecturas cada 1 hora

### 💡 Análisis de Patrones
- Detección de picos de consumo
- Identificación de franjas horarias críticas
- Análisis de tendencias (aumento/disminución)
- Cálculo de ahorro potencial

## 🏗️ Arquitectura del Sistema

```
Hardware IoT                Backend                    Frontend
┌─────────────┐            ┌──────────┐              ┌─────────┐
│   ACS712    │            │ Next.js  │              │ React 19│
│   Sensor    │ ──WiFi──→  │ + API    │ ──JSON────→ │ + Chart │
│             │            │ + ML     │              │ Library │
│   ESP32     │            │ (RL)     │              │         │
└─────────────┘            └──────────┘              └─────────┘
```

## 📈 Algoritmo de Predicción

### Regresión Lineal Simple
```
y = mx + b

Donde:
- y = Consumo predicho (kW)
- x = Hora del día (0-23)
- m = Pendiente (cambio por hora)
- b = Intersección (consumo base)
```

### Cálculo de Precisión (R²)
```
R² = 1 - (SS_res / SS_tot)

Coeficiente de determinación entre 0 y 1:
- 0.9-1.0: Excelente precisión
- 0.75-0.9: Buena precisión
- 0.5-0.75: Precisión aceptable
- <0.5: Revisar datos
```

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+ (incluido npm)
- Conexión a WiFi (para ESP32)

### Instalación
```bash
# 1. Clonar o descargar el proyecto
cd powertrack

# 2. Instalar dependencias
npm install

# 3. Ejecutar servidor de desarrollo
npm run dev

# 4. Abrir en navegador
# http://localhost:3000
```

### Build para Producción
```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
powertrack/
├── app/
│   ├── page.tsx              # Página principal (Dashboard)
│   ├── layout.tsx            # Layout global
│   └── globals.css           # Estilos globales
├── components/
│   ├── ConsumptionChart.tsx   # Gráfico histórico
│   ├── PredictionChart.tsx    # Gráfico de predicciones
│   ├── StatCard.tsx           # Tarjetas de estadísticas
│   ├── PeakAlert.tsx          # Alertas de picos
│   ├── RecentReadings.tsx     # Lecturas recientes
│   └── ModelInfo.tsx          # Info del modelo IA
├── lib/
│   ├── linearRegression.ts    # Algoritmo de regresión
│   └── mockData.ts            # Generador de datos simulados
├── public/                     # Activos estáticos
├── package.json               # Dependencias
├── tsconfig.json              # Configuración TypeScript
├── next.config.ts             # Configuración Next.js
├── tailwind.config.js        # Configuración Tailwind CSS
└── README.md                  # Este archivo
```

## 🔧 Tecnologías Utilizadas

### Frontend
- **Next.js 16** - Framework React moderno con SSR
- **React 19** - Librería de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos utilitarios
- **Recharts** - Gráficos interactivos
- **Lucide React** - Iconografía

### Machine Learning
- **Regresión Lineal** (Mínimos Cuadrados)
- **Análisis Estadístico** (Media, Desv. Est., R²)

### IoT (Hardware - Código de Referencia)
```cpp
// Ejemplo de código para ESP32:
#include <WiFi.h>
const int ACS_PIN = 35;  // Entrada analógica

void setup() {
  Serial.begin(115200);
  WiFi.begin(SSID, PASSWORD);
}

void loop() {
  int rawValue = analogRead(ACS_PIN);
  // Calibración: ACS712 mide +/- 30A (5V = 30A)
  float voltage = (rawValue * 3.3) / 4095;
  float currentA = (voltage - 2.5) / 0.066; // 66mV por A
  float powerW = currentA * 230;  // 230V estándar
  
  // Enviar a servidor cada hora
  // ...
}
```

## 📊 Datos Simulados

Para demostración, la aplicación genera datos realistas con patrón típico:

```
Consumo por Hora:
- 00-06h: Mínimo (1-2 kW)  - Madrugada
- 06-10h: Alto (4-5 kW)    - Mañana
- 12-17h: Moderado (3-4 kW) - Tarde
- 18-23h: Alto (5-6 kW)    - Noche + variabilidad
```

## 💡 Casos de Uso

### 1. **Monitoreo Doméstico**
Seguimiento de consumo de electrodomésticos principales
- Refrigerador
- Aire acondicionado
- Calefactor

### 2. **Eficiencia Empresarial**
Optimización de costos en instalaciones comerciales
- Oficinas
- Tiendas retail
- Centros de datos

### 3. **Automatización del Hogar**
Integración con sistemas inteligentes
- Apagar dispositivos en horas pico
- Ajustar temperatura automáticamente

## 🎓 Aspectos Educativos

Este proyecto es ideal para demostrar:
- ✅ Aplicación práctica de regresión lineal
- ✅ Integración de sensores IoT con IA
- ✅ Desarrollo full-stack (Frontend + Backend)
- ✅ Análisis de datos en tiempo real
- ✅ UX/UI para dashboards analíticos

## 🔐 Consideraciones de Seguridad

- [ ] Autenticación OAuth2 (producción)
- [ ] Encriptación HTTPS en conexión ESP32
- [ ] Validación de datos del sensor
- [ ] Rate limiting en API
- [ ] Almacenamiento seguro de históricos

## 📈 Mejoras Futuras

- [ ] **MLModelos Avanzados**: LSTM, Prophet, XGBoost
- [ ] **Multiusuario**: Gestión de múltiples dispositivos
- [ ] **Almacenamiento**: Base de datos (PostgreSQL/MongoDB)
- [ ] **Alertas**: Notificaciones por email/SMS
- [ ] **Exportación**: Reportes PDF descargables
- [ ] **API REST**: Integración con terceros

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores:
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a rama (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 Licencia

Este proyecto es de código abierto bajo licencia MIT.

## 📧 Contacto

Para preguntas o sugerencias, contacta al desarrollador del proyecto.

---

<div align="center">

**PowerTrack** ⚡ - *Inteligencia Artificial aplicada a la eficiencia energética*

Desarrollado con ❤️ usando Next.js y Machine Learning

</div>
