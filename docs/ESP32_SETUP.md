# ESP32 + ACS712 Integration Guide

## 1. Project Definition

PowerTrack is an energy monitoring system that combines IoT hardware and a web dashboard to measure, store, and predict electrical consumption.

- Objective: detect consumption patterns, hourly peaks, and provide actionable energy-saving recommendations.
- Technical relevance: integrates ESP32 + ACS712 sensor hardware with a Next.js backend and regression-based prediction model.
- Social relevance: helps users reduce electricity bills and lower energy waste in homes or small offices.
- Innovation: combines real-time current sensing with prediction and alerting in a single, accessible platform.

## 2. Required Materials

### Complete materials list
- ESP32 DevKit board
- ACS712 5A current sensor module (current sensor 1)
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

```cpp
int zeroOffset = analogRead(ACS_PIN);
```

### Known-load measurement

```cpp
int oneAmpValue = analogRead(ACS_PIN);
```

### Calibration constants

```cpp
const float SENSITIVITY = 0.186;
const float OFFSET = 2500.0;
```

Adjust `OFFSET` and `SENSITIVITY` if measured current values differ from the known load.

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
