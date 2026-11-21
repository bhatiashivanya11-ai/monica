import { ArduinoProjectItem } from '../types/platform';
import {
  ARDUINO_IMAGE,
  HERO_LAB_IMAGE,
  ROVER_IMAGE,
  SMART_DUSTBIN_IMAGE,
  SMART_HOME_IMAGE,
} from './roboLearnData';

export const ARDUINO_PROJECTS: ArduinoProjectItem[] = [
  {
    id: 'ard-led-blinking',
    title: 'LED Blinking',
    category: 'LED & Timing',
    difficulty: 'Beginner',
    estimatedTime: '25 mins',
    summary:
      'Build your very first Arduino breadboard circuit by wiring a 5mm LED with a 220-ohm protective resistor and blinking it at a steady 1-second rhythm.',
    imageUrl: ARDUINO_IMAGE,
    imageAlt: 'Arduino Uno breadboard circuit with wired LED and resistor',
    components: [
      'Arduino Uno Board & USB Cable',
      '1x 5mm Red or Green LED',
      '1x 220-ohm Resistor (Red-Red-Brown)',
      '1x Mini Breadboard',
      '2x Male-to-Male Jumper Wires',
    ],
    circuitConnections: [
      {
        component: 'LED Anode (+ Long Leg)',
        signalPin: 'Anode (+)',
        controllerPin: 'D13 (via 220Ω Resistor)',
        notes: 'Resistor limits current to protect both the LED and Arduino pin.',
      },
      {
        component: 'LED Cathode (- Short Leg)',
        signalPin: 'Cathode (-)',
        controllerPin: 'GND',
        notes: 'Flat edge of the LED housing marks the negative cathode leg.',
      },
    ],
    arduinoCode: `const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH); // Turn LED ON (5V)
  delay(1000);                 // Wait 1000 ms (1 second)
  digitalWrite(LED_PIN, LOW);  // Turn LED OFF (0V)
  delay(1000);                 // Wait 1000 ms (1 second)
}`,
    codeExplanation: [
      '`const int LED_PIN = 13;` creates a constant name for digital pin 13 so your code is easy to read.',
      '`pinMode(LED_PIN, OUTPUT);` inside `setup()` tells the Arduino to send electrical voltage out through pin 13.',
      '`digitalWrite(LED_PIN, HIGH);` raises pin 13 to 5V, lighting up the LED.',
      '`delay(1000);` pauses the microcontroller for 1,000 milliseconds (1 second) before switching to `LOW` (0V).',
    ],
    steps: [
      'Unplug the USB cable from your Arduino before placing any components onto the breadboard.',
      'Insert the LED into two separate breadboard rows and note which row holds the longer positive (+) leg.',
      'Connect one end of the 220-ohm resistor to the positive LED row and the other end to a jumper wire going to Pin D13.',
      'Wire the shorter negative (-) LED leg to an Arduino GND pin.',
      'Plug in the USB cable, select Arduino Uno in the IDE, and upload the sketch.',
    ],
    troubleshootingTips: [
      {
        issue: 'The onboard L-LED blinks on the Arduino, but my breadboard LED stays off.',
        solution:
          'Gently flip the breadboard LED around—LEDs are polarized and only light when the long leg faces Pin D13.',
      },
      {
        issue: 'Code upload fails with a port error.',
        solution: 'Check Tools > Board (Arduino Uno) and Tools > Port in the Arduino IDE.',
      },
    ],
    safetyInstructions: [
      'Always disconnect the USB cable before moving wires or resistors on the breadboard.',
      'Never connect an LED directly to 5V without a 220-ohm resistor, or it can burn out instantly.',
    ],
  },
  {
    id: 'ard-traffic-light',
    title: 'Traffic Light System',
    category: 'LED & Timing',
    difficulty: 'Beginner',
    estimatedTime: '45 mins',
    summary:
      'Simulate a real street intersection using Red, Yellow, and Green LEDs timed cleanly with Arduino digital outputs and an optional pedestrian crosswalk button.',
    imageUrl: ARDUINO_IMAGE,
    imageAlt: 'Arduino breadboard wired with three traffic light LEDs',
    components: [
      'Arduino Uno Board & USB Cable',
      '3x 5mm LEDs (Red, Yellow, Green)',
      '3x 220-ohm Resistors',
      '1x Solderless Breadboard',
      '4x Male-to-Male Jumper Wires',
    ],
    circuitConnections: [
      {
        component: 'Red LED',
        signalPin: 'Anode (+)',
        controllerPin: 'D10 (via 220Ω Resistor)',
        notes: 'Short leg goes to the shared breadboard GND rail.',
      },
      {
        component: 'Yellow LED',
        signalPin: 'Anode (+)',
        controllerPin: 'D9 (via 220Ω Resistor)',
        notes: 'Lights briefly between Green and Red phases.',
      },
      {
        component: 'Green LED',
        signalPin: 'Anode (+)',
        controllerPin: 'D8 (via 220Ω Resistor)',
        notes: 'Active go signal before yellow warning.',
      },
      {
        component: 'Shared Ground Rail',
        signalPin: 'Blue (-) Rail',
        controllerPin: 'GND',
        notes: 'Connects all three LED cathodes back to Arduino GND.',
      },
    ],
    arduinoCode: `const int RED_PIN = 10;
const int YELLOW_PIN = 9;
const int GREEN_PIN = 8;

void setup() {
  pinMode(RED_PIN, OUTPUT);
  pinMode(YELLOW_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
}

void loop() {
  // Green GO phase (4 seconds)
  digitalWrite(GREEN_PIN, HIGH);
  digitalWrite(YELLOW_PIN, LOW);
  digitalWrite(RED_PIN, LOW);
  delay(4000);

  // Yellow CAUTION phase (1.5 seconds)
  digitalWrite(GREEN_PIN, LOW);
  digitalWrite(YELLOW_PIN, HIGH);
  delay(1500);

  // Red STOP phase (4 seconds)
  digitalWrite(YELLOW_PIN, LOW);
  digitalWrite(RED_PIN, HIGH);
  delay(4000);
}`,
    codeExplanation: [
      'Three integer constants (`RED_PIN`, `YELLOW_PIN`, `GREEN_PIN`) assign each traffic color to its own digital pin.',
      '`setup()` configures all three pins as `OUTPUT` so the Arduino can control all three lights.',
      'Each stage in `loop()` turns exactly one LED `HIGH` while keeping the others `LOW` so two conflicting lights never glow together.',
      'Try adjusting the `delay()` durations to mimic a busy city intersection versus a quiet school crossing.',
    ],
    steps: [
      'Place the Red, Yellow, and Green LEDs in a neat row on the breadboard with every short leg plugged into the blue GND rail.',
      'Add one 220-ohm resistor to each LED long leg across the breadboard center gap.',
      'Wire the resistors to Pins D10 (Red), D9 (Yellow), and D8 (Green).',
      'Run one black jumper wire from the breadboard blue GND rail to the Arduino GND pin.',
      'Upload the code and verify the Green -> Yellow -> Red cycle repeats smoothly.',
    ],
    troubleshootingTips: [
      {
        issue: 'Two LEDs stay dimly lit or never turn off.',
        solution:
          'Verify that you explicitly set the previous color to `LOW` before turning the next color `HIGH`.',
      },
      {
        issue: 'None of the three LEDs light up.',
        solution:
          'Check that the shared blue GND rail on the breadboard actually connects to an Arduino `GND` pin.',
      },
    ],
    safetyInstructions: [
      'Always use one separate 220-ohm resistor per LED rather than sharing a single resistor.',
      'Unplug USB power while rearranging breadboard wires to avoid accidental short circuits.',
    ],
  },
  {
    id: 'ard-ultrasonic-distance',
    title: 'Ultrasonic Distance Measurement',
    category: 'Sensors & Measurement',
    difficulty: 'Beginner',
    estimatedTime: '50 mins',
    summary:
      'Measure real-time distances from 3 cm to 300 cm with an HC-SR04 ultrasonic sensor, print live centimeter readings to the Serial Monitor, and trigger a proximity buzzer.',
    imageUrl: ROVER_IMAGE,
    imageAlt: 'HC-SR04 ultrasonic distance sensor wired with Arduino Uno',
    components: [
      'Arduino Uno Board & USB Cable',
      '1x HC-SR04 Ultrasonic Distance Sensor',
      '1x Active Piezo Buzzer (optional alert)',
      '1x Breadboard & Jumper Wires',
    ],
    circuitConnections: [
      {
        component: 'HC-SR04 Power',
        signalPin: 'VCC / GND',
        controllerPin: '5V / GND',
        notes: 'Sensor operates cleanly on Arduino regulated 5V.',
      },
      {
        component: 'HC-SR04 Trigger',
        signalPin: 'TRIG',
        controllerPin: 'D9',
        notes: 'Receives a 10-microsecond pulse from Arduino to fire sound.',
      },
      {
        component: 'HC-SR04 Echo',
        signalPin: 'ECHO',
        controllerPin: 'D10',
        notes: 'Outputs HIGH pulse whose width equals round-trip travel time.',
      },
      {
        component: 'Piezo Buzzer',
        signalPin: '+ / -',
        controllerPin: 'D6 / GND',
        notes: 'Beeps gently when an object gets closer than 15 cm.',
      },
    ],
    arduinoCode: `const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int BUZZER_PIN = 6;

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  float distanceCm = (duration * 0.0343) / 2.0;

  Serial.print("Distance: ");
  Serial.print(distanceCm);
  Serial.println(" cm");

  digitalWrite(BUZZER_PIN, (distanceCm > 0 && distanceCm < 15.0) ? HIGH : LOW);
  delay(200);
}`,
    codeExplanation: [
      '`Serial.begin(9600);` opens USB communication so you can watch live sensor measurements in the Serial Monitor.',
      'Setting `TRIG_PIN` HIGH for 10 microseconds instructs the HC-SR04 to emit an ultrasonic sound chirp.',
      '`pulseIn(ECHO_PIN, HIGH, 30000)` measures how many microseconds the echo takes to return (with a 30ms timeout).',
      'Multiplying by `0.0343` (speed of sound in cm/µs) and dividing by `2.0` gives one-way distance in centimeters.',
    ],
    steps: [
      'Plug the HC-SR04 sensor along the edge of your breadboard so its two circular transducers face outward.',
      'Wire `VCC` to `5V`, `GND` to `GND`, `TRIG` to `D9`, and `ECHO` to `D10`.',
      'Optionally connect the buzzer positive pin to `D6` and negative pin to `GND`.',
      'Upload the sketch and open Tools > Serial Monitor at 9600 baud.',
      'Hold a book or your hand at 10 cm, 20 cm, and 40 cm and check the accuracy with a ruler.',
    ],
    troubleshootingTips: [
      {
        issue: 'Serial Monitor prints 0.00 cm constantly.',
        solution:
          'Check that TRIG (D9) and ECHO (D10) are not swapped and that VCC is connected to 5V (not 3.3V).',
      },
      {
        issue: 'Readings jump wildly when aiming at a fuzzy sweater or angled wall.',
        solution:
          'Soft fabrics absorb sound and steep angles deflect echoes away—aim at a flat solid notebook first.',
      },
    ],
    safetyInstructions: [
      'Double-check VCC (5V) and GND polarity before powering the HC-SR04 sensor so the chip does not overheat.',
      'Keep piezo buzzers at modest volume and avoid holding them right next to your ear.',
    ],
  },
  {
    id: 'ard-smart-dustbin',
    title: 'Smart Dustbin',
    category: 'Automation & IoT',
    difficulty: 'Intermediate',
    estimatedTime: '90 mins',
    summary:
      'Build a touchless hygienic trash bin that opens its lid automatically with a micro servo motor whenever your hand approaches within 20 cm of an ultrasonic sensor.',
    imageUrl: SMART_DUSTBIN_IMAGE,
    imageAlt: 'Arduino Smart Dustbin prototype with ultrasonic sensor and servo lid',
    components: [
      'Arduino Uno Board & USB / 5V Power Supply',
      '1x HC-SR04 Ultrasonic Sensor',
      '1x SG90 Micro Servo Motor',
      'Cardboard Box or Small Classroom Bin',
      'Jumper Wires & Double-Sided Tape',
    ],
    circuitConnections: [
      {
        component: 'HC-SR04 Ultrasonic Sensor',
        signalPin: 'TRIG / ECHO',
        controllerPin: 'D9 / D10',
        notes: 'Mounted on the front face of the bin pointing outward.',
      },
      {
        component: 'SG90 Servo Signal',
        signalPin: 'Orange / Yellow Wire',
        controllerPin: 'D6 (PWM)',
        notes: 'Controls lid opening angle (0° closed, 95° open).',
      },
      {
        component: 'Servo & Sensor Power',
        signalPin: 'Red (+) / Brown (-)',
        controllerPin: '5V / GND',
        notes: 'Share a solid common GND across Arduino and servo.',
      },
    ],
    arduinoCode: `#include <Servo.h>

Servo lidServo;
const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int SERVO_PIN = 6;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  lidServo.attach(SERVO_PIN);
  lidServo.write(0); // Start closed
}

long readDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 25000);
  if (duration == 0) return 999;
  return (duration * 0.0343) / 2.0;
}

void loop() {
  long dist = readDistanceCm();
  if (dist > 0 && dist <= 20) {
    lidServo.write(95); // Open lid
    delay(3000);        // Keep open 3 seconds
    lidServo.write(0);  // Close lid
    delay(400);
  }
  delay(80);
}`,
    codeExplanation: [
      '`#include <Servo.h>` loads Arduino’s built-in Servo library to generate precise servo angle pulses.',
      '`readDistanceCm()` packages ultrasonic triggering and math into a tidy helper function, returning `999` if no echo arrives.',
      'When `dist <= 20`, `lidServo.write(95)` lifts the lid and pauses `3000` milliseconds before returning smoothly to `0` degrees.',
      'Adding `delay(400)` after closing prevents immediate accidental re-triggering as the lid settles.',
    ],
    steps: [
      'Test the SG90 servo on your desk first before taping or gluing the arm to the dustbin lid.',
      'Wire the HC-SR04 to D9/D10 and the SG90 servo signal wire to D6.',
      'Attach the ultrasonic sensor cleanly to the front wall of the bin facing outward.',
      'Connect a sturdy craft stick or wire push-rod from the servo horn to the hinged lid.',
      'Upload the code and wave your hand 10–15 cm in front of the sensor to watch it open automatically.',
    ],
    troubleshootingTips: [
      {
        issue: 'The Arduino resets or disconnects when the servo lifts the lid.',
        solution:
          'A heavy cardboard lid can pull extra current—reduce lid weight or power the servo from an external 5V battery pack with shared GND.',
      },
      {
        issue: 'The lid tries to push downward into the bin rim when closing.',
        solution:
          'Detach the horn, command `lidServo.write(0)`, and re-attach the horn flat in the closed position.',
      },
    ],
    safetyInstructions: [
      'Keep fingers clear of the servo horn and hinge rod while testing opening and closing angles.',
      'Ask an adult for help if cutting holes in plastic or thick cardboard for the ultrasonic sensor.',
    ],
  },
  {
    id: 'ard-temp-monitoring',
    title: 'Temperature Monitoring',
    category: 'Sensors & Measurement',
    difficulty: 'Intermediate',
    estimatedTime: '60 mins',
    summary:
      'Read ambient room temperature and humidity using a DHT11 digital sensor, log live readings over Serial, and light a warning LED when the room gets too warm.',
    imageUrl: HERO_LAB_IMAGE,
    imageAlt: 'Arduino temperature monitoring circuit on classroom workbench',
    components: [
      'Arduino Uno Board & USB Cable',
      '1x DHT11 Temperature & Humidity Sensor Module',
      '1x Red Alert LED + 220-ohm Resistor',
      '1x Green Normal LED + 220-ohm Resistor',
      'Breadboard & Jumper Wires',
    ],
    circuitConnections: [
      {
        component: 'DHT11 Sensor Module',
        signalPin: 'DATA / OUT',
        controllerPin: 'D2',
        notes: 'Use a 3-pin DHT11 PCB module (includes built-in pull-up resistor).',
      },
      {
        component: 'DHT11 Power',
        signalPin: 'VCC / GND',
        controllerPin: '5V / GND',
        notes: 'Match labeled + and - pins carefully.',
      },
      {
        component: 'Alert & Normal LEDs',
        signalPin: 'Red / Green Anodes',
        controllerPin: 'D7 / D8 (via 220Ω)',
        notes: 'Red glows above 28°C; Green glows during comfortable temperatures.',
      },
    ],
    arduinoCode: `#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

const int RED_ALERT_LED = 7;
const int GREEN_OK_LED = 8;

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(RED_ALERT_LED, OUTPUT);
  pinMode(GREEN_OK_LED, OUTPUT);
}

void loop() {
  delay(2000); // DHT11 updates every ~2 seconds
  float tempC = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(tempC) || isnan(humidity)) {
    Serial.println("Sensor read failed - check DHT11 wiring.");
    return;
  }

  Serial.print("Temp: ");
  Serial.print(tempC);
  Serial.print(" C | Humidity: ");
  Serial.print(humidity);
  Serial.println("%");

  bool tooWarm = tempC >= 28.0;
  digitalWrite(RED_ALERT_LED, tooWarm ? HIGH : LOW);
  digitalWrite(GREEN_OK_LED, tooWarm ? LOW : HIGH);
}`,
    codeExplanation: [
      '`DHT dht(DHTPIN, DHTTYPE);` initializes the DHT sensor library on digital pin 2.',
      '`delay(2000);` waits 2 seconds between readings because the DHT11 hardware refreshes once every 1–2 seconds.',
      '`isnan(tempC)` checks whether a reading failed (`Not-a-Number`) so bad values do not trigger false alarms.',
      '`bool tooWarm = tempC >= 28.0;` switches between the Green OK LED and the Red Alert LED automatically.',
    ],
    steps: [
      'Install the "DHT sensor library" by Adafruit in Arduino IDE Library Manager.',
      'Wire the DHT11 module VCC to 5V, GND to GND, and DATA to Pin D2.',
      'Wire the Red LED (D7) and Green LED (D8) with 220-ohm resistors to GND.',
      'Upload the sketch and open the Serial Monitor to observe live Celsius and humidity readings.',
      'Warm the sensor gently by cupping your hands around it (without touching pins) to watch the Red Alert LED trigger.',
    ],
    troubleshootingTips: [
      {
        issue: 'Serial Monitor says "Sensor read failed".',
        solution:
          'Verify your DHT11 pinout—some modules label Signal as `S` or `DAT` on the left, while others put it in the middle.',
      },
      {
        issue: 'Compilation error: DHT.h: No such file or directory.',
        solution: 'Open Sketch > Include Library > Manage Libraries and install "DHT sensor library".',
      },
    ],
    safetyInstructions: [
      'Never use open flames, lighters, or hot hair dryers to test a plastic DHT11 temperature sensor.',
      'Disconnect USB power before inserting or removing the DHT11 sensor.',
    ],
  },
  {
    id: 'ard-soil-moisture',
    title: 'Soil Moisture Monitoring',
    category: 'Sensors & Measurement',
    difficulty: 'Intermediate',
    estimatedTime: '55 mins',
    summary:
      'Monitor potted classroom plant hydration using an analog soil moisture probe mapped to 0–100%, displaying watering alerts when soil dries below 35%.',
    imageUrl: ARDUINO_IMAGE,
    imageAlt: 'Arduino analog sensor wiring for classroom plant moisture monitoring',
    components: [
      'Arduino Uno Board & USB Cable',
      '1x Soil Moisture Sensor Module (Capacitive or Resistive)',
      '1x Yellow "Water Me" LED + 220-ohm Resistor',
      '1x Green "Hydrated" LED + 220-ohm Resistor',
      'Small Potted Plant & Jumper Wires',
    ],
    circuitConnections: [
      {
        component: 'Soil Moisture Sensor',
        signalPin: 'AOUT (Analog Out)',
        controllerPin: 'A0',
        notes: 'Reads continuous 0–1023 analog moisture levels.',
      },
      {
        component: 'Sensor Power',
        signalPin: 'VCC / GND',
        controllerPin: '5V / GND',
        notes: 'Power from regulated 5V pin.',
      },
      {
        component: 'Status LEDs',
        signalPin: 'Yellow / Green Anodes',
        controllerPin: 'D4 / D5 (via 220Ω)',
        notes: 'Yellow alerts when soil moisture drops below 35%.',
      },
    ],
    arduinoCode: `const int MOISTURE_PIN = A0;
const int DRY_LED = 4;
const int OK_LED = 5;

void setup() {
  Serial.begin(9600);
  pinMode(DRY_LED, OUTPUT);
  pinMode(OK_LED, OUTPUT);
}

void loop() {
  int rawValue = analogRead(MOISTURE_PIN);
  // Typical calibration: 850 (dry air) -> 0%, 350 (wet soil) -> 100%
  int moisturePct = map(rawValue, 850, 350, 0, 100);
  moisturePct = constrain(moisturePct, 0, 100);

  Serial.print("Raw: ");
  Serial.print(rawValue);
  Serial.print(" | Moisture: ");
  Serial.print(moisturePct);
  Serial.println("%");

  if (moisturePct < 35) {
    digitalWrite(DRY_LED, HIGH);
    digitalWrite(OK_LED, LOW);
  } else {
    digitalWrite(DRY_LED, LOW);
    digitalWrite(OK_LED, HIGH);
  }
  delay(1000);
}`,
    codeExplanation: [
      '`analogRead(MOISTURE_PIN)` measures voltage on pin `A0` as an integer from `0` to `1023`.',
      '`map(rawValue, 850, 350, 0, 100)` converts raw sensor numbers into an easy-to-read `0%–100%` hydration scale.',
      '`constrain(moisturePct, 0, 100)` keeps percentages neatly inside `0` to `100` even if soil gets extra dry or soaked.',
      'When `moisturePct < 35`, the Yellow LED turns on as a reminder to water the plant.',
    ],
    steps: [
      'Wire the sensor module `VCC` to `5V`, `GND` to `GND`, and `AOUT` to `A0`.',
      'Wire the Yellow and Green indicator LEDs with 220-ohm resistors on Pins D4 and D5.',
      'Upload the code and check the Serial Monitor while the probe is dry in the air, then gently in damp soil.',
      'Adjust the `850` (dry) and `350` (wet) calibration numbers in `map()` to match your exact sensor.',
      'Place only the waterproof probe tip into the pot—keep the upper electronics board dry.',
    ],
    troubleshootingTips: [
      {
        issue: 'Moisture percentage reads backwards (100% when dry, 0% when wet).',
        solution:
          'Some sensors increase voltage when wet instead of decreasing. Swap `850, 350` in `map()` to `350, 850`.',
      },
      {
        issue: 'Percentage stays stuck at 0% or 100%.',
        solution: 'Read the raw number in Serial Monitor and update the dry/wet calibration bounds.',
      },
    ],
    safetyInstructions: [
      'Keep water away from the Arduino Uno, laptop, and breadboard—only the probe blade should touch damp soil.',
      'Place the Arduino and breadboard on a dry tray beside the plant pot.',
    ],
  },
  {
    id: 'ard-auto-street-light',
    title: 'Automatic Street Light',
    category: 'Automation & IoT',
    difficulty: 'Beginner',
    estimatedTime: '40 mins',
    summary:
      'Build an energy-saving streetlight controller using an LDR photoresistor voltage divider that switches bright street LEDs on automatically at dusk and off at dawn.',
    imageUrl: ARDUINO_IMAGE,
    imageAlt: 'Arduino photoresistor automatic street light breadboard circuit',
    components: [
      'Arduino Uno Board & USB Cable',
      '1x LDR (Light Dependent Resistor / Photoresistor)',
      '1x 10k-ohm Resistor (for LDR voltage divider)',
      '2x White or Warm-Yellow LEDs + 2x 220-ohm Resistors',
      'Breadboard & Jumper Wires',
    ],
    circuitConnections: [
      {
        component: 'LDR Photoresistor',
        signalPin: 'Leg 1 / Leg 2',
        controllerPin: '5V / A0',
        notes: 'Forms the top half of the light-sensing voltage divider.',
      },
      {
        component: '10kΩ Pull-Down Resistor',
        signalPin: 'Between A0 and GND',
        controllerPin: 'A0 to GND',
        notes: 'Creates a measurable analog voltage at A0 as light changes.',
      },
      {
        component: 'Street Lamp LEDs',
        signalPin: 'Anodes (+)',
        controllerPin: 'D11 (PWM via 220Ω)',
        notes: 'Can smoothly fade brightness or switch fully ON at night.',
      },
    ],
    arduinoCode: `const int LDR_PIN = A0;
const int STREET_LED = 11;
const int DARK_THRESHOLD = 420;

void setup() {
  Serial.begin(9600);
  pinMode(STREET_LED, OUTPUT);
}

void loop() {
  int lightLevel = analogRead(LDR_PIN);
  Serial.print("Ambient Light (0-1023): ");
  Serial.println(lightLevel);

  if (lightLevel < DARK_THRESHOLD) {
    digitalWrite(STREET_LED, HIGH); // Dusk/Night: turn street light ON
  } else {
    digitalWrite(STREET_LED, LOW);  // Daylight: turn street light OFF
  }
  delay(150);
}`,
    codeExplanation: [
      'The LDR changes electrical resistance based on how much light hits its surface.',
      '`analogRead(LDR_PIN)` reads a higher number in bright daylight and a lower number when covered or dark.',
      'Comparing `lightLevel < DARK_THRESHOLD` decides automatically whether it is dark enough to switch on the street light.',
      'Because `D11` is a PWM pin, you can even upgrade `digitalWrite` to `analogWrite(STREET_LED, brightness)` for twilight dimming!',
    ],
    steps: [
      'Connect one leg of the LDR to `5V` and the other leg to row `A0` on your breadboard.',
      'Place the 10k-ohm resistor from that same `A0` row to `GND`, and run a wire from that row to Arduino pin `A0`.',
      'Wire the Street Lamp LEDs with 220-ohm resistors to Pin `D11` and `GND`.',
      'Upload the sketch and open the Serial Monitor to read bright-room vs. covered-hand light numbers.',
      'Cup your hand over the LDR to simulate sunset and watch the street lights switch on.',
    ],
    troubleshootingTips: [
      {
        issue: 'The light flickers rapidly right near sunset brightness.',
        solution:
          'Add hysteresis—turn ON below `400` and turn OFF above `460` so small shadows do not cause rapid blinking.',
      },
      {
        issue: 'Analog readings stay fixed at 1023 or 0.',
        solution:
          'Verify the 10k-ohm resistor is properly seated between the LDR+A0 junction and `GND`.',
      },
    ],
    safetyInstructions: [
      'Do not confuse the 10k-ohm LDR divider resistor with the 220-ohm LED protective resistors.',
      'Keep your circuit powered strictly via 5V USB—never connect household AC lamp bulbs directly to an Arduino.',
    ],
  },
  {
    id: 'ard-bluetooth-robot',
    title: 'Bluetooth Controlled Robot',
    category: 'Robotics & Control',
    difficulty: 'Advanced',
    estimatedTime: '120 mins',
    summary:
      'Drive a 2WD robot rover wirelessly from a smartphone serial terminal using an HC-05 Bluetooth module and L298N dual H-bridge motor driver.',
    imageUrl: ROVER_IMAGE,
    imageAlt: 'Bluetooth controlled 2WD Arduino robot rover with L298N motor driver',
    components: [
      'Arduino Uno + 2WD Robot Chassis with 2 DC Gear Motors',
      '1x L298N Dual H-Bridge Motor Driver',
      '1x HC-05 Bluetooth Serial Module',
      '6x AA Battery Holder (9V) or 7.4V Li-Ion Pack + Switch',
      '1x 1kΩ + 2kΩ Voltage Divider Resistors (for HC-05 RX pin)',
    ],
    circuitConnections: [
      {
        component: 'HC-05 Bluetooth TX / RX',
        signalPin: 'TXD / RXD',
        controllerPin: 'D2 (SW RX) / D3 (via divider)',
        notes: 'Use SoftwareSerial so USB uploading still works smoothly.',
      },
      {
        component: 'L298N Left Motor',
        signalPin: 'IN1 / IN2 / ENA',
        controllerPin: 'D7 / D8 / D5 (PWM)',
        notes: 'Controls left wheel direction and speed.',
      },
      {
        component: 'L298N Right Motor',
        signalPin: 'IN3 / IN4 / ENB',
        controllerPin: 'D9 / D11 / D6 (PWM)',
        notes: 'Controls right wheel direction and speed.',
      },
      {
        component: 'Battery Power & Common GND',
        signalPin: 'Battery + / -',
        controllerPin: 'L298N 12V / Shared GND',
        notes: 'Always connect battery negative to both L298N GND and Arduino GND.',
      },
    ],
    arduinoCode: `#include <SoftwareSerial.h>
SoftwareSerial bt(2, 3); // RX, TX

const int ENA = 5, IN1 = 7, IN2 = 8;
const int ENB = 6, IN3 = 9, IN4 = 11;

void setMotors(int lDir1, int lDir2, int rDir1, int rDir2, int speed) {
  digitalWrite(IN1, lDir1); digitalWrite(IN2, lDir2);
  digitalWrite(IN3, rDir1); digitalWrite(IN4, rDir2);
  analogWrite(ENA, speed);  analogWrite(ENB, speed);
}

void setup() {
  bt.begin(9600);
  int pins[] = {ENA, IN1, IN2, ENB, IN3, IN4};
  for (int p : pins) pinMode(p, OUTPUT);
  setMotors(LOW, LOW, LOW, LOW, 0);
}

void loop() {
  if (bt.available()) {
    char cmd = bt.read();
    if (cmd == 'F') setMotors(HIGH, LOW, HIGH, LOW, 185);
    else if (cmd == 'B') setMotors(LOW, HIGH, LOW, HIGH, 185);
    else if (cmd == 'L') setMotors(LOW, HIGH, HIGH, LOW, 165);
    else if (cmd == 'R') setMotors(HIGH, LOW, LOW, HIGH, 165);
    else if (cmd == 'S') setMotors(LOW, LOW, LOW, LOW, 0);
  }
}`,
    codeExplanation: [
      '`SoftwareSerial bt(2, 3);` lets the HC-05 use pins D2/D3 while leaving pins D0/D1 free for USB code uploads.',
      '`setMotors(...)` cleanly sets both left and right H-bridge directions and PWM speed in one reusable helper function.',
      'Whenever a single character arrives over Bluetooth (`F`, `B`, `L`, `R`, `S`), the rover steers or halts immediately.',
      'Initializing motors to `LOW, 0` inside `setup()` ensures the robot stays parked when first powered on.',
    ],
    steps: [
      'Assemble the 2WD chassis, mount the L298N motor driver, and screw both motor wires into OUT1–OUT4.',
      'Connect Arduino pins D5–D11 to ENA, ENB, and IN1–IN4, and join Arduino GND to L298N GND.',
      'Wire the HC-05 Bluetooth module (using a 1kΩ/2kΩ voltage divider on RXD to step 5V down to 3.3V).',
      'Upload the sketch via USB first with the chassis wheels lifted off the desk.',
      'Pair your phone Bluetooth terminal at 9600 baud and test F, L, R, B, and S commands.',
    ],
    troubleshootingTips: [
      {
        issue: 'One wheel spins backward when pressing Forward (`F`).',
        solution:
          'Swap the two motor leads for that side in the L298N screw terminal (OUT1/OUT2 or OUT3/OUT4).',
      },
      {
        issue: 'Bluetooth pairs with phone, but commands do nothing.',
        solution:
          'Check that HC-05 TX goes to Arduino D2 (RX) and HC-05 RX goes to D3 (TX), and confirm 9600 baud.',
      },
    ],
    safetyInstructions: [
      'Always elevate the robot chassis on a block while testing motor code so it cannot drive off the table.',
      'Turn off the battery switch before rewiring the L298N or HC-05, and check battery polarity before flipping power on.',
    ],
  },
  {
    id: 'ard-smart-home',
    title: 'Smart Home Automation',
    category: 'Automation & IoT',
    difficulty: 'Advanced',
    estimatedTime: '95 mins',
    summary:
      'Build a desktop smart-room controller that toggles a room LED bank, mini 5V cooling fan, and security buzzer via serial/Bluetooth commands plus automatic temperature fan cooling.',
    imageUrl: SMART_HOME_IMAGE,
    imageAlt: 'Arduino Smart Home Automation tabletop model with room lights and cooling fan',
    components: [
      'Arduino Uno Board & USB Cable',
      '1x 5V DC Mini Fan + NPN Transistor (2N2222) + 1N4007 Flyback Diode',
      '2x Room Lighting LEDs + 220-ohm Resistors',
      '1x HC-05 Bluetooth or USB Serial Control + DHT11 Sensor',
      'Breadboard & Jumper Wires',
    ],
    circuitConnections: [
      {
        component: 'Living Room LEDs',
        signalPin: 'Anodes (+)',
        controllerPin: 'D4 / D5 (via 220Ω)',
        notes: 'Controlled independently via `L1`/`L0` commands.',
      },
      {
        component: '5V Cooling Fan (via 2N2222)',
        signalPin: 'Transistor Base',
        controllerPin: 'D9 (via 1kΩ Resistor)',
        notes: 'Transistor switches 5V fan safely; diode across fan absorbs voltage spikes.',
      },
      {
        component: 'Wireless Command Link',
        signalPin: 'TX / RX',
        controllerPin: 'D2 / D3 (SoftwareSerial)',
        notes: 'Accepts phone Bluetooth or Serial Monitor commands.',
      },
    ],
    arduinoCode: `#include <SoftwareSerial.h>
SoftwareSerial homeLink(2, 3);

const int ROOM_LIGHT = 4;
const int DESK_LAMP = 5;
const int FAN_PIN = 9;

void setup() {
  Serial.begin(9600);
  homeLink.begin(9600);
  pinMode(ROOM_LIGHT, OUTPUT);
  pinMode(DESK_LAMP, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  Serial.println("Smart Home Ready: Send L1/L0, D1/D0, F1/F0");
}

void handleCommand(String cmd) {
  cmd.trim();
  cmd.toUpperCase();
  if (cmd == "L1") digitalWrite(ROOM_LIGHT, HIGH);
  else if (cmd == "L0") digitalWrite(ROOM_LIGHT, LOW);
  else if (cmd == "D1") digitalWrite(DESK_LAMP, HIGH);
  else if (cmd == "D0") digitalWrite(DESK_LAMP, LOW);
  else if (cmd == "F1") analogWrite(FAN_PIN, 210);
  else if (cmd == "F0") analogWrite(FAN_PIN, 0);
}

void loop() {
  if (Serial.available()) handleCommand(Serial.readStringUntil('\\n'));
  if (homeLink.available()) handleCommand(homeLink.readStringUntil('\\n'));
}`,
    codeExplanation: [
      'A shared `handleCommand(String cmd)` helper works whether commands arrive from USB Serial Monitor or wireless Bluetooth.',
      '`cmd.trim(); cmd.toUpperCase();` cleans extra spaces or lowercase letters so `l1` and `L1` both work.',
      'The cooling fan uses `analogWrite(FAN_PIN, 210)` through an NPN transistor so the Arduino pin never supplies heavy motor current directly.',
      'You can expand this controller with an LDR or DHT11 sensor to switch the fan on automatically when warm.',
    ],
    steps: [
      'Keep your smart home strictly low-voltage (5V LEDs and 5V mini DC fan)—never wire wall mains AC appliances.',
      'Wire the Room Light (D4) and Desk Lamp (D5) LEDs with 220-ohm resistors.',
      'Build the transistor driver stage on D9 with a 1k-ohm base resistor and 1N4007 flyback diode across the 5V fan.',
      'Upload the sketch and open Serial Monitor (set line ending to Newline) or connect Bluetooth.',
      'Test `L1`, `L0`, `D1`, `D0`, `F1`, and `F0` to control each appliance cleanly.',
    ],
    troubleshootingTips: [
      {
        issue: 'The 5V mini fan hums but does not spin at `analogWrite(FAN_PIN, 210)`.',
        solution:
          'Increase startup speed to `255` for 200 ms to overcome initial motor friction, and verify the transistor orientation (E-B-C).',
      },
      {
        issue: 'Commands take 1 full second to react.',
        solution: 'Ensure Serial Monitor line ending is set to `Newline` (`\\n`) or add `Serial.setTimeout(50)`.',
      },
    ],
    safetyInstructions: [
      'CRITICAL: Use only safe 5V LEDs and 5V DC toy fans for school smart home prototypes. Never connect mains 110V/230V AC household wiring or wall outlets.',
      'Always install the 1N4007 flyback diode across the DC fan terminals (striped side to +5V) to protect the Arduino from back-EMF voltage spikes.',
    ],
  },
];
