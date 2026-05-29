# ESP32 + ACS712 Integration Guide

## 1. Project Definition

PowerTrack is an energy monitoring system that combines IoT hardware and a web dashboard to measure, store, and predict electrical consumption.

- Objective: detect consumption patterns, hourly peaks, and provide actionable energy-saving recommendations.
- Technical relevance: integrates ESP32 + ACS712 sensor hardware with a Next.js backend and regression-based prediction model.
- Social relevance: helps users reduce electricity bills and lower energy waste in homes or small offices.
- Innovation: combines real-time current sensing with prediction and alerting in a single, accessible platform.

## 2. Required Materials

### Complete materials list
- ESP32 DevKit board 3 for $460 in Amazon
- ACS712 5A current sensor module (current sensor 1) 5 for $200 in Amazon
- Dupont jumper wires
- Stable 5V power supply for the ESP32
- Test load (light bulb, resistor, or small motor)
- USB cable for programming and serial monitoring
- Computer with Arduino IDE or PlatformIO
- Local WiFi network to send data to the dashboard

### Availability and cost
- Components are widely available from electronics stores and online retailers.
- The project uses low-cost hardware and common components.
- The total cost is affordable compared to commercial energy monitoring systems.

## 3. Hardware Setup

### Current sensor 1 connection

The ACS712 sensor (current sensor 1) must be installed on the live conductor feeding the load.

- `OUT` → `GPIO 35` on the ESP32 (ADC input)
- `GND` → `GND`
- `VCC` → `5V`

The conductor should pass through the ACS712 sensor core. Do not connect the live wire directly to the ADC pin.

### ESP32 programming

The ESP32 reads the analog voltage from the ACS712, converts it into current using calibration constants, computes power consumption, and sends the reading to the backend API.

### Sensor 1 usage details

- Sensor pin is configured as `const int ACS_PIN = 35`.
- It reads instantaneous current in amperes.
- The firmware converts the current reading into power consumption in kW.
- The ESP32 sends the payload fields `sensorId`, `current`, `consumption`, and `timestamp` to the backend.

## 4. Data Storage

### Database structure

Each reading includes the following fields:

- `timestamp` (ISO 8601)
- `sensorId` (sensor identifier)
- `current` (A)
- `consumption` (kW)

Example record:

```json
{
  "timestamp": "2026-05-18T21:00:00Z",
  "sensorId": "ACS712_1",
  "current": 18.5,
  "consumption": 4.25
}
```

### Connection and storage

- The ESP32 sends data to `POST /api/readings`.
- The backend stores readings in `data/readings.json`.
- `GET /api/readings` returns stored readings for the frontend.
- The backend and API are cloud-ready, and the same architecture can be deployed to a cloud provider (such as Vercel or any Node.js host).

## 5. Current Sensor Calibration

### Zero-load measurement
Zero-load measurement is the process of determining the baseline output of the ACS712 sensor when no current is flowing through it. Ideally, the sensor outputs a voltage at its midpoint (around 1.65 V for a 5 V system), but in practice this value varies slightly due to noise and manufacturing differences. By measuring this offset with no load connected, the system can establish a reference point that is later subtracted from all readings, ensuring that the calculated current is accurate and not biased by sensor drift.
```cpp
int zeroOffset = analogRead(ACS_PIN);
```

### Known-load measurement
Known load measurement involves testing the system using a device with a predictable and stable current consumption, such as a light bulb or resistor. By comparing the sensor’s measured output with the actual expected current, it is possible to evaluate the accuracy of the system. This step helps verify whether the sensor readings match real-world values and is essential for adjusting calibration parameters to reduce measurement error.
```cpp
int oneAmpValue = analogRead(ACS_PIN);
```

### Calibration constants
Calibration constants are values used to convert the raw analog readings from the ACS712 into accurate current measurements. The two main constants are the offset (zero-load voltage) and the sensitivity (volts per ampere). The offset corrects for the sensor’s baseline output, while the sensitivity determines how much the voltage changes per unit of current. These constants may need to be adjusted experimentally to match real conditions, ensuring that the system provides reliable and precise measurements over time.
```cpp
float calibrateOffset() {
  float sum = 0;

  Serial.println("Calibrating... Make sure NO load is connected!");

  delay(3000); // time for you to disconnect load

  for (int i = 0; i < 2000; i++) {
    float adc = analogRead(pin);
    float voltage = adc * (Config::VREF / Config::ADC_MAX);
    sum += voltage;
    delay(2);
  }

  float offset = sum / 2000.0;

  Serial.print("Detected OFFSET: ");
  Serial.println(offset, 4);

  return offset;
}
```

