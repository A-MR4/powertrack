# ESP32 + ACS712 Integration Guide

## Required Hardware

### Main Components
- **ESP32 DevKit** (WiFi 2.4/5GHz)
- **ACS712 5A current sensor**
- **5V power supply**
- **USB cable** for programming and monitoring

### Wiring

```
ACS712          ESP32
──────────────────────
OUT      ────→  GPIO 35 (ADC)
GND      ────→  GND
+5V      ────→  5V
```

## Firmware Requirements

- Arduino IDE 2.0+
- ESP32 board package installed
- WiFi SSID and password

## Example ESP32 Sketch

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
const char* serverUrl = "http://localhost:3000/api/readings";

const int ACS_PIN = 35;
const float SENSITIVITY = 0.186;
const float OFFSET = 2500;

float currentA = 0;
float powerW = 0;
unsigned long lastReadTime = 0;

void setup() {
  Serial.begin(115200);
  delay(100);
  connectToWiFi();
}

void loop() {
  if (millis() - lastReadTime >= 1000) {
    readSensor();
    lastReadTime = millis();
  }

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
    Serial.println("WiFi connected");
  } else {
    Serial.println("WiFi connection failed");
  }
}

void readSensor() {
  int rawValue = analogRead(ACS_PIN);
  float voltage = (rawValue * 3300.0) / 4095.0;
  float sensorVoltage = voltage - OFFSET;
  currentA = sensorVoltage / SENSITIVITY;
  powerW = currentA * 230.0;

  if (powerW < 0) powerW = 0;

  Serial.print("Raw: ");
  Serial.print(rawValue);
  Serial.print(" | Voltage: ");
  Serial.print(voltage);
  Serial.print(" mV | Current: ");
  Serial.print(currentA);
  Serial.print(" A | Power: ");
  Serial.print(powerW);
  Serial.println(" W");
}

void sendToServer() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonData = "{\"consumption\": " + String(powerW / 1000.0) +
                      ", \"current\": " + String(currentA) +
                      ", \"timestamp\": \"" + getTimestamp() + "\"}";

    int httpResponseCode = http.POST(jsonData);
    if (httpResponseCode > 0) {
      Serial.print("Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("HTTP error: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
}

String getTimestamp() {
  return String(millis());
}
```

## Sensor Calibration

### 1. Zero load measurement

```cpp
int zeroOffset = analogRead(ACS_PIN);
```

### 2. Known load measurement

```cpp
int oneAmpValue = analogRead(ACS_PIN);
```

### 3. Adjust constants

```cpp
const float SENSITIVITY = 0.186;
const float OFFSET = 2500;
```

## Troubleshooting

- **Weird values**: Check wiring and sensor power
- **WiFi fails**: Verify SSID/password and signal strength
- **Fluctuating readings**: Use moving-average filtering

### Example moving-average filter

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

## Backend Integration

### API endpoint

Create `app/api/readings/route.ts` with GET and POST support.

### Example request

Send a new reading with CURL:

```bash
curl -X POST http://localhost:3000/api/readings \
  -H "Content-Type: application/json" \
  -d '{"consumption":4.25,"current":18.5,"timestamp":"2026-05-18T21:00:00Z"}'
```

### Example script

Run the sample client script:

```bash
npm run post-reading-example
```

### Example JSON payload

```json
{
  "consumption": 4.25,
  "current": 18.5,
  "timestamp": "2026-05-18T21:00:00Z"
}
```

### ESP32 payload example

```cpp
String jsonData = "{\"consumption\":" + String(powerW / 1000.0) +
                  ",\"current\":" + String(currentA) +
                  ",\"timestamp\":\"" + getTimestamp() + "\"}";
```

## Real-time monitoring

### Serial monitor

- Baud rate: 115200
- Line endings: CR + LF

### Dashboard

- Hourly updates
- 24h historical charts
- Real-time prediction chart

## Security Notes

- Use HTTPS in production
- Encrypt WiFi credentials
- Validate incoming JSON data
- Add device authentication
- Add rate limiting

## Resources

- [ACS712 Datasheet](https://www.allegromicro.com/en/products/sense/current-sensor-ics/zero-to-fifty-amp-integrated-conductor-sensor-ics/acs712)
- [ESP32 Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [Arduino IDE Guide](https://docs.arduino.cc/software/ide-v2/tutorials/getting-started)

