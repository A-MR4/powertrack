# 📡 Guía de Integración ESP32 + ACS712

## Hardware Requerido

### Componentes Principales
- **ESP32 DevKit** (WiFi 2.4/5GHz)
- **Sensor ACS712 5A** (Sensor de corriente no intrusivo)
- **Fuente 5V** (Alimentación del ESP32)
- **Cable USB** (Programación y monitoreo)

### Wiring (Conexión de Pines)

```
ACS712          ESP32
──────────────────────
OUT      ────→  GPIO 35 (ADC)
GND      ────→  GND
+5V      ────→  5V
```

## Software - Código del ESP32

### Requisitos
```
Arduino IDE 2.0+
Librería: ESP32 Board Package
WiFi Credentials: SSID y Password
```

### Sketch Bá sico

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

// Configuración WiFi
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
const char* serverUrl = "http://localhost:3000/api/readings"; // URL backend

// Configuración del sensor
const int ACS_PIN = 35;  // Pin ADC del ESP32
const float SENSITIVITY = 0.186; // 185mV/A para ACS712-5A
const float VREF = 2500;         // Voltaje de referencia (mV)
const float OFFSET = 2500;       // Offset (mitad de VREF)

// Variables globales
float currentA = 0;
float powerW = 0;
unsigned long lastReadTime = 0;

void setup() {
  Serial.begin(115200);
  delay(100);
  
  Serial.println("\n\nPowerTrack - ESP32 IoT Module");
  Serial.println("============================");
  
  // Conectar a WiFi
  connectToWiFi();
}

void loop() {
  // Lectura continua del sensor
  if (millis() - lastReadTime >= 1000) { // Lectura cada segundo
    readSensor();
    lastReadTime = millis();
  }
  
  // Enviar datos cada hora
  if (millis() % 3600000 == 0) {
    sendToServer();
  }
  
  delay(100);
}

void connectToWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Conectado!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("Error: No se pudo conectar a WiFi");
  }
}

void readSensor() {
  // Leer valor analógico
  int rawValue = analogRead(ACS_PIN);
  
  // Convertir a voltaje: (12 bits = 4095)
  float voltage = (rawValue * 3300) / 4095; // Voltaje en mV
  
  // Fórmula de ACS712
  // DC: I = (V - V_offset) / 0.185
  float sensorVoltage = voltage - OFFSET;
  currentA = sensorVoltage / SENSITIVITY;
  
  // Calcular potencia (asumiendo 230V AC estándar)
  // P = V × I (para carga resistiva)
  powerW = currentA * 230;
  
  // Limitar a valores positivos
  if (powerW < 0) powerW = 0;
  
  // Mostrar en monitor serial
  Serial.print("Raw: ");
  Serial.print(rawValue);
  Serial.print(" | Voltaje: ");
  Serial.print(voltage);
  Serial.print("mV | Corriente: ");
  Serial.print(currentA);
  Serial.print("A | Potencia: ");
  Serial.print(powerW);
  Serial.println("W");
}

void sendToServer() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Crear JSON
    String jsonData = "{\"consumption\":" + String(powerW / 1000.0) + 
                     ",\"current\":" + String(currentA) + 
                     ",\"timestamp\":\"" + getTimestamp() + "\"}";
    
    int httpResponseCode = http.POST(jsonData);
    
    if (httpResponseCode > 0) {
      Serial.print("Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error sending data: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  }
}

String getTimestamp() {
  // Simplificado - implementar NTP en producción
  return String(millis());
}
```

## Calibración del Sensor

### Pasos de Calibración

1. **Sin carga (0A)**
   ```cpp
   // Con no hay carga, el sensor debería leer VREF/2
   // Anotar el valor de offset
   int zeroOffset = analogRead(ACS_PIN);
   // Este valor debería ser ~2048 (para 12 bits)
   ```

2. **Con carga conocida**
   ```cpp
   // Conectar una carga de corriente conocida (ej: 1A)
   // Leer el valor y verificar la fórmula
   int oneAmpValue = analogRead(ACS_PIN);
   // Calcular: sensitivity = (1AmpValue - zeroOffset) * 3.3 / 4095
   ```

3. **Ajustar constantes**
   ```cpp
   const float SENSITIVITY = 0.186; // MV/A (ACS712-5A)
   const float OFFSET = 2500; // mV (mitad de 5V)
   ```

## Troubleshooting

### Problema: Valores anómalos
**Solución**: Verificar conexiones, alimentación del sensor

### Problema: No conecta a WiFi
**Solución**: Verificar SSID/Password, rango Ráster

### Problema: Datos fluctuantes
**Solución**: Agregar filtro digital (promedio móvil)

```cpp
const int SAMPLE_SIZE = 10;
float samples[SAMPLE_SIZE];
int sampleIndex = 0;

float getFilteredReading() {
  samples[sampleIndex] = currentA;
  sampleIndex = (sampleIndex + 1) % SAMPLE_SIZE;
  
  float sum = 0;
  for (int i = 0; i < SAMPLE_SIZE; i++) {
    sum += samples[i];
  }
  
  return sum / SAMPLE_SIZE;
}
```

## Implementación Backend

Para recibir datos del ESP32, agregar un endpoint API en Next.js:

```typescript
// app/api/readings/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  
  // Validar datos
  if (!data.consumption || !data.current) {
    return new Response(
      JSON.stringify({ error: 'Invalid data' }),
      { status: 400 }
    );
  }
  
  // Guardar en base de datos (a implementar)
  // await saveReading(data);
  
  return new Response(
    JSON.stringify({ success: true }),
    { status: 200 }
  );
}
```

## Monitoreo en Tiempo Real

### Serial Monitor
```
Velocidad: 115200 baud
Formato: términos de línea NL + CR
```

### Dashboard PowerTrack
- Datos actualizados cada hora
- Gráficos históricos de 24h
- Predicciones en tiempo real

## Seguridad

- [ ] Usar HTTPS en producción
- [ ] Encriptar credenciales WiFi
- [ ] Validar datos en servidor
- [ ] Implementar autenticación de dispositivos
- [ ] Rate limiting

## Recursos Adicionales

- [ACS712 Datasheet](https://www.allegromicro.com/en/products/sense/current-sensor-ics/zero-to-fifty-amp-integrated-conductor-sensor-ics/acs712)
- [ESP32 Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [Arduino IDE Guide](https://docs.arduino.cc/software/ide-v2/tutorials/getting-started)