Adjust `OFFSET` and `SENSITIVITY` if measured current values differ from the known load.

```c
#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>

// ------------------ Config Class ------------------
class Config {
public:
  static constexpr const char* SSID = "YOUR_WIFI";
  static constexpr const char* PASSWORD = "YOUR_PASSWORD";
  static constexpr const char* SERVER = "http://YOUR_SERVER_IP:3000/api/readings";

  static constexpr int ACS_PIN = 35;
  static constexpr float VREF = 3.3;
  static constexpr float ADC_MAX = 4095.0;

  static constexpr float VOLTAGE = 127.0;
};

// ------------------ Sensor Class ------------------
class ACS712 {
private:
  float offset;
  float sensitivity;
  int pin;
  int samples;

public:
  ACS712(int pin, float offset, float sensitivity, int samples = 1000)
    : pin(pin), offset(offset), sensitivity(sensitivity), samples(samples) {}

  float readCurrent() {
    float sum = 0;

    for (int i = 0; i < samples; i++) {
      float adc = analogRead(pin);
      float voltage = adc * (Config::VREF / Config::ADC_MAX);
      float current = (voltage - offset) / sensitivity;

      sum += current * current;
      delayMicroseconds(200);
    }

    return sqrt(sum / samples);
  }
};

// ------------------ Sensor Instance ------------------
ACS712 sensor(Config::ACS_PIN, 1.65, 0.185);

// ------------------ ID Counter ------------------
int readingCounter = 1;

// ------------------ Time Functions ------------------
String getISOTime() {
  time_t now = time(nullptr);
  struct tm* timeinfo = gmtime(&now);

  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", timeinfo);
  return String(buffer);
}

// ------------------ Network Functions ------------------
void connectWiFi() {
  WiFi.begin(Config::SSID, Config::PASSWORD);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");
}

void setupTime() {
  configTime(0, 0, "pool.ntp.org");

  Serial.print("Syncing time");
  while (time(nullptr) < 100000) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nTime synced!");
}

// ------------------ Send Data ------------------
void sendReading(float current, float power) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(Config::SERVER);
  http.addHeader("Content-Type", "application/json");

  String id = "r-" + String(readingCounter++);
  String timestamp = getISOTime();

  String json = "{";
  json += "\"id\":\"" + id + "\",";
  json += "\"timestamp\":\"" + timestamp + "\",";
  json += "\"consumption\":" + String(power, 3) + ",";
  json += "\"current\":" + String(current, 3);
  json += "}";

  Serial.println("Sending JSON:");
  Serial.println(json);

  int response = http.POST(json);

  Serial.print("HTTP Response: ");
  Serial.println(response);

  http.end();
}

// ------------------ Arduino Setup ------------------
void setup() {
  Serial.begin(115200);

  connectWiFi();
  setupTime();
}

// ------------------ Arduino Loop ------------------
void loop() {
  float current = sensor.readCurrent();
  float power = (current * Config::VOLTAGE) / 1000.0;

  Serial.print("Current: ");
  Serial.print(current);
  Serial.print(" A | Power: ");
  Serial.print(power);
  Serial.println(" kW");

  sendReading(current, power);

  delay(5000);
}
```
## 6. Testing and Validation

- Verify the ESP32 connects successfully to WiFi.
- Confirm readings are sent successfully to the backend API.
- Check `data/readings.json` for valid stored records.
- Run `npm run dev` and open the dashboard in the browser.
- Validate that the historical chart and prediction chart update with received data.
- Confirm the peak alert and recommendation components render correctly.

## 7. Dashboard Usage

- The dashboard displays current consumption, 24h average, daily peak, and 1h prediction.
- It helps detect energy usage peaks and provides actionable recommendations.
- Sensor 1 data appears in recent readings and storage records.

## 8. Security Notes

- Do not expose the Next.js dashboard or API to the open internet without proper protection.
- Use HTTPS in production deployments.
- Protect WiFi credentials and avoid hard-coding them in firmware.

## 9. Resources

- [ACS712 Datasheet](https://www.allegromicro.com/en/products/sense/current-sensor-ics/zero-to-fifty-amp-integrated-conductor-sensor-ics/acs712)
- [ESP32 Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [Arduino IDE Guide](https://docs.arduino.cc/software/ide-v2/tutorials/getting-started)
