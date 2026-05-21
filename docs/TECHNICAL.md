# PowerTrack Technical Documentation

## 1. Project Definition

PowerTrack is a full-stack energy monitoring and prediction system that combines IoT sensing, local data storage, and a web dashboard.

- Objective: monitor electrical consumption, detect peaks, and provide actionable energy-saving recommendations.
- Technical relevance: collects sensor data with ESP32 + ACS712 and processes it with a Next.js dashboard and regression model.
- Social relevance: enables users to improve energy efficiency and reduce electricity costs.
- Applicability: suitable for homes, small offices, and energy efficiency monitoring solutions.

## 2. Required Materials

### Complete materials list
- ESP32 DevKit
- ACS712 5A current sensor
- Jumper wires
- Stable 5V power supply
- Test load (light bulb, resistor, motor)
- USB cable for programming
- Computer with Arduino IDE or PlatformIO
- Local WiFi network

### Availability and cost
- Components are widely available and affordable.
- The design uses low-cost hardware compared to commercial energy monitors.
- The project uses common components that are easy to source.

## 3. Hardware Setup

### Current sensor installation

The ACS712 sensor is installed on the live conductor feeding the load and connected to the ESP32 ADC pin.

- `OUT` → `GPIO 35`
- `GND` → `GND`
- `VCC` → `5V`

### Sensor usage

- The sensor is defined in code as `const int ACS_PIN = 35`.
- It measures current in amperes and provides the analog reading to the ESP32.
- The system converts current to power consumption and tracks usage over time.

## 4. Data Storage

### Database structure

Readings are stored in `data/readings.json` with the following fields:

- `timestamp`: ISO 8601 timestamp
- `sensorId`: sensor identifier (`ACS712_1`)
- `current`: measured current in amps
- `consumption`: calculated consumption in kW

Example:

```json
{
  "timestamp": "2026-05-18T21:00:00Z",
  "sensorId": "ACS712_1",
  "current": 18.5,
  "consumption": 4.25
}
```

### Data flow

- ESP32 sends readings to `POST /api/readings`.
- The backend stores the readings in JSON.
- Frontend retrieves readings from `GET /api/readings`.
- The API architecture is cloud-ready and can be deployed to a Node.js cloud host.

## 5. AI Model Development

### Data preparation

- Historical consumption data is used as the input for model training.
- `lib/mockData.ts` generates and cleans sample data for training and testing.
- The system prepares hourly data with timestamps and consumption values.

### Model selection and training

The project uses a cyclic regression model with these features:
- `intercept`
- `cos(2πh/24)`
- `sin(2πh/24)`
- `cos(4πh/24)`
- `sin(4πh/24)`

This approach captures daily consumption cycles and improves hourly forecast accuracy.

### Validation and tuning

- The model calculates R² using `calculateRSquared()`.
- R² is displayed in the dashboard to indicate prediction quality.
- The model can be tuned by adjusting the feature set and training data.

## 6. User Interface

### Design

- Responsive dashboard with intuitive cards and charts.
- Presents current consumption, average usage, peak load, and forecast values.
- Includes a historical consumption chart and a prediction chart.

### Notifications and alerts

- `PeakAlert` shows consumption warnings and critical peak alerts.
- `Recommendations` provides energy-saving suggestions based on predicted usage.
- The interface updates in real time as new readings are received.

## 7. Testing and Validation

### Functional tests

- Confirm the ESP32 can connect to WiFi and send data.
- Verify the backend receives and stores readings correctly.
- Check that the frontend visualizes readings and predictions accurately.
- Ensure `data/readings.json` contains valid entries.

### Model accuracy

- Validate the model using R² and historical data comparisons.
- Test the model under different load patterns and usage conditions.
- Adjust the model if accuracy is below expectations.

## 8. Documentation

### Technical documentation

- `README.md` gives an overview and usage instructions.
- `docs/ESP32_SETUP.md` provides hardware setup and sensor usage guidance.
- `docs/TECHNICAL.md` explains architecture, data flow, and model design.

### Presentation

- Includes clear architecture descriptions and API examples.
- Provides step-by-step guidance for hardware setup and deployment.

## 9. Application Flow

1. The ESP32 reads current from the ACS712 sensor.
2. It calculates power consumption and formats a JSON payload.
3. It sends the payload to the Next.js backend.
4. The backend stores the data in `data/readings.json`.
5. The frontend fetches readings and generates predictions.

## 10. Future improvements

- Add authentication and improved API security.
- Support multiple sensors and sensor identifiers.
- Use a production-grade cloud database.
- Add advanced anomaly detection and reporting.
