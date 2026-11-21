import {
  CodingChallenge,
  CourseItem,
  GallerySubmission,
  PageId,
  ProjectItem,
  StudentProfile,
} from '../types/platform';

export const HERO_LAB_IMAGE = '/src/assets/images/hero_robotics_lab_1795253659538.jpg';
export const ROVER_IMAGE = '/src/assets/images/track_robotics_rover_1795253660130.jpg';
export const ARDUINO_IMAGE = '/src/assets/images/track_arduino_circuit_1795253659684.jpg';
export const AI_VISION_IMAGE = '/src/assets/images/track_ai_vision_1795253660051.jpg';
export const STUDENT_AVATAR_IMAGE = '/src/assets/images/avatar_student_alex_1795253660934.jpg';
export const SMART_DUSTBIN_IMAGE = '/src/assets/images/proj_smart_dustbin_1795254334880.jpg';
export const FIRE_BOT_IMAGE = '/src/assets/images/proj_fire_detection_bot_1795254334928.jpg';
export const SMART_HOME_IMAGE = '/src/assets/images/proj_smart_home_iot_1795254335362.jpg';
export const DELIVERY_BOT_IMAGE = '/src/assets/images/proj_delivery_robot_1795254335388.jpg';

export interface NavItem {
  id: PageId;
  label: string;
  pageTitle: string;
  path: string;
  group: 'Overview' | 'Learning Tracks' | 'Studio & Community';
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', pageTitle: 'Home', path: '/', group: 'Overview' },
  { id: 'dashboard', label: 'Dashboard', pageTitle: 'Student Dashboard', path: '/dashboard', group: 'Overview' },
  { id: 'robotics', label: 'Robotics', pageTitle: 'Robotics Learning', path: '/robotics', group: 'Learning Tracks' },
  { id: 'scratch', label: 'Scratch', pageTitle: 'Scratch Coding', path: '/scratch', group: 'Learning Tracks' },
  { id: 'python', label: 'Python', pageTitle: 'Python Academy', path: '/python', group: 'Learning Tracks' },
  { id: 'arduino', label: 'Arduino', pageTitle: 'Arduino Projects', path: '/arduino', group: 'Learning Tracks' },
  { id: 'ai-ml', label: 'AI & ML', pageTitle: 'AI Learning', path: '/ai-learning', group: 'Learning Tracks' },
  { id: 'projects', label: 'Projects', pageTitle: 'Project Library', path: '/projects', group: 'Studio & Community' },
  { id: 'challenges', label: 'Coding Challenges', pageTitle: 'Coding Challenges', path: '/challenges', group: 'Studio & Community' },
  { id: 'mentor', label: 'AI Mentor', pageTitle: 'AI Coding Mentor', path: '/ai-mentor', group: 'Studio & Community' },
  { id: 'gallery', label: 'My Projects', pageTitle: 'Student Project Gallery', path: '/my-projects', group: 'Studio & Community' },
  { id: 'profile', label: 'Profile', pageTitle: 'Student Profile', path: '/profile', group: 'Studio & Community' },
];

export const INITIAL_PROFILE: StudentProfile = {
  name: 'Alex Rivera',
  age: 13,
  grade: '8th Grade',
  bio: 'Building autonomous rovers, testing ultrasonic navigation, and learning Python computer vision.',
  favoriteTrack: 'robotics',
  avatarUrl: STUDENT_AVATAR_IMAGE,
  weeklyGoalMinutes: 180,
};

export const WEEKLY_ACTIVITY_MINUTES = [
  { day: 'Mon', minutes: 25 },
  { day: 'Tue', minutes: 40 },
  { day: 'Wed', minutes: 15 },
  { day: 'Thu', minutes: 50 },
  { day: 'Fri', minutes: 35 },
  { day: 'Sat', minutes: 45 },
  { day: 'Sun', minutes: 20 },
];

export const COURSES: CourseItem[] = [
  {
    id: 'course-robotics-101',
    track: 'robotics',
    pageId: 'robotics',
    title: 'Autonomous Rover Mechanics & Sensors',
    subtitle: 'Design differential-drive rovers, calibrate ultrasonic distance sensors, and program smooth obstacle avoidance.',
    ageRange: 'Ages 10–16',
    difficulty: 'Beginner',
    estimatedHours: 6,
    imageUrl: ROVER_IMAGE,
    imageAlt: 'Educational line-following robot rover kit with ultrasonic sensor',
    accentLabel: 'Robotics Track',
    lessons: [
      {
        id: 'rob-1',
        title: '01. Chassis Geometry & Differential Drive',
        durationMinutes: 18,
        summary: 'Learn how left and right geared motors steer a rover using wheel speed differences.',
        keyConcept: 'When the left wheel turns forward and the right wheel stops or reverses, the rover pivots smoothly around its center axle.',
        codePreview: `// Differential turn logic
setMotorSpeed(LEFT_MOTOR, 180);
setMotorSpeed(RIGHT_MOTOR, -180); // Pivot right`,
        codeLanguage: 'cpp',
      },
      {
        id: 'rob-2',
        title: '02. Ultrasonic Echolocation (HC-SR04)',
        durationMinutes: 22,
        summary: 'Measure obstacle distance in centimeters by timing 40kHz sound pulses.',
        keyConcept: 'Distance equals (pulseDuration * 0.0343) / 2 because the sound wave travels to the object and back.',
        codePreview: `float distanceCm = (pulseIn(ECHO_PIN, HIGH) * 0.0343) / 2.0;
if (distanceCm < 20.0) {
  stopRover();
}`,
        codeLanguage: 'cpp',
      },
      {
        id: 'rob-3',
        title: '03. Infrared Line-Following Feedback Loops',
        durationMinutes: 25,
        summary: 'Read left and right IR reflectance sensors to keep a robot centered on a dark track.',
        keyConcept: 'Proportional steering nudges the rover gently back onto the line instead of jerky full-speed zig-zags.',
        codePreview: `int leftIR = digitalRead(IR_LEFT);
int rightIR = digitalRead(IR_RIGHT);
if (leftIR == LOW && rightIR == HIGH) steerLeft();`,
        codeLanguage: 'cpp',
      },
      {
        id: 'rob-4',
        title: '04. PID Speed Balancing Lab',
        durationMinutes: 28,
        summary: 'Combine proportional and derivative error terms for steady rover navigation.',
        keyConcept: 'Error = targetDistance - measuredDistance; steering adjustment scales cleanly with error.',
        codePreview: `float error = target - measured;
float turn = Kp * error + Kd * (error - lastError);`,
        codeLanguage: 'cpp',
      },
    ],
    quiz: [
      {
        id: 'rob-q1',
        question: 'Why do we divide the ultrasonic pulse travel time by 2 when calculating distance?',
        options: [
          'Sound travels at half speed in indoor rooms',
          'The sound wave travels to the target and reflects back to the sensor',
          'Arduino timers count twice per microsecond',
          'To convert centimeters into inches',
        ],
        correctIndex: 1,
        explanation: 'The HC-SR04 measures round-trip time (out to the obstacle and back), so dividing by 2 gives the one-way distance.',
      },
      {
        id: 'rob-q2',
        question: 'In a two-wheel differential drive rover, how do you execute an in-place right turn?',
        options: [
          'Spin both wheels forward at equal speed',
          'Spin the left wheel forward and the right wheel backward',
          'Turn off both motors simultaneously',
          'Spin the right wheel forward and the left wheel backward',
        ],
        correctIndex: 1,
        explanation: 'Rotating the left wheel forward and right wheel backward creates opposing torque around the rover center.',
      },
      {
        id: 'rob-q3',
        question: 'Which sensor detects contrast between black electrical tape and a white floor?',
        options: [
          'Infrared (IR) reflectance sensor',
          'Barometric pressure sensor',
          'Servo potentiometer',
          'Piezo buzzer',
        ],
        correctIndex: 0,
        explanation: 'IR reflectance sensors emit infrared light; white surfaces reflect strongly while black tape absorbs IR.',
      },
      {
        id: 'rob-q4',
        question: 'What is the main role of an L298N H-bridge motor driver module on a robot?',
        options: [
          'It generates Wi-Fi signals for remote telemetry',
          'It safely supplies higher battery current and reverses polarity to spin motors forward or backward',
          'It converts ultrasonic sound waves into text',
          'It stores Python scripts inside EEPROM memory',
        ],
        correctIndex: 1,
        explanation: 'Microcontroller pins cannot drive motor currents directly; an H-bridge switches battery power safely in both directions.',
      },
      {
        id: 'rob-q5',
        question: 'What happens if you connect the motor battery GND and Arduino GND separately without sharing a common ground?',
        options: [
          'The rover drives twice as fast',
          'Control signals have no shared voltage reference, causing erratic or unresponsive motors',
          'The ultrasonic sensor increases its range to 20 meters',
          'The battery recharges automatically',
        ],
        correctIndex: 1,
        explanation: 'Voltage is always measured relative to ground, so all modules in a robot circuit must share a common GND connection.',
      },
      {
        id: 'rob-q6',
        question: 'In proportional steering (PID) for a line-following robot, what does the "error" value represent?',
        options: [
          'How many syntax bugs exist in the C++ code',
          'The difference between the target centered position and the current measured sensor position',
          'The remaining battery voltage percentage',
          'The number of laps completed',
        ],
        correctIndex: 1,
        explanation: 'Error measures how far off-center the robot is so steering corrections scale smoothly with how far it drifted.',
      },
      {
        id: 'rob-q7',
        question: 'Which component supports the back or front of a 2WD robot chassis while letting it pivot freely?',
        options: [
          'Swivel caster wheel',
          'Step-down voltage regulator',
          'Photoresistor',
          'Crystal oscillator',
        ],
        correctIndex: 0,
        explanation: 'A low-friction caster wheel balances the 2WD chassis and rotates passively in any direction during turns.',
      },
      {
        id: 'rob-q8',
        question: 'Why should a delivery robot check its front ultrasonic safety guard BEFORE running line-following commands?',
        options: [
          'To make its LEDs blink brighter',
          'So obstacle-avoidance safety always takes top priority if someone steps in front of the robot',
          'Because ultrasonic sensors only work at the start of loop()',
          'To drain the battery evenly',
        ],
        correctIndex: 1,
        explanation: 'Priority state machines handle safety checks first so the rover stops immediately when an obstacle appears.',
      },
      {
        id: 'rob-q9',
        question: 'What does PWM (Pulse Width Modulation) on the ENA/ENB pins control on a DC motor?',
        options: [
          'Motor shaft rotation speed',
          'Bluetooth pairing password',
          'Ultrasonic sound frequency',
          'Servo horn physical size',
        ],
        correctIndex: 0,
        explanation: 'Varying the duty cycle from 0 to 255 adjusts the average voltage delivered to the DC motor, controlling speed.',
      },
      {
        id: 'rob-q10',
        question: 'Why does a 4-DOF robotic arm need an external 5V 2A power supply instead of running 4 servos from USB?',
        options: [
          'USB cables only transmit Python code',
          'Four servos moving under load draw more current than a computer USB port can safely deliver',
          'External power supplies automatically write servo angles',
          'Servos require 24V AC wall power',
        ],
        correctIndex: 1,
        explanation: 'Multiple servos can pull 1.5–2A together, which causes USB voltage drops and microcontroller brownout resets.',
      },
    ],
  },
  {
    id: 'course-scratch-101',
    track: 'scratch',
    pageId: 'scratch',
    title: 'Scratch Visual Logic & Game Physics',
    subtitle: 'Master event blocks, sprite cloning, velocity variables, and interactive scoreboards for arcade games.',
    ageRange: 'Ages 8–13',
    difficulty: 'Beginner',
    estimatedHours: 5,
    imageUrl: HERO_LAB_IMAGE,
    imageAlt: 'Laptop showing colorful Scratch-style visual coding blocks beside rover',
    accentLabel: 'Scratch Track',
    lessons: [
      {
        id: 'scr-1',
        title: '01. Events, Loops & Sprite Coordinates',
        durationMinutes: 15,
        summary: 'Control sprite movement across the 480x360 Scratch stage using X and Y coordinates.',
        keyConcept: 'The center of the Scratch stage is (0, 0). Increasing X moves right; increasing Y moves up.',
        codePreview: `when [green flag] clicked
go to x: (0) y: (-120)
forever
  if <key [right arrow] pressed?> then
    change x by (8)
  end
end`,
        codeLanguage: 'scratch',
      },
      {
        id: 'scr-2',
        title: '02. Gravity & Jumping with Velocity Variables',
        durationMinutes: 20,
        summary: 'Create realistic smooth jumps using a yVelocity variable inside a forever loop.',
        keyConcept: 'Subtract 1 from yVelocity every frame for gravity, and set yVelocity to 14 when jumping.',
        codePreview: `change [yVelocity] by (-1)
change y by (yVelocity)
if <touching [Ground]?> then
  set [yVelocity] to (0)
end`,
        codeLanguage: 'scratch',
      },
      {
        id: 'scr-3',
        title: '03. Cloning Asteroids & Collision Detection',
        durationMinutes: 22,
        summary: 'Spawn multiple obstacles efficiently using Scratch clones and delete them off-screen.',
        keyConcept: 'Use "when I start as a clone" so each cloned asteroid runs independent motion and collision checks.',
        codePreview: `when I start as a clone
go to x: (pick random (-200) to (200)) y: (170)
repeat until <(y position) < (-170)>
  change y by (-5)
end
delete this clone`,
        codeLanguage: 'scratch',
      },
    ],
    quiz: [
      {
        id: 'scr-q1',
        question: 'What are the X and Y coordinates at the exact center of the Scratch stage?',
        options: ['x: 100, y: 100', 'x: 0, y: 0', 'x: 240, y: 180', 'x: -100, y: 0'],
        correctIndex: 1,
        explanation: 'The Scratch stage is centered at (0, 0), spanning X from -240 to 240 and Y from -180 to 180.',
      },
      {
        id: 'scr-q2',
        question: 'Why is "delete this clone" important at the end of a projectile or obstacle script?',
        options: [
          'It resets the player score to zero',
          'It prevents hitting the 300-clone limit and keeps the game running smoothly',
          'It changes the stage backdrop automatically',
          'It saves the project file to disk',
        ],
        correctIndex: 1,
        explanation: 'Scratch limits active clones to 300; deleting finished clones frees memory for new spawns.',
      },
      {
        id: 'scr-q3',
        question: 'To simulate gravity in a platformer game, what should happen to yVelocity each frame?',
        options: [
          'Multiply yVelocity by 10',
          'Subtract a small constant like 1 from yVelocity',
          'Set y position to 0',
          'Broadcast a new message every second',
        ],
        correctIndex: 1,
        explanation: 'Constantly decreasing yVelocity creates downward acceleration just like real gravity.',
      },
      {
        id: 'scr-q4',
        question: 'Which Scratch block category contains "when [green flag] clicked" and "broadcast [message]"?',
        options: ['Motion', 'Looks', 'Events', 'Operators'],
        correctIndex: 2,
        explanation: 'Yellow Events blocks start scripts when triggers like the green flag, key presses, or broadcasts occur.',
      },
      {
        id: 'scr-q5',
        question: 'How wide and tall is the standard Scratch stage in pixels?',
        options: ['480 wide × 360 tall', '1920 wide × 1080 tall', '100 wide × 100 tall', '640 wide × 640 tall'],
        correctIndex: 0,
        explanation: 'The Scratch stage spans X from -240 to 240 (480 units) and Y from -180 to 180 (360 units).',
      },
      {
        id: 'scr-q6',
        question: 'What is the difference between "broadcast [msg]" and "broadcast [msg] and wait"?',
        options: [
          'There is no difference',
          '"and wait" pauses the current script until all receiving scripts finish running',
          '"and wait" deletes all sprites on stage',
          '"broadcast" only works on Stage backdrops',
        ],
        correctIndex: 1,
        explanation: '"Broadcast and wait" ensures all triggered animations or level transitions complete before continuing.',
      },
      {
        id: 'scr-q7',
        question: 'Which Operator block returns true only when BOTH conditions inside it are true?',
        options: ['< () or () >', '< not () >', '< () and () >', '< () = () >'],
        correctIndex: 2,
        explanation: 'The boolean `and` operator requires both left and right conditions to evaluate to true.',
      },
      {
        id: 'scr-q8',
        question: 'If a sprite points in direction 90 and runs "move (10) steps", which way does it move?',
        options: ['Straight up', 'Straight right', 'Straight left', 'Straight down'],
        correctIndex: 1,
        explanation: 'In Scratch, direction 0 is up, 90 is right, 180 is down, and -90 is left.',
      },
      {
        id: 'scr-q9',
        question: 'What happens when you store a player score in a "For this sprite only" variable vs. "For all sprites"?',
        options: [
          '"For this sprite only" lets each clone keep its own independent value (like individual asteroid health)',
          '"For this sprite only" makes the score visible to every player online',
          '"For all sprites" hides the variable from the stage',
          'Both behave identically for clones',
        ],
        correctIndex: 0,
        explanation: 'Local sprite-only variables give each clone an independent copy, which is ideal for per-enemy HP or speed.',
      },
      {
        id: 'scr-q10',
        question: 'Which Sensing block checks if your Space Rover sprite touches a Meteor sprite?',
        options: [
          '< touching [Meteor] ? >',
          'glide (1) secs to [Meteor]',
          'switch costume to [Meteor]',
          'pick random (1) to (10)',
        ],
        correctIndex: 0,
        explanation: 'The light-blue Sensing block `<touching [Sprite]?>` returns true during sprite overlap for collision detection.',
      },
    ],
  },
  {
    id: 'course-python-101',
    track: 'python',
    pageId: 'python',
    title: 'Python Academy: Logic, Lists & Rover Scripts',
    subtitle: 'Transition from visual blocks to clean Python syntax with loops, functions, dictionaries, and sensor simulations.',
    ageRange: 'Ages 11–16',
    difficulty: 'Intermediate',
    estimatedHours: 8,
    imageUrl: AI_VISION_IMAGE,
    imageAlt: 'Modern STEM desk with computer screen and robotic sorting system',
    accentLabel: 'Python Track',
    lessons: [
      {
        id: 'py-1',
        title: '01. Variables, Types & Sensor Telemetry',
        durationMinutes: 20,
        summary: 'Store battery percentages, rover names, and distance readings using Python variables and f-strings.',
        keyConcept: 'Use f-strings like f"Battery: {battery}%" to format clean status reports.',
        codePreview: `rover_name = "Explorer-1"
battery_pct = 86
distance_cm = 24.5
print(f"{rover_name} | Battery: {battery_pct}% | Clear: {distance_cm}cm")`,
        codeLanguage: 'python',
      },
      {
        id: 'py-2',
        title: '02. Lists, Loops & Averaging Sensor Readings',
        durationMinutes: 24,
        summary: 'Filter noisy ultrasonic readings by storing samples in a Python list and computing the mean.',
        keyConcept: 'Averaging 5 quick readings smooths out random sensor spikes.',
        codePreview: `readings = [24.1, 24.4, 23.9, 24.2, 24.4]
avg_distance = sum(readings) / len(readings)
print(round(avg_distance, 2))`,
        codeLanguage: 'python',
      },
      {
        id: 'py-3',
        title: '03. Reusable Navigation Functions',
        durationMinutes: 25,
        summary: 'Write clean Python functions with parameters and return values to make decisions.',
        keyConcept: 'Functions let you test navigation rules once and reuse them across missions.',
        codePreview: `def choose_action(distance_cm: float) -> str:
    if distance_cm < 15:
        return "STOP_AND_TURN"
    elif distance_cm < 35:
        return "SLOW_DOWN"
    return "CRUISE"`,
        codeLanguage: 'python',
      },
    ],
    quiz: [
      {
        id: 'py-q1',
        question: 'What does len([12, 18, 25, 30]) evaluate to in Python?',
        options: ['3', '4', '85', '30'],
        correctIndex: 1,
        explanation: 'len() returns the count of items in a list; there are 4 numbers inside the brackets.',
      },
      {
        id: 'py-q2',
        question: 'Which keyword starts a reusable function definition in Python?',
        options: ['func', 'define', 'def', 'function'],
        correctIndex: 2,
        explanation: 'Python uses the `def` keyword followed by the function name and parentheses.',
      },
      {
        id: 'py-q3',
        question: 'What is printed by: print(f"Score: {5 * 3}")?',
        options: ['Score: {5 * 3}', 'Score: 15', 'Score: 5 * 3', 'SyntaxError'],
        correctIndex: 1,
        explanation: 'An f-string evaluates expressions inside curly braces `{}` and inserts the result.',
      },
      {
        id: 'py-q4',
        question: 'Which index accesses the FIRST element in a Python list named `sensors`?',
        options: ['sensors[1]', 'sensors[0]', 'sensors[-1]', 'sensors.first()'],
        correctIndex: 1,
        explanation: 'Python lists are zero-indexed, so index `0` refers to the first element.',
      },
      {
        id: 'py-q5',
        question: 'What sequence of numbers does `range(1, 5)` generate in a `for` loop?',
        options: ['1, 2, 3, 4, 5', '0, 1, 2, 3, 4', '1, 2, 3, 4', '2, 3, 4, 5'],
        correctIndex: 2,
        explanation: '`range(start, stop)` includes `start` (1) and stops right before `stop` (5), yielding 1, 2, 3, 4.',
      },
      {
        id: 'py-q6',
        question: 'Which Python data structure stores key-value pairs like `{"temp": 22.5, "unit": "C"}`?',
        options: ['Tuple', 'Dictionary', 'Integer', 'Boolean'],
        correctIndex: 1,
        explanation: 'Dictionaries map unique keys to values inside curly braces `{}` for fast lookup.',
      },
      {
        id: 'py-q7',
        question: 'What does `round(24.678, 1)` return in Python?',
        options: ['24.6', '24.7', '25', '24.68'],
        correctIndex: 1,
        explanation: 'Rounding `24.678` to 1 decimal place rounds up to `24.7`.',
      },
      {
        id: 'py-q8',
        question: 'In a function, what is the difference between `print(x)` and `return x`?',
        options: [
          'They do the exact same thing',
          '`print` displays text on screen, while `return` sends a value back to the caller for further calculations',
          '`return` deletes the variable `x`',
          '`print` only works with numbers',
        ],
        correctIndex: 1,
        explanation: 'Returning a value lets other parts of your robot program store and reuse the result.',
      },
      {
        id: 'py-q9',
        question: 'How do you add `"ultrasonic"` to the end of a list named `parts`?',
        options: [
          'parts.append("ultrasonic")',
          'parts.push("ultrasonic")',
          'parts.addLast("ultrasonic")',
          'append(parts, "ultrasonic")',
        ],
        correctIndex: 0,
        explanation: 'Python lists provide the `.append(item)` method to add an element to the end.',
      },
      {
        id: 'py-q10',
        question: 'What happens if `temps` is empty `[]` and you run `sum(temps) / len(temps)` without checking?',
        options: [
          'It returns 0',
          'It raises a ZeroDivisionError because len(temps) is 0',
          'It returns None',
          'Python automatically adds a 1',
        ],
        correctIndex: 1,
        explanation: 'Dividing by zero triggers a `ZeroDivisionError`; checking `if temps:` first keeps telemetry scripts safe.',
      },
    ],
  },
  {
    id: 'course-arduino-101',
    track: 'arduino',
    pageId: 'arduino',
    title: 'Arduino Circuits, PWM & Micro-Servos',
    subtitle: 'Wire breadboard circuits safely, control LED brightness with PWM, and sweep robotic grippers with Servo.h.',
    ageRange: 'Ages 11–16',
    difficulty: 'Intermediate',
    estimatedHours: 7,
    imageUrl: ARDUINO_IMAGE,
    imageAlt: 'Arduino Uno connected to breadboard LEDs, resistors, and micro servo motor',
    accentLabel: 'Arduino Track',
    lessons: [
      {
        id: 'ard-1',
        title: '01. Breadboards, Resistors & Safe LED Wiring',
        durationMinutes: 18,
        summary: 'Understand breadboard power rails, LED polarity (anode vs cathode), and 220-ohm current-limiting resistors.',
        keyConcept: 'Always place a 220Ω resistor in series with an LED to protect both the LED and Arduino GPIO pin.',
        codePreview: `void setup() {
  pinMode(13, OUTPUT);
}
void loop() {
  digitalWrite(13, HIGH);
  delay(500);
  digitalWrite(13, LOW);
  delay(500);
}`,
        codeLanguage: 'cpp',
      },
      {
        id: 'ard-2',
        title: '02. Analog Inputs & PWM Dimming (~Pins)',
        durationMinutes: 22,
        summary: 'Read a potentiometer (0–1023) and map it to PWM brightness (0–255) on pin 9.',
        keyConcept: 'Pulse Width Modulation switches a pin on and off thousands of times per second to vary average power.',
        codePreview: `int knob = analogRead(A0);
int brightness = map(knob, 0, 1023, 0, 255);
analogWrite(9, brightness);`,
        codeLanguage: 'cpp',
      },
      {
        id: 'ard-3',
        title: '03. Sweeping Robotic Arms with Servo.h',
        durationMinutes: 25,
        summary: 'Command exact angles (0° to 180°) on an SG90 micro servo motor.',
        keyConcept: 'Servos use a 50Hz control pulse on signal wire (orange/yellow) plus 5V power and GND.',
        codePreview: `#include <Servo.h>
Servo gripper;
void setup() { gripper.attach(6); }
void loop() {
  gripper.write(90);
  delay(800);
}`,
        codeLanguage: 'cpp',
      },
    ],
    quiz: [
      {
        id: 'ard-q1',
        question: 'Why must you connect a resistor (like 220Ω) in series with an LED on an Arduino pin?',
        options: [
          'To change the LED color from red to blue',
          'To limit electrical current so the LED and pin do not burn out',
          'To store energy when USB is unplugged',
          'To double the voltage from 5V to 10V',
        ],
        correctIndex: 1,
        explanation: 'LEDs have very low internal resistance; a 220Ω resistor safely caps current around 15mA.',
      },
      {
        id: 'ard-q2',
        question: 'What value range does analogRead(A0) return on a standard Arduino Uno?',
        options: ['0 to 1', '0 to 255', '0 to 1023', '0 to 5000'],
        correctIndex: 2,
        explanation: 'The Arduino Uno uses a 10-bit ADC, producing integers from 0 (0V) to 1023 (5V).',
      },
      {
        id: 'ard-q3',
        question: 'Which Arduino function runs repeatedly forever after setup() finishes?',
        options: ['main()', 'repeat()', 'loop()', 'forever()'],
        correctIndex: 2,
        explanation: 'Arduino sketches execute `setup()` once at boot, then run `loop()` continuously.',
      },
      {
        id: 'ard-q4',
        question: 'What is the valid output range passed into `analogWrite(pin, value)` on an Arduino Uno PWM pin?',
        options: ['0 to 10', '0 to 255', '0 to 1023', '-180 to 180'],
        correctIndex: 1,
        explanation: 'Uno PWM timers use 8-bit resolution, so `analogWrite` accepts values from 0 (0% duty) to 255 (100% duty).',
      },
      {
        id: 'ard-q5',
        question: 'On a standard solderless breadboard, how are the 5 holes in a central vertical row (a–e) connected?',
        options: [
          'They are connected together underneath by a metal clip',
          'They are completely isolated from each other',
          'They are only connected when the USB cable is plugged in',
          'They are connected horizontally across the entire board',
        ],
        correctIndex: 0,
        explanation: 'Terminal strips connect in groups of 5 holes (a–e and f–j), separated by the center IC ravine.',
      },
      {
        id: 'ard-q6',
        question: 'How can you identify the positive (Anode) leg of a standard 5mm LED?',
        options: [
          'It is always the shorter leg',
          'It is the longer leg (and opposite the flat rim edge)',
          'It is painted black',
          'LEDs have no polarity and work either way',
        ],
        correctIndex: 1,
        explanation: 'The longer LED lead is the Anode (+) and connects toward the positive signal/resistor; the shorter lead is Cathode (-).',
      },
      {
        id: 'ard-q7',
        question: 'Which Arduino pins support hardware PWM (`~`) on an Arduino Uno?',
        options: [
          'A0, A1, A2, A3, A4, A5',
          'Pins 3, 5, 6, 9, 10, 11',
          'Pins 0, 1, 2, 4, 7, 8',
          'Only pin 13',
        ],
        correctIndex: 1,
        explanation: 'Pins marked with a tilde (`~`)—3, 5, 6, 9, 10, and 11—support hardware PWM output.',
      },
      {
        id: 'ard-q8',
        question: 'Why must you unplug an HC-05 Bluetooth module from pins D0/D1 while uploading a sketch over USB?',
        options: [
          'Bluetooth melts during code compilation',
          'The USB-to-Serial programmer shares pins D0 (RX) and D1 (TX), causing serial upload conflicts',
          'Pin D0 outputs 12 volts during upload',
          'HC-05 erases the Arduino bootloader',
        ],
        correctIndex: 1,
        explanation: 'Uno USB uploading uses UART pins 0 and 1; connected serial devices block the programmer handshake.',
      },
      {
        id: 'ard-q9',
        question: 'What does `Serial.begin(9600);` in `setup()` configure?',
        options: [
          'It sets the motor speed to 9600 RPM',
          'It starts serial communication at 9600 bits per second for the Serial Monitor',
          'It pauses the Arduino for 9.6 seconds',
          'It sets all digital pins to INPUT mode',
        ],
        correctIndex: 1,
        explanation: 'Matching the baud rate (9600) between your sketch and Serial Monitor lets you print live sensor readings.',
      },
      {
        id: 'ard-q10',
        question: 'What does `map(512, 0, 1023, 0, 180)` return when controlling a servo from a knob?',
        options: ['512', '90', '45', '180'],
        correctIndex: 1,
        explanation: '512 is roughly halfway between 0 and 1023, so `map()` scales it to roughly halfway between 0° and 180° (~90°).',
      },
    ],
  },
  {
    id: 'course-ai-101',
    track: 'ai-ml',
    pageId: 'ai-ml',
    title: 'AI & Machine Learning for Young Makers',
    subtitle: 'Explore training datasets, confidence thresholds, image classification, and ethical AI design.',
    ageRange: 'Ages 12–16',
    difficulty: 'Intermediate',
    estimatedHours: 6,
    imageUrl: AI_VISION_IMAGE,
    imageAlt: 'Desktop robotic arm with vision camera sorting colored geometric blocks',
    accentLabel: 'AI Learning',
    lessons: [
      {
        id: 'ai-1',
        title: '01. Features, Labels & Training Datasets',
        durationMinutes: 20,
        summary: 'Discover how supervised learning uses labeled examples to recognize new patterns.',
        keyConcept: 'Balanced, diverse training examples prevent a model from guessing wrong on unseen objects.',
        codePreview: `training_samples = [
  {"color_r": 215, "color_g": 45, "label": "Red Cube"},
  {"color_r": 35, "color_g": 120, "label": "Blue Cylinder"},
]`,
        codeLanguage: 'python',
      },
      {
        id: 'ai-2',
        title: '02. Confidence Scores & Decision Thresholds',
        durationMinutes: 22,
        summary: 'Set smart confidence thresholds so a sorting robot pauses instead of grabbing uncertain items.',
        keyConcept: 'If model confidence < 0.80, flag the item for human inspection rather than forcing a bad guess.',
        codePreview: `if prediction["confidence"] >= 0.80:
    sort_into_bin(prediction["label"])
else:
    request_recheck()`,
        codeLanguage: 'python',
      },
      {
        id: 'ai-3',
        title: '03. Responsible & Fair AI Systems',
        durationMinutes: 18,
        summary: 'Audit datasets for lighting bias, camera angle bias, and clear human fallback controls.',
        keyConcept: 'Great AI engineers test models in dim, bright, and cluttered conditions before deploying.',
        codePreview: `# Audit accuracy across lighting groups
for condition in ["bright_day", "indoor_warm", "shadow"]:
    evaluate_accuracy(model, test_sets[condition])`,
        codeLanguage: 'python',
      },
    ],
    quiz: [
      {
        id: 'ai-q1',
        question: 'In supervised machine learning, what is a "label"?',
        options: [
          'The USB cable name on a robot',
          'The correct answer or category attached to each training example',
          'The power supply voltage rating',
          'The speed of the sorting conveyor belt',
        ],
        correctIndex: 1,
        explanation: 'A label tells the training algorithm what class (e.g., "Red Cube") a training sample represents.',
      },
      {
        id: 'ai-q2',
        question: 'What should a sorting robot do if its AI confidence score is 0.42 when the safety threshold is 0.80?',
        options: [
          'Guess randomly at high speed',
          'Pause or place the item in an "Uncertain / Review" tray',
          'Delete its training dataset',
          'Increase motor voltage',
        ],
        correctIndex: 1,
        explanation: 'Setting a threshold prevents low-confidence predictions from causing sorting errors.',
      },
      {
        id: 'ai-q3',
        question: 'Why should image training sets include photos from different angles and lighting?',
        options: [
          'To use up more hard drive space',
          'So the model generalizes well in real-world environments instead of memorizing one setup',
          'To make the camera lens zoom faster',
          'Python requires at least 1,000 bright photos',
        ],
        correctIndex: 1,
        explanation: 'Varied lighting and angles help the model learn true object features rather than background quirks.',
      },
      {
        id: 'ai-q4',
        question: 'In a color-sorting vision system, what are RGB values `[215, 45, 40]` an example of?',
        options: [
          'Input features describing the object',
          'Hardware servo angles',
          'Motor PWM pins',
          'Bluetooth serial commands',
        ],
        correctIndex: 0,
        explanation: 'Features are measurable properties (like Red, Green, Blue pixel intensity) fed into a model to make predictions.',
      },
      {
        id: 'ai-q5',
        question: 'Why do engineers split collected data into a "training set" and a separate "test set"?',
        options: [
          'To test whether the model works accurately on brand-new unseen examples',
          'Because cameras can only take 10 photos at a time',
          'To double the file size on disk',
          'Because test sets do not need labels',
        ],
        correctIndex: 0,
        explanation: 'Testing on held-out examples reveals if the model truly learned the pattern rather than memorizing training photos.',
      },
      {
        id: 'ai-q6',
        question: 'What is "overfitting" in machine learning?',
        options: [
          'When a robot battery is too large for the chassis',
          'When a model memorizes training examples too closely and performs poorly on new data',
          'When a webcam resolution is too crisp',
          'When Python runs too fast',
        ],
        correctIndex: 1,
        explanation: 'An overfit model fails in real-world conditions because it memorized noise or background details from training.',
      },
      {
        id: 'ai-q7',
        question: 'If you train a block classifier with 100 photos of Red Cubes and only 5 photos of Blue Cylinders, what problem occurs?',
        options: [
          'Class imbalance bias—the model favors guessing Red Cube',
          'The camera lens shuts off',
          'Servos rotate 360 degrees continuously',
          'The USB port changes baud rate',
        ],
        correctIndex: 0,
        explanation: 'Balanced datasets with similar sample counts per class help prevent the model from favoring majority classes.',
      },
      {
        id: 'ai-q8',
        question: 'Which task is best suited for Speech-to-Text in a Voice Controlled Robot?',
        options: [
          'Converting spoken audio waves into text commands like "turn left"',
          'Measuring battery voltage',
          'Soldering jumper wires',
          'Detecting infrared heat from a candle',
        ],
        correctIndex: 0,
        explanation: 'Speech recognition transcribes spoken audio into text tokens that your robot code can match to actions.',
      },
      {
        id: 'ai-q9',
        question: 'What does a "confusion matrix" help an AI engineer inspect?',
        options: [
          'Which classes the model predicts correctly versus which ones it mixes up',
          'How tangled the robot jumper wires are',
          'The internal temperature of an Arduino chip',
          'How many lines of code are in a script',
        ],
        correctIndex: 0,
        explanation: 'A confusion matrix shows exact matches and mix-ups (e.g., mistaking yellow cylinders for triangles).',
      },
      {
        id: 'ai-q10',
        question: 'What is a key ethical & safety practice when deploying AI on a physical robot?',
        options: [
          'Remove the physical stop button so the AI decides everything',
          'Include clear confidence thresholds, human override stops, and diverse safety testing',
          'Never test the robot in low light',
          'Hide errors from the user',
        ],
        correctIndex: 1,
        explanation: 'Safe AI robotics always pairs confidence checks with reliable human-in-the-loop stop controls.',
      },
    ],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'proj-line-following-robot',
    title: 'Line Following Robot',
    track: 'robotics',
    trackLabel: 'Robotics',
    category: 'Autonomous Rovers',
    difficulty: 'Beginner',
    ageRange: '10–15 yrs',
    duration: '2 hrs',
    summary:
      'Build an autonomous 2-wheel rover that uses dual infrared reflectance sensors to follow a black electrical-tape track around curves and intersections.',
    imageUrl: ROVER_IMAGE,
    imageAlt: 'Line Following Robot with dual IR sensors tracking black tape on a workbench',
    learningObjectives: [
      'Understand how infrared emitters and phototransistors detect dark vs. reflective surfaces.',
      'Implement differential steering using an L298N H-bridge motor driver.',
      'Calibrate analog/digital sensor thresholds for consistent indoor lighting.',
    ],
    materials: [
      'Arduino Uno + USB Programming Cable',
      '2WD Aluminum or Acrylic Robot Chassis with Caster Wheel',
      '2x Yellow Geared DC Motors with Wheels',
      'L298N Dual H-Bridge Motor Driver Module',
      '2x IR Line Tracking Sensor Modules',
      '6x AA Battery Pack with Switch & Jumper Wires',
      'Roll of Black Electrical Tape (for track)',
    ],
    circuitConnections: [
      {
        component: 'Left IR Sensor',
        signalPin: 'OUT / VCC / GND',
        controllerPin: 'D2 / 5V / GND',
        notes: 'Mount 1.5 cm above floor on the front-left chassis bracket.',
      },
      {
        component: 'Right IR Sensor',
        signalPin: 'OUT / VCC / GND',
        controllerPin: 'D3 / 5V / GND',
        notes: 'Space 3 cm away from the left sensor so the tape sits between them.',
      },
      {
        component: 'L298N Left Motor',
        signalPin: 'IN1, IN2, ENA',
        controllerPin: 'D5, D6, D10 (PWM)',
        notes: 'Controls left wheel direction and speed.',
      },
      {
        component: 'L298N Right Motor',
        signalPin: 'IN3, IN4, ENB',
        controllerPin: 'D7, D8, D11 (PWM)',
        notes: 'Share common GND between battery pack, L298N, and Arduino.',
      },
    ],
    steps: [
      'Assemble the 2WD chassis by bolting both yellow geared motors and mounting the rear caster wheel.',
      'Attach the left and right IR modules under the front bumper facing downward, ~1.5 cm above the ground.',
      'Wire both DC motors to the L298N OUT1–OUT4 screw terminals and connect the battery pack to +12V and GND.',
      'Connect the IR sensor outputs to Arduino digital pins 2 and 3, and motor control pins to D5–D8, D10, and D11.',
      'Place the robot over a white poster board with black tape and turn each IR potentiometer until the indicator LED turns off over black tape.',
      'Upload the sketch, disconnect USB, flip the battery switch, and test on an oval loop before trying sharp corners.',
    ],
    starterCode: `const int IR_LEFT = 2, IR_RIGHT = 3;
const int IN1 = 5, IN2 = 6, ENA = 10;
const int IN3 = 7, IN4 = 8, ENB = 11;

void setup() {
  pinMode(IR_LEFT, INPUT);
  pinMode(IR_RIGHT, INPUT);
  for (int p = 5; p <= 11; p++) pinMode(p, OUTPUT);
}

void setMotors(int leftSpd, int rightSpd) {
  digitalWrite(IN1, leftSpd >= 0); digitalWrite(IN2, leftSpd < 0);
  digitalWrite(IN3, rightSpd >= 0); digitalWrite(IN4, rightSpd < 0);
  analogWrite(ENA, abs(leftSpd));
  analogWrite(ENB, abs(rightSpd));
}

void loop() {
  bool leftBlack = digitalRead(IR_LEFT) == HIGH;
  bool rightBlack = digitalRead(IR_RIGHT) == HIGH;
  if (!leftBlack && !rightBlack) setMotors(165, 165);
  else if (leftBlack && !rightBlack) setMotors(60, 175);
  else if (!leftBlack && rightBlack) setMotors(175, 60);
  else setMotors(0, 0);
}`,
    codeLanguage: 'cpp',
    troubleshootingTips: [
      {
        issue: 'Robot spins in circles instead of following the tape.',
        solution: 'Swap the two wires of the motor spinning backward at the L298N terminal, or invert IN1/IN2 logic in code.',
      },
      {
        issue: 'IR sensors stay stuck on HIGH regardless of floor color.',
        solution: 'Adjust the blue trim potentiometer on the IR module slowly with a small screwdriver while holding it over white paper.',
      },
      {
        issue: 'Robot overshoots tight corners.',
        solution: 'Lower base PWM speed from 165 to 135 and widen the tape corner radius slightly.',
      },
    ],
  },
  {
    id: 'proj-obstacle-avoiding-robot',
    title: 'Obstacle Avoiding Robot',
    track: 'robotics',
    trackLabel: 'Robotics',
    category: 'Autonomous Rovers',
    difficulty: 'Beginner',
    ageRange: '10–15 yrs',
    duration: '2.5 hrs',
    summary:
      'Construct a self-navigating rover equipped with a front HC-SR04 ultrasonic sensor that measures distance in real time and steers around walls and furniture.',
    imageUrl: HERO_LAB_IMAGE,
    imageAlt: 'Obstacle Avoiding Robot rover with front ultrasonic sensor on lab table',
    learningObjectives: [
      'Measure real-time distance using ultrasonic echolocation timing (pulseIn).',
      'Program autonomous decision trees with stop, reverse, and turn maneuvers.',
      'Isolate motor power from microcontroller logic to prevent brownout resets.',
    ],
    materials: [
      'Arduino Uno + USB Cable',
      '2WD Rover Chassis & Geared Motors',
      'L298N Motor Driver Module',
      'HC-SR04 Ultrasonic Distance Sensor + Mounting Bracket',
      '6x AA Battery Holder & Female-to-Male Jumper Wires',
    ],
    circuitConnections: [
      {
        component: 'HC-SR04 Ultrasonic',
        signalPin: 'TRIG / ECHO',
        controllerPin: 'D9 / D10',
        notes: 'Power VCC from Arduino 5V and GND to common GND.',
      },
      {
        component: 'L298N Driver Inputs',
        signalPin: 'IN1–IN4',
        controllerPin: 'D4, D5, D6, D7',
        notes: 'Keep 5V jumper on L298N if powering Arduino from 5V regulator, or use separate USB/9V.',
      },
    ],
    steps: [
      'Mount the motors, wheels, and L298N board cleanly onto the rover chassis.',
      'Snap the HC-SR04 sensor into the front acrylic bracket facing straight ahead.',
      'Wire TRIG to pin 9, ECHO to pin 10, and connect the L298N control pins to D4–D7.',
      'Test distance readings in the Arduino Serial Monitor (9600 baud) with your hand at 10 cm, 25 cm, and 50 cm.',
      'Upload the full navigation sketch and verify the rover stops smoothly whenever an obstacle comes within 22 cm.',
    ],
    starterCode: `const int TRIG = 9, ECHO = 10;
const int IN1 = 4, IN2 = 5, IN3 = 6, IN4 = 7;

long readDistanceCm() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long duration = pulseIn(ECHO, HIGH, 25000);
  return duration == 0 ? 200 : (duration * 0.0343) / 2;
}

void loop() {
  long dist = readDistanceCm();
  if (dist < 22) {
    stopMotors(); delay(150);
    moveBackward(); delay(280);
    turnRight(); delay(420);
  } else {
    moveForward();
  }
}`,
    codeLanguage: 'cpp',
    troubleshootingTips: [
      {
        issue: 'Arduino reboots whenever the motors kick in.',
        solution: 'Fresh alkaline or rechargeable NiMH batteries are required; weak batteries drop voltage below 5V under motor load.',
      },
      {
        issue: 'Serial Monitor prints 0 cm continuously.',
        solution: 'Double-check that TRIG and ECHO wires are not swapped and add a 25000µs timeout to pulseIn.',
      },
    ],
  },
  {
    id: 'proj-smart-dustbin',
    title: 'Smart Dustbin',
    track: 'arduino',
    trackLabel: 'Arduino',
    category: 'Smart Automation',
    difficulty: 'Beginner',
    ageRange: '8–14 yrs',
    duration: '90 mins',
    summary:
      'Build a touchless automatic waste bin that detects your hand with an ultrasonic sensor and smoothly lifts the hinged lid using an SG90 micro servo.',
    imageUrl: SMART_DUSTBIN_IMAGE,
    imageAlt: 'Touchless ultrasonic Smart Dustbin prototype with SG90 servo and Arduino Uno',
    learningObjectives: [
      'Combine proximity sensing with angular servo actuation (Servo.h).',
      'Implement non-blocking cooldown delays so the lid stays open while hands are near.',
      'Build mechanical linkages using stiff wire or popsicle-stick horn extensions.',
    ],
    materials: [
      'Arduino Uno + USB Cable or 9V Battery Clip',
      'HC-SR04 Ultrasonic Sensor',
      'SG90 9g Micro Servo Motor',
      'Small Plastic Bin with Hinged Lid',
      'Breadboard, Jumper Wires & Stiff Craft Wire / Hot Glue',
    ],
    circuitConnections: [
      {
        component: 'HC-SR04 Sensor',
        signalPin: 'TRIG / ECHO',
        controllerPin: 'D9 / D10',
        notes: 'Mount on front face of bin below the lid rim.',
      },
      {
        component: 'SG90 Micro Servo',
        signalPin: 'Orange (Signal)',
        controllerPin: 'D6 (PWM)',
        notes: 'Red wire to 5V, Brown wire to GND.',
      },
    ],
    steps: [
      'Cut two neat holes or attach a front bracket on the bin for the HC-SR04 sensor.',
      'Mount the SG90 servo near the rear hinge of the lid and link the servo horn to the lid with stiff wire.',
      'Wire the ultrasonic sensor to pins 9 and 10, and the servo signal wire to pin 6.',
      'Test closed angle (15°) and open angle (105°) before gluing the horn so the servo never strains past its stop.',
      'Upload the sketch and wave your hand within 25 cm to watch the lid open for 3 seconds and close gently.',
    ],
    starterCode: `#include <Servo.h>
Servo lidServo;
const int TRIG = 9, ECHO = 10;

void setup() {
  lidServo.attach(6);
  lidServo.write(15);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
}

void loop() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long cm = (pulseIn(ECHO, HIGH, 20000) * 0.0343) / 2;
  if (cm > 0 && cm < 25) {
    lidServo.write(105);
    delay(3000);
    lidServo.write(15);
  }
  delay(100);
}`,
    codeLanguage: 'cpp',
    troubleshootingTips: [
      {
        issue: 'Servo buzzes loudly when the lid is closed.',
        solution: 'The closed target angle is pushing past the physical lid stop. Increase closed angle from 0° to 15° or reposition the servo horn.',
      },
      {
        issue: 'Lid opens randomly when nobody is nearby.',
        solution: 'Check that `cm > 0` is included in your condition so zero-timeout readings do not trigger the lid.',
      },
    ],
  },
  {
    id: 'proj-fire-detection-robot',
    title: 'Fire Detection Robot',
    track: 'robotics',
    trackLabel: 'Robotics',
    category: 'Autonomous Rovers',
    difficulty: 'Intermediate',
    ageRange: '11–16 yrs',
    duration: '3 hrs',
    summary:
      'Design an emergency responder rover using an IR flame sensor array to scan for candle-flame heat signatures, drive toward the source, and activate a 5V extinguishing fan.',
    imageUrl: FIRE_BOT_IMAGE,
    imageAlt: 'Fire Detection Robot car with front IR flame sensor array and mounted 5V fan',
    learningObjectives: [
      'Read multi-channel infrared flame sensors (760nm–1100nm wavelength).',
      'Drive a higher-current 5V DC fan safely using a transistor/relay switch.',
      'Coordinate multi-sensor scanning with autonomous approach and stop logic.',
    ],
    materials: [
      'Arduino Uno',
      '4WD or 2WD Robot Chassis + L298N Motor Driver',
      '3-Channel or 5-Channel IR Flame Sensor Module',
      '5V DC Cooling Fan + 1-Channel Relay or TIP122 Transistor',
      'Piezo Buzzer (Alert Siren)',
      'Battery Pack & Jumper Wires',
    ],
    circuitConnections: [
      {
        component: 'Flame Sensors (L/C/R)',
        signalPin: 'D0_L, D0_C, D0_R',
        controllerPin: 'A0, A1, A2',
        notes: 'Outputs LOW (or lower analog voltage) when infrared flame light is detected.',
      },
      {
        component: '5V Fan Relay',
        signalPin: 'IN',
        controllerPin: 'D12',
        notes: 'Never power a DC fan directly from an Arduino GPIO pin; switch via relay.',
      },
      {
        component: 'Piezo Buzzer',
        signalPin: '+',
        controllerPin: 'D13',
        notes: 'Sounds audible alert while extinguishing fan runs.',
      },
    ],
    steps: [
      'Assemble the robot chassis and mount the flame sensor bar across the front bumper.',
      'Mount the 5V DC fan upright on the top deck aimed straight forward toward candle height.',
      'Connect the fan through a 5V relay module controlled by pin 12, and wire the buzzer to pin 13.',
      'With adult supervision, test sensor detection using a small tealight candle at 40 cm distance.',
      'Verify the rover turns toward whichever side sensor sees the flame, stops 20 cm away, and blows out the candle.',
    ],
    starterCode: `const int FLAME_L = A0, FLAME_C = A1, FLAME_R = A2;
const int FAN_RELAY = 12, BUZZER = 13;

void loop() {
  int l = analogRead(FLAME_L);
  int c = analogRead(FLAME_C);
  int r = analogRead(FLAME_R);

  if (c < 350) {
    stopMotors();
    digitalWrite(FAN_RELAY, HIGH);
    tone(BUZZER, 1200, 400);
    delay(2500);
    digitalWrite(FAN_RELAY, LOW);
  } else if (l < 500) {
    turnLeft();
  } else if (r < 500) {
    turnRight();
  } else {
    stopMotors();
  }
}`,
    codeLanguage: 'cpp',
    troubleshootingTips: [
      {
        issue: 'Sunlight through a window triggers false alarms.',
        solution: 'Lower the analog threshold (e.g., from 500 to 300) or test away from direct afternoon sunlight, which contains strong IR.',
      },
      {
        issue: 'Fan spins slowly or not at all.',
        solution: 'Ensure the fan relay COM/NO terminals connect to the battery 5V rail rather than the low-current Arduino I/O pin.',
      },
    ],
  },
  {
    id: 'proj-robotic-arm',
    title: 'Robotic Arm',
    track: 'arduino',
    trackLabel: 'Arduino',
    category: 'Robotic Actuators',
    difficulty: 'Intermediate',
    ageRange: '11–16 yrs',
    duration: '3.5 hrs',
    summary:
      'Assemble a 4-DOF (Degree of Freedom) desktop robotic arm with base rotation, shoulder, elbow, and claw servos controlled smoothly via dual joysticks or automated sequences.',
    imageUrl: AI_VISION_IMAGE,
    imageAlt: 'Desktop 4-DOF Robotic Arm sorting colored blocks on workbench',
    learningObjectives: [
      'Understand degrees of freedom (base yaw, shoulder pitch, elbow pitch, gripper).',
      'Interpolate servo angles step-by-step for smooth, jerk-free mechanical motion.',
      'Power multiple servos safely using a dedicated external 5V 2A supply.',
    ],
    materials: [
      'Arduino Uno',
      '4-DOF Robotic Arm Frame Kit (Acrylic or Aluminum)',
      '4x SG90 or MG90S Metal-Gear Servos',
      '2x Analog Thumb Joystick Modules (or 4x Potentiometers)',
      'External 5V 2A Power Supply + Breadboard',
    ],
    circuitConnections: [
      {
        component: 'Base / Shoulder / Elbow / Claw Servos',
        signalPin: 'Signal Wires',
        controllerPin: 'D3, D5, D6, D9',
        notes: 'Power all 4 servo red wires from external 5V 2A supply; connect grounds together.',
      },
      {
        component: 'Joystick 1 (X, Y)',
        signalPin: 'VRx, VRy',
        controllerPin: 'A0, A1',
        notes: 'Controls base rotation and shoulder reach.',
      },
      {
        component: 'Joystick 2 (X, Y)',
        signalPin: 'VRx, VRy',
        controllerPin: 'A2, A3',
        notes: 'Controls elbow elevation and claw open/close.',
      },
    ],
    steps: [
      'Center every servo to 90° using a quick calibration sketch BEFORE screwing on the arm linkages.',
      'Assemble the rotating base, shoulder arm, elbow forearm, and parallel gripper claw.',
      'Wire the 4 servo power leads to an external 5V 2A rail (sharing GND with the Arduino).',
      'Wire both analog joysticks to analog pins A0–A3.',
      'Upload the smooth-stepping control sketch and practice picking up wooden blocks and placing them into cups.',
    ],
    starterCode: `#include <Servo.h>
Servo baseS, shoulderS, elbowS, clawS;
int angles[4] = {90, 90, 90, 60};

void setup() {
  baseS.attach(3); shoulderS.attach(5);
  elbowS.attach(6); clawS.attach(9);
}

void updateAxis(int pin, int idx, int minA, int maxA) {
  int val = analogRead(pin);
  if (val > 650 && angles[idx] < maxA) angles[idx] += 2;
  if (val < 380 && angles[idx] > minA) angles[idx] -= 2;
}

void loop() {
  updateAxis(A0, 0, 10, 170);
  updateAxis(A1, 1, 30, 150);
  updateAxis(A2, 2, 30, 150);
  updateAxis(A3, 3, 25, 110);
  baseS.write(angles[0]); shoulderS.write(angles[1]);
  elbowS.write(angles[2]); clawS.write(angles[3]);
  delay(25);
}`,
    codeLanguage: 'cpp',
    troubleshootingTips: [
      {
        issue: 'Arm shakes violently or resets when lifting an object.',
        solution: 'USB power cannot supply 4 servos at once. Connect an external 5V 2A battery pack or adapter to the servo rail.',
      },
      {
        issue: 'Claw motor stalls and gets warm.',
        solution: 'Restrict the claw closed limit (`minA`) so the jaws press firmly without crushing past mechanical contact.',
      },
    ],
  },
  {
    id: 'proj-smart-parking-system',
    title: 'Smart Parking System',
    track: 'arduino',
    trackLabel: 'Arduino',
    category: 'Smart Automation',
    difficulty: 'Beginner',
    ageRange: '9–14 yrs',
    duration: '2 hrs',
    summary:
      'Create an automated parking garage gate with entry/exit IR sensors, a servo barrier arm, and green/red LED indicators tracking open parking spots.',
    imageUrl: ARDUINO_IMAGE,
    imageAlt: 'Arduino Uno connected to breadboard indicator LEDs and servo barrier arm',
    learningObjectives: [
      'Track state counters (available parking slots) using entry and exit sensor events.',
      'Prevent double-counting cars with edge-detection state flags.',
      'Control a servo barrier gate and dual status LEDs simultaneously.',
    ],
    materials: [
      'Arduino Uno',
      '2x IR Obstacle Avoidance Sensors (Entry & Exit)',
      '1x SG90 Micro Servo (Barrier Gate)',
      'Green LED & Red LED + 2x 220Ω Resistors',
      'Cardboard Parking Lot Base + Toy Cars',
    ],
    circuitConnections: [
      {
        component: 'Entry / Exit IR Sensors',
        signalPin: 'OUT',
        controllerPin: 'D2 (Entry), D3 (Exit)',
        notes: 'Outputs LOW when a toy car passes in front of the sensor.',
      },
      {
        component: 'Barrier Gate Servo',
        signalPin: 'Signal',
        controllerPin: 'D6',
        notes: '0° = Gate Closed, 90° = Gate Open.',
      },
      {
        component: 'Status LEDs',
        signalPin: 'Anode (+)',
        controllerPin: 'D11 (Green), D12 (Red)',
        notes: 'Connect cathodes to GND through 220Ω resistors.',
      },
    ],
    steps: [
      'Build a compact cardboard garage gate and mount the SG90 servo with a striped paper barrier arm.',
      'Place one IR sensor before the entry gate and the second IR sensor at the exit lane.',
      'Wire the green and red LEDs to pins 11 and 12 with 220Ω resistors to indicate Open vs. Lot Full.',
      'Upload the slot-counting sketch with `totalSlots = 4` and roll toy cars through to watch the gate respond and block entry when full.',
    ],
    starterCode: `#include <Servo.h>
Servo gate;
int freeSlots = 4;
const int ENTRY_IR = 2, EXIT_IR = 3, GREEN_LED = 11, RED_LED = 12;

void loop() {
  digitalWrite(GREEN_LED, freeSlots > 0);
  digitalWrite(RED_LED, freeSlots == 0);

  if (digitalRead(ENTRY_IR) == LOW && freeSlots > 0) {
    freeSlots--;
    gate.write(90); delay(2000); gate.write(0);
  }
  if (digitalRead(EXIT_IR) == LOW && freeSlots < 4) {
    freeSlots++;
    gate.write(90); delay(2000); gate.write(0);
  }
}`,
    codeLanguage: 'cpp',
    troubleshootingTips: [
      {
        issue: 'Slot counter drops by 2 or 3 for a single slow car.',
        solution: 'Wait until `digitalRead(ENTRY_IR) == HIGH` (car completely cleared sensor) before closing the gate and resuming loop.',
      },
      {
        issue: 'Gate opens upside-down.',
        solution: 'Swap `gate.write(90)` and `gate.write(0)` or remount the paper arm horizontally at 0°.',
      },
    ],
  },
  {
    id: 'proj-bluetooth-controlled-robot',
    title: 'Bluetooth Controlled Robot',
    track: 'robotics',
    trackLabel: 'Robotics',
    category: 'Wireless & Voice',
    difficulty: 'Intermediate',
    ageRange: '11–16 yrs',
    duration: '2.5 hrs',
    summary:
      'Add wireless smartphone control to a wheeled rover using an HC-05 Bluetooth module and serial command parsing for Forward, Reverse, Left, Right, and Stop.',
    imageUrl: DELIVERY_BOT_IMAGE,
    imageAlt: 'Wireless Bluetooth Controlled Robot chassis with onboard transceiver module',
    learningObjectives: [
      'Establish wireless UART serial communication at 9600 baud via HC-05 Bluetooth.',
      'Use a voltage divider (1kΩ + 2kΩ) to protect the 3.3V HC-05 RX pin.',
      'Decode single-character directional commands cleanly inside loop().',
    ],
    materials: [
      'Arduino Uno',
      '2WD or 4WD Robot Chassis + L298N Motor Driver',
      'HC-05 or HC-06 Bluetooth Serial Module',
      '1kΩ and 2kΩ Resistors (for RX voltage divider)',
      'Battery Pack & Smartphone Bluetooth Controller App',
    ],
    circuitConnections: [
      {
        component: 'HC-05 Bluetooth TX',
        signalPin: 'TXD',
        controllerPin: 'D0 (RX) or SoftwareSerial D2',
        notes: 'Disconnect TX/RX from D0/D1 while uploading code via USB!',
      },
      {
        component: 'HC-05 Bluetooth RX',
        signalPin: 'RXD',
        controllerPin: 'D1 (TX) via 1kΩ/2kΩ divider',
        notes: 'Steps 5V Arduino TX down to safe 3.3V logic.',
      },
      {
        component: 'L298N Motors',
        signalPin: 'IN1–IN4',
        controllerPin: 'D5, D6, D7, D8',
        notes: 'Drives left and right motor pairs.',
      },
    ],
    steps: [
      'Wire the L298N motor driver and chassis motors first and test forward/reverse motion.',
      'Build the 1kΩ / 2kΩ resistor divider on the breadboard for the HC-05 RX pin.',
      'Upload the Bluetooth command sketch BEFORE plugging in the HC-05 TX/RX pins to D0/D1.',
      'Connect the HC-05 module, power the rover from batteries, and pair with `HC-05` (PIN `1234` or `0000`).',
      'Send `F`, `B`, `L`, `R`, and `S` from your Bluetooth controller app to steer across the room.',
    ],
    starterCode: `char cmd = 'S';
void setup() {
  Serial.begin(9600);
  for (int p = 5; p <= 8; p++) pinMode(p, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    cmd = Serial.read();
    if (cmd == 'F') moveForward();
    else if (cmd == 'B') moveBackward();
    else if (cmd == 'L') turnLeft();
    else if (cmd == 'R') turnRight();
    else if (cmd == 'S') stopMotors();
  }
}`,
    codeLanguage: 'cpp',
    troubleshootingTips: [
      {
        issue: 'Arduino IDE fails with "avrdude: stk500_recv()" during upload.',
        solution: 'Unplug the HC-05 TX/RX wires from pins 0 and 1 while uploading code, then reconnect them afterward.',
      },
      {
        issue: 'Robot connects over Bluetooth but ignores button presses.',
        solution: 'Confirm baud rate is 9600 and check whether your app sends lowercase (`f`) vs uppercase (`F`) letters.',
      },
    ],
  },
  {
    id: 'proj-smart-home-automation',
    title: 'Smart Home Automation',
    track: 'arduino',
    trackLabel: 'Arduino',
    category: 'Smart Automation',
    difficulty: 'Intermediate',
    ageRange: '11–16 yrs',
    duration: '3 hrs',
    summary:
      'Wire a miniature smart house diorama with automated porch lighting (LDR photoresistor), temperature-triggered cooling fan, and Bluetooth/Serial room light switching.',
    imageUrl: SMART_HOME_IMAGE,
    imageAlt: 'Wooden Smart Home Automation model wired with Arduino, DHT11 sensor, and relay lights',
    learningObjectives: [
      'Read environmental sensors (LDR light level + DHT11 temperature).',
      'Switch room lighting and fan circuits using low-voltage relay channels.',
      'Combine automatic sensor rules with manual override commands.',
    ],
    materials: [
      'Arduino Uno',
      'Miniature Cardboard or Laser-Cut House Diorama',
      'DHT11 Temperature & Humidity Sensor',
      'LDR Photoresistor + 10kΩ Resistor',
      '2-Channel 5V Relay Module + Warm LED Strips / 5V Fan',
    ],
    circuitConnections: [
      {
        component: 'LDR Light Divider',
        signalPin: 'Analog Out',
        controllerPin: 'A0',
        notes: 'Turns on porch LEDs automatically when room darkens.',
      },
      {
        component: 'DHT11 Sensor',
        signalPin: 'DATA',
        controllerPin: 'D4',
        notes: 'Reads room temperature in °C every 2 seconds.',
      },
      {
        component: 'Relay Channel 1 & 2',
        signalPin: 'IN1 (Lights), IN2 (Fan)',
        controllerPin: 'D7, D8',
        notes: 'Keep all diorama circuits strictly 5V DC for student safety.',
      },
    ],
    steps: [
      'Route warm 5V LED strips along the living room and bedroom ceilings of your model house.',
      'Mount the LDR near the front window and the DHT11 sensor inside the main room.',
      'Wire Relay IN1 to pin 7 (porch/room lights) and Relay IN2 to pin 8 (5V ceiling fan).',
      'Upload the automation sketch and test by covering the LDR with your hand and warming the DHT11 slightly.',
    ],
    starterCode: `const int LDR_PIN = A0, RELAY_LIGHTS = 7, RELAY_FAN = 8;
float currentTempC = 24.5;

void loop() {
  int lightLevel = analogRead(LDR_PIN);
  // Auto porch light when dark
  digitalWrite(RELAY_LIGHTS, lightLevel < 350 ? LOW : HIGH);

  // Auto cooling fan above 27C
  digitalWrite(RELAY_FAN, currentTempC >= 27.0 ? LOW : HIGH);
  delay(500);
}`,
    codeLanguage: 'cpp',
    troubleshootingTips: [
      {
        issue: 'Relay switches ON when the code writes LOW instead of HIGH.',
        solution: 'Most 5V Arduino relay boards are active-LOW. Swap HIGH and LOW in your `digitalWrite` calls if inverted.',
      },
      {
        issue: 'Porch light flickers rapidly at dusk threshold.',
        solution: 'Add hysteresis: turn ON below 320 and turn OFF only above 380.',
      },
    ],
  },
  {
    id: 'proj-voice-controlled-robot',
    title: 'Voice Controlled Robot',
    track: 'ai-ml',
    trackLabel: 'AI & ML',
    category: 'Wireless & Voice',
    difficulty: 'Advanced',
    ageRange: '12–16 yrs',
    duration: '3 hrs',
    summary:
      'Turn spoken phrases like "Move forward", "Turn left", and "Stop" into real rover movements using a speech-to-text bridge and HC-05 Bluetooth command parser.',
    imageUrl: HERO_LAB_IMAGE,
    imageAlt: 'Voice Controlled Robot workstation with laptop speech bridge and wheeled rover',
    learningObjectives: [
      'Map natural-language spoken commands into structured motor action tokens.',
      'Parse multi-word serial strings cleanly with `Serial.readStringUntil()` in Arduino.',
      'Design safe fallback stops when speech recognition returns an unknown phrase.',
    ],
    materials: [
      'Arduino Uno + 2WD Rover Chassis + L298N Driver',
      'HC-05 Bluetooth Module',
      'Smartphone Voice-to-Bluetooth App or Python Speech Script',
      'Battery Pack & Jumper Wires',
    ],
    circuitConnections: [
      {
        component: 'HC-05 Bluetooth',
        signalPin: 'TXD / RXD',
        controllerPin: 'D2 (SW RX) / D3 (SW TX)',
        notes: 'Using SoftwareSerial leaves USB Serial Monitor free for live debugging!',
      },
      {
        component: 'L298N Motor Driver',
        signalPin: 'IN1–IN4',
        controllerPin: 'D5, D6, D7, D8',
        notes: 'Standard left/right motor direction control.',
      },
    ],
    steps: [
      'Assemble the wheeled rover and wire the L298N motor inputs to pins 5–8.',
      'Connect the HC-05 module to SoftwareSerial pins 2 and 3 (using the 1kΩ/2kΩ divider on RX).',
      'Upload the string-parsing sketch and open the Serial Monitor at 9600 baud to inspect incoming voice transcripts.',
      'Speak "forward", "turn left", "turn right", or "stop" into your voice app and verify instant rover response.',
    ],
    starterCode: `#include <SoftwareSerial.h>
SoftwareSerial bt(2, 3); // RX, TX

void setup() {
  Serial.begin(9600);
  bt.begin(9600);
}

void loop() {
  if (bt.available()) {
    String phrase = bt.readStringUntil('\\n');
    phrase.trim();
    phrase.toLowerCase();
    Serial.println("Heard: " + phrase);

    if (phrase.indexOf("forward") >= 0) moveForward();
    else if (phrase.indexOf("left") >= 0) { turnLeft(); delay(450); stopMotors(); }
    else if (phrase.indexOf("right") >= 0) { turnRight(); delay(450); stopMotors(); }
    else if (phrase.indexOf("stop") >= 0) stopMotors();
  }
}`,
    codeLanguage: 'cpp',
    troubleshootingTips: [
      {
        issue: 'Rover delays 1 full second before reacting to "stop".',
        solution: 'Call `bt.setTimeout(60)` in `setup()` so `readStringUntil` does not wait a full 1000ms for newline characters.',
      },
      {
        issue: 'Commands fail due to capitalization like "Forward".',
        solution: 'Always call `phrase.toLowerCase()` before matching keywords.',
      },
    ],
  },
  {
    id: 'proj-mini-delivery-robot',
    title: 'Mini Delivery Robot',
    track: 'robotics',
    trackLabel: 'Robotics',
    category: 'Autonomous Rovers',
    difficulty: 'Advanced',
    ageRange: '12–16 yrs',
    duration: '4 hrs',
    summary:
      'Engineer a classroom cargo rover that follows a taped hallway route to Desk A or Desk B, pauses for obstacles with ultrasonic safety, and chimes when your parcel arrives.',
    imageUrl: DELIVERY_BOT_IMAGE,
    imageAlt: 'Mini Delivery Robot carrying a parcel tray with front ultrasonic sensor',
    learningObjectives: [
      'Combine IR line tracking with ultrasonic safety overrides in a priority state machine.',
      'Detect payload presence using an ultrasonic or limit switch in the cargo tray.',
      'Coordinate multi-sensor hardware (motors, IR sensors, ultrasonic, and arrival buzzer).',
    ],
    materials: [
      '4WD Robot Chassis with Cargo Tray Top Plate',
      'Arduino Uno + L298N Motor Driver',
      '2x IR Line Tracking Sensors',
      'HC-SR04 Ultrasonic Sensor (Obstacle Guard)',
      'Piezo Buzzer & Green Arrival LED',
      '7.4V Li-Ion or 6x AA Battery Pack',
    ],
    circuitConnections: [
      {
        component: 'Dual IR Trackers',
        signalPin: 'OUT_L / OUT_R',
        controllerPin: 'D2 / D3',
        notes: 'Follows hallway tape; both HIGH marks a station stop bar.',
      },
      {
        component: 'HC-SR04 Front Guard',
        signalPin: 'TRIG / ECHO',
        controllerPin: 'D9 / D10',
        notes: 'Pauses rover safely if a student steps in front of it.',
      },
      {
        component: 'Arrival Buzzer & LED',
        signalPin: 'Buzzer / LED',
        controllerPin: 'D12 / D13',
        notes: 'Alerts the recipient when the delivery reaches the station bar.',
      },
    ],
    steps: [
      'Mount the 4 motors and attach a flat cardboard or 3D-printed cargo tray onto the top deck.',
      'Install the dual IR sensors underneath the front edge and the HC-SR04 sensor on the front bumper.',
      'Lay down a black tape hallway path with a perpendicular black cross-bar at the delivery destination.',
      'Upload the priority state-machine code: Ultrasonic Obstacle Guard runs first, then IR line tracking, then Station Arrival chime.',
      'Place a small notebook or pencil box in the tray and test stopping safely when someone walks across its path.',
    ],
    starterCode: `const int TRIG = 9, ECHO = 10, IR_L = 2, IR_R = 3, BUZZER = 12;

void loop() {
  if (readUltrasonicCm(TRIG, ECHO) < 25) {
    stopMotors(); // Priority 1: Safety pause
    return;
  }
  bool L = digitalRead(IR_L) == HIGH;
  bool R = digitalRead(IR_R) == HIGH;
  if (L && R) {
    stopMotors(); // Priority 2: Reached delivery cross-bar
    tone(BUZZER, 880, 300);
    delay(4000);
  } else if (!L && !R) driveForward(155);
  else if (L) steerLeft();
  else steerRight();
}`,
    codeLanguage: 'cpp',
    troubleshootingTips: [
      {
        issue: 'Rover misses the station cross-bar while driving fast.',
        solution: 'Use wider 4 cm black tape for the station stop bar and keep cruise speed around 150 PWM.',
      },
      {
        issue: 'Heavy cargo causes the rover to drift sideways.',
        solution: 'Center the payload box directly over the middle of the 4 wheels for balanced traction.',
      },
    ],
  },
  {
    id: 'proj-scratch-space-dash',
    title: 'Orbital Rescue Arcade in Scratch',
    track: 'scratch',
    trackLabel: 'Scratch',
    category: 'Coding & AI',
    difficulty: 'Beginner',
    ageRange: '8–12 yrs',
    duration: '75 mins',
    summary:
      'Code a space rover rescue game using arrow-key physics, cloned meteor hazards, and fuel-cell pickups.',
    imageUrl: HERO_LAB_IMAGE,
    imageAlt: 'Visual block coding workspace next to STEM hardware',
    learningObjectives: [
      'Use X/Y stage coordinates and smooth velocity loops.',
      'Spawn and clean up cloned obstacles without hitting clone limits.',
      'Track player score and shields using Scratch variables.',
    ],
    materials: [
      'Web Browser with Scratch / Block Editor',
      'Rover & Meteor Custom Sprites',
      'Score & Shields Variables',
    ],
    circuitConnections: [],
    steps: [
      'Create a Rover sprite and bind Left/Right arrow keys to smooth X-axis gliding.',
      'Add a Fuel Cell sprite that spawns at random X positions every 2 seconds.',
      'Clone Meteor sprites from Y = 180 and end the round if Shields reach 0.',
      'Add a high-score variable and victory sound effect at 15 fuel cells collected.',
    ],
    starterCode: `when [green flag] clicked
set [Fuel] to (0)
set [Shields] to (3)
forever
  if <touching [FuelCell]?> then
    change [Fuel] by (1)
    start sound [collect]
  end
end`,
    codeLanguage: 'scratch',
    troubleshootingTips: [
      {
        issue: 'Meteors stop spawning after 1 minute of play.',
        solution: 'Make sure every meteor clone ends with `delete this clone` once it reaches the bottom edge.',
      },
    ],
  },
  {
    id: 'proj-python-weather-station',
    title: 'Python Classroom Telemetry Logger',
    track: 'python',
    trackLabel: 'Python',
    category: 'Coding & AI',
    difficulty: 'Intermediate',
    ageRange: '11–16 yrs',
    duration: '90 mins',
    summary:
      'Analyze temperature and humidity streams in Python, flag comfort thresholds, and compute rolling averages.',
    imageUrl: ARDUINO_IMAGE,
    imageAlt: 'Microcontroller circuit for sensor logging',
    learningObjectives: [
      'Process numerical sensor lists using Python comprehensions.',
      'Compute rolling averages and detect threshold alerts cleanly.',
    ],
    materials: [
      'Python 3 Environment',
      'Sample Sensor CSV / JSON Stream',
      'Optional DHT11 Sensor via Serial USB',
    ],
    circuitConnections: [],
    steps: [
      'Load hourly classroom temperature and humidity readings into a list.',
      'Write a loop that calculates minimum, maximum, and average temperature.',
      'Flag any hour above 26°C with a ventilation reminder message.',
      'Export the clean summary report.',
    ],
    starterCode: `temps_c = [21.4, 22.0, 23.5, 26.4, 25.1, 22.8]
avg_temp = sum(temps_c) / len(temps_c)
alerts = [t for t in temps_c if t > 26.0]
print(f"Avg: {avg_temp:.1f}C | Alerts: {len(alerts)}")`,
    codeLanguage: 'python',
    troubleshootingTips: [
      {
        issue: 'ZeroDivisionError when sensor list is empty.',
        solution: 'Guard your average calculation with `if len(temps_c) > 0:` before dividing.',
      },
    ],
  },
];

export const CODING_CHALLENGES: CodingChallenge[] = [
  // ================= PYTHON CHALLENGES (5) =================
  {
    id: 'py-print-name',
    title: 'Print Your Name',
    track: 'python',
    trackLabel: 'Python',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    xpReward: 100,
    badgeTitle: 'First Output Badge',
    prompt:
      'Store your name and favorite STEM track inside Python variables, then display a personalized welcome message in the console.',
    learningObjectives: [
      'Create string variables using descriptive names.',
      'Display formatted text output using the Python `print()` function.',
      'Combine variables inside an f-string message.',
    ],
    instructions: [
      'Create a variable named `student_name` and assign your name inside quotes.',
      'Create a second variable named `favorite_track` (for example, `"Robotics"`).',
      'Use `print(f"Hello {student_name}! Welcome to {favorite_track}.")` to output your greeting.',
      'Run Check Solution or mark the challenge complete once your code prints the greeting.',
    ],
    starterCode: `# Step 1: Store your name in a variable
student_name = ""
favorite_track = "Robotics"

# Step 2: Print a greeting using print()`,
    codeLanguage: 'python',
    expectedKeywords: ['student_name', 'print'],
    hints: [
      'Strings in Python need quotes around them, like `student_name = "Alex"`.',
      'Put `f` right before the opening quote in `print(f"Hello {student_name}!")` so Python fills in your variable.',
    ],
    sampleSolution: `student_name = "Alex Rivera"
favorite_track = "Robotics"
print(f"Hello {student_name}! Welcome to {favorite_track}.")`,
  },
  {
    id: 'py-add-two-numbers',
    title: 'Add Two Numbers',
    track: 'python',
    trackLabel: 'Python',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    xpReward: 120,
    badgeTitle: 'Arithmetic Explorer',
    prompt:
      'Write a Python function `add_numbers(a, b)` that takes two numbers, adds them together, and returns the total.',
    learningObjectives: [
      'Define a reusable Python function with two parameters.',
      'Perform integer or decimal addition using the `+` operator.',
      'Return the computed sum cleanly with `return`.',
    ],
    instructions: [
      'Inspect the function signature `def add_numbers(a, b):`.',
      'Inside the function, compute `total = a + b`.',
      'Return `total` instead of `0`.',
      'Print the result of `add_numbers(14, 28)` to verify your output is `42`.',
    ],
    starterCode: `def add_numbers(a, b):
    # Add a and b and return the sum
    return 0

print(add_numbers(14, 28))`,
    codeLanguage: 'python',
    expectedKeywords: ['def add_numbers', 'a + b', 'return'],
    hints: [
      'Use the `+` operator to add the two parameters: `total = a + b`.',
      'You can write `return a + b` directly in one line inside the function.',
    ],
    sampleSolution: `def add_numbers(a, b):
    total = a + b
    return total

print(add_numbers(14, 28))`,
  },
  {
    id: 'py-find-even-odd',
    title: 'Find Even or Odd',
    track: 'python',
    trackLabel: 'Python',
    difficulty: 'Intermediate',
    estimatedMinutes: 15,
    xpReward: 150,
    badgeTitle: 'Modulo Detective',
    prompt:
      'Build a function `check_even_odd(number)` that uses the modulo operator `%` to return `"Even"` or `"Odd"` for any integer.',
    learningObjectives: [
      'Use the modulo operator `%` to check division remainders.',
      'Write an `if / else` conditional branch in Python.',
      'Return clear string classifications from a helper function.',
    ],
    instructions: [
      'Remember that an even number leaves a remainder of `0` when divided by `2` (`number % 2 == 0`).',
      'Write an `if number % 2 == 0:` branch that returns `"Even"`.',
      'Add an `else:` branch that returns `"Odd"`.',
      'Test your function with both an even number (`12`) and an odd number (`7`).',
    ],
    starterCode: `def check_even_odd(number):
    # Check if number % 2 equals 0
    pass

print(check_even_odd(12))
print(check_even_odd(7))`,
    codeLanguage: 'python',
    expectedKeywords: ['% 2', 'if', 'Even', 'Odd', 'return'],
    hints: [
      'Use double equals `==` for comparison: `if number % 2 == 0:`.',
      'Make sure `"Even"` and `"Odd"` are returned as strings, not just printed.',
    ],
    sampleSolution: `def check_even_odd(number):
    if number % 2 == 0:
        return "Even"
    else:
        return "Odd"

print(check_even_odd(12))
print(check_even_odd(7))`,
  },
  {
    id: 'py-multiplication-table',
    title: 'Multiplication Table',
    track: 'python',
    trackLabel: 'Python',
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    xpReward: 170,
    badgeTitle: 'Loop Builder',
    prompt:
      'Use a Python `for` loop with `range(1, 11)` to print the complete multiplication table for a chosen number `n`.',
    learningObjectives: [
      'Iterate over a sequence of integers using `for` and `range()`.',
      'Understand why `range(1, 11)` stops at `10`.',
      'Format clean equation strings inside a loop.',
    ],
    instructions: [
      'Define `print_table(n)` that accepts any integer `n`.',
      'Start a loop: `for i in range(1, 11):`.',
      'Inside the loop, calculate `product = n * i`.',
      'Print each line formatted like `5 x 1 = 5` through `5 x 10 = 50`.',
    ],
    starterCode: `def print_table(n):
    # Loop from 1 to 10 using range(1, 11)
    pass

print_table(5)`,
    codeLanguage: 'python',
    expectedKeywords: ['for', 'range(1, 11)', 'print'],
    hints: [
      'In Python, `range(start, stop)` excludes `stop`, so `range(1, 11)` counts `1, 2, ..., 10`.',
      'Inside the loop write: `print(f"{n} x {i} = {n * i}")`.',
    ],
    sampleSolution: `def print_table(n):
    for i in range(1, 11):
        print(f"{n} x {i} = {n * i}")

print_table(5)`,
  },
  {
    id: 'py-number-guessing-game',
    title: 'Number Guessing Game',
    track: 'python',
    trackLabel: 'Python',
    difficulty: 'Advanced',
    estimatedMinutes: 25,
    xpReward: 220,
    badgeTitle: 'Python Game Architect',
    prompt:
      'Program a number guessing loop using `random.randint(1, 20)`, a `while` loop, and `"Too high!"` / `"Too low!"` feedback until the player guesses the secret number.',
    learningObjectives: [
      'Import and use the built-in `random` module.',
      'Control repeated user turns with a `while` loop and `break`.',
      'Combine `if / elif / else` branches to guide the player toward the target.',
    ],
    instructions: [
      'Import `random` and generate `secret = random.randint(1, 20)`.',
      'Track attempts with a counter variable (`attempts = 0`).',
      'Inside a `while` loop, compare `guess` to `secret`.',
      'Print `"Too low!"` if `guess < secret`, `"Too high!"` if `guess > secret`, and congratulate the player before exiting with `break` when equal.',
    ],
    starterCode: `import random

secret = random.randint(1, 20)
attempts = 0

while True:
    guess = int(input("Guess a number (1-20): "))
    attempts += 1
    # Add if / elif / else comparisons below
    break`,
    codeLanguage: 'python',
    expectedKeywords: ['random', 'while', 'if', 'elif', 'secret'],
    hints: [
      'Compare `if guess < secret:` then `elif guess > secret:` and finally `else:` when they match.',
      'Only call `break` inside the `else:` block so the loop repeats until the player wins!',
    ],
    sampleSolution: `import random

secret = random.randint(1, 20)
attempts = 0

while True:
    guess = int(input("Guess a number (1-20): "))
    attempts += 1
    if guess < secret:
        print("Too low! Try again.")
    elif guess > secret:
        print("Too high! Try again.")
    else:
        print(f"Correct! You guessed {secret} in {attempts} attempts.")
        break`,
  },

  // ================= SCRATCH CHALLENGES (4) =================
  {
    id: 'scr-animate-sprite',
    title: 'Animate a Sprite',
    track: 'scratch',
    trackLabel: 'Scratch',
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    xpReward: 110,
    badgeTitle: 'Sprite Animator',
    prompt:
      'Make a Scratch character walk smoothly across the stage by switching costumes inside a `forever` loop and bouncing cleanly off the stage edges.',
    learningObjectives: [
      'Trigger sprite animations using `when green flag clicked`.',
      'Switch between sprite costumes with timed `wait` pauses.',
      'Keep sprites visible on stage using `if on edge, bounce`.',
    ],
    instructions: [
      'Choose a sprite that has at least two walking costumes (like the Cat or Robot sprite).',
      'Start the script with `when [green flag] clicked` and set rotation style to `left-right`.',
      'Place `move (10) steps`, `next costume`, `if on edge, bounce`, and `wait (0.15) seconds` inside a `forever` loop.',
      'Test your block sequence in the editor below or build it in Scratch, then verify or mark completed.',
    ],
    starterCode: `when [green flag] clicked
set rotation style [left-right v]
forever
  move (10) steps
  // Add costume switching, edge bounce, and a short wait`,
    codeLanguage: 'scratch',
    expectedKeywords: ['forever', 'next costume', 'bounce', 'wait'],
    hints: [
      'Without a `wait (0.15) seconds` block, the sprite switches costumes too fast for your eyes to follow.',
      'Setting rotation style to `left-right` keeps your character upright instead of walking upside down after bouncing.',
    ],
    sampleSolution: `when [green flag] clicked
set rotation style [left-right v]
forever
  move (10) steps
  next costume
  if on edge, bounce
  wait (0.15) seconds
end`,
  },
  {
    id: 'scr-create-maze',
    title: 'Create a Maze',
    track: 'scratch',
    trackLabel: 'Scratch',
    difficulty: 'Intermediate',
    estimatedMinutes: 22,
    xpReward: 160,
    badgeTitle: 'Maze Designer',
    prompt:
      'Build a playable Scratch maze game where arrow keys steer the player sprite, touching dark maze walls pushes the player back, and reaching the goal triggers a win.',
    learningObjectives: [
      'Control 4-direction sprite movement using `change x by` and `change y by`.',
      'Detect wall collisions with `touching color` sensing blocks.',
      'Reset player coordinates cleanly when starting or winning a level.',
    ],
    instructions: [
      'Paint a backdrop with solid dark blue maze walls and a bright green goal square.',
      'At `when [green flag] clicked`, send the player sprite to the starting corner (`go to x: -200 y: 140`).',
      'Inside `forever`, check the four arrow keys to move the sprite by 4 steps in each direction.',
      'Add `if <touching color [#1E3A8A]?> then` to undo the step so the player cannot walk through walls, and broadcast `[Level Won]` on touching the green goal.',
    ],
    starterCode: `when [green flag] clicked
go to x: (-200) y: (140)
forever
  if <key [right arrow v] pressed?> then
    change x by (4)
    // Undo move if touching maze wall color
  end
  // Add goal color check
end`,
    codeLanguage: 'scratch',
    expectedKeywords: ['touching color', 'change x by', 'broadcast'],
    hints: [
      'To stop a sprite from passing through a wall after `change x by (4)`, immediately run `change x by (-4)` if `touching color` is true.',
      'Keep the player sprite small (around 35% size) so it fits comfortably through maze corridors.',
    ],
    sampleSolution: `when [green flag] clicked
go to x: (-200) y: (140)
forever
  if <key [right arrow v] pressed?> then
    change x by (4)
    if <touching color [#1E3A8A]?> then
      change x by (-4)
    end
  end
  if <touching color [#10B981]?> then
    broadcast [Level Won v]
    stop [all v]
  end
end`,
  },
  {
    id: 'scr-catching-game',
    title: 'Create a Catching Game',
    track: 'scratch',
    trackLabel: 'Scratch',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    xpReward: 180,
    badgeTitle: 'Arcade Catcher',
    prompt:
      'Program an arcade catching game where falling stars spawn at random X coordinates from the top of the stage and increase your `Score` variable when caught.',
    learningObjectives: [
      'Use `pick random (-210) to (210)` for unpredictable falling objects.',
      'Track gameplay points using a `Score` variable.',
      'Handle object respawning when caught by the basket or hitting the floor.',
    ],
    instructions: [
      'Create a `Score` variable and set it to `0` when the green flag is clicked.',
      'Program the Basket sprite at `y: -145` to follow Left and Right arrow keys.',
      'On the Falling Star sprite, spawn at `y: 180` and `x: pick random (-210) to (210)`, then `change y by (-5)` in a loop.',
      'When `<touching [Basket v]?>`, run `change [Score v] by (1)`, play a chime sound, and respawn at the top.',
    ],
    starterCode: `when [green flag] clicked
set [Score v] to (0)
go to x: (pick random (-210) to (210)) y: (180)
forever
  change y by (-5)
  // Check if touching Basket or y position < -170
end`,
    codeLanguage: 'scratch',
    expectedKeywords: ['Score', 'pick random', 'touching', 'change y by'],
    hints: [
      'Use `if <(y position) < (-170)> then` to send missed stars back up to `y: 180` with a new random X value.',
      'Add a `start sound` block instead of `play sound until done` so the star does not pause mid-air.',
    ],
    sampleSolution: `when [green flag] clicked
set [Score v] to (0)
go to x: (pick random (-210) to (210)) y: (180)
forever
  change y by (-5)
  if <touching [Basket v]?> then
    change [Score v] by (1)
    start sound [collect v]
    go to x: (pick random (-210) to (210)) y: (180)
  end
  if <(y position) < (-170)> then
    go to x: (pick random (-210) to (210)) y: (180)
  end
end`,
  },
  {
    id: 'scr-quiz-game',
    title: 'Create a Quiz Game',
    track: 'scratch',
    trackLabel: 'Scratch',
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    xpReward: 220,
    badgeTitle: 'Scratch Quizmaster',
    prompt:
      'Design an interactive trivia host sprite in Scratch that asks questions with `ask ... and wait`, checks `answer`, updates a `Score`, and gives feedback.',
    learningObjectives: [
      'Collect typed player responses using `ask [question] and wait` and `(answer)`.',
      'Compare user responses with `if <(answer) = [correct]> then ... else`.',
      'Track total points and announce the final score at the end of the quiz.',
    ],
    instructions: [
      'Create a `Score` variable and reset it to `0` at the start.',
      'Use `ask [What sensor measures distance using sound waves?] and wait` to prompt the player.',
      'Check `if <(answer) = [ultrasonic]> then` to say `"Correct!"` and `change [Score v] by (1)`.',
      'In the `else` branch, explain the right answer, then repeat for 3+ STEM questions and announce the final score.',
    ],
    starterCode: `when [green flag] clicked
set [Score v] to (0)
ask [What sensor measures distance using sound waves?] and wait
// Check if answer equals ultrasonic`,
    codeLanguage: 'scratch',
    expectedKeywords: ['ask', 'answer', 'Score', 'if', 'say'],
    hints: [
      'Scratch string equality `<(answer) = [ultrasonic]>` is case-insensitive, so `"Ultrasonic"` and `"ultrasonic"` both match!',
      'Use `join [Final Score: ] (Score)` inside a `say` block at the end of your quiz.',
    ],
    sampleSolution: `when [green flag] clicked
set [Score v] to (0)
ask [What sensor measures distance using sound waves?] and wait
if <(answer) = [ultrasonic]> then
  say [Correct!] for (2) seconds
  change [Score v] by (1)
else
  say [Good try! The correct answer is ultrasonic.] for (2) seconds
end
say (join [Final Score: ] (Score)) for (3) seconds`,
  },

  // ================= ROBOTICS CHALLENGES (4) =================
  {
    id: 'rob-sensor-identification',
    title: 'Sensor Identification Challenge',
    track: 'robotics',
    trackLabel: 'Robotics',
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    xpReward: 120,
    badgeTitle: 'Sensor Specialist',
    prompt:
      'Match each real-world robotics mission (distance, line tracking, flame detection, soil moisture) to the right hardware sensor in a lookup function.',
    learningObjectives: [
      'Distinguish ultrasonic, infrared reflectance, flame IR, and moisture sensors.',
      'Map hardware tasks to sensor inputs cleanly in code.',
      'Explain why selecting the right sensor prevents false readings.',
    ],
    instructions: [
      'Review the four mission strings: `"distance"`, `"line"`, `"fire"`, and `"moisture"`.',
      'Complete `identify_sensor(mission)` so `"distance"` returns `"HC-SR04 Ultrasonic"`.',
      'Map `"line"` to `"IR Reflectance Sensor"`, `"fire"` to `"IR Flame Sensor"`, and `"moisture"` to `"Soil Moisture Probe"`.',
      'Test your mapping and check off the Sensor Identification Challenge.',
    ],
    starterCode: `def identify_sensor(mission):
    sensors = {
        "distance": "HC-SR04 Ultrasonic",
        # Add "line", "fire", and "moisture" sensor mappings
    }
    return sensors.get(mission, "Unknown Sensor")`,
    codeLanguage: 'python',
    expectedKeywords: ['HC-SR04', 'IR', 'flame', 'moisture'],
    hints: [
      'Black tape vs white floor contrast uses an `"IR Reflectance Sensor"`.',
      'Add `"fire": "IR Flame Sensor"` and `"moisture": "Soil Moisture Probe"` inside the `sensors` dictionary.',
    ],
    sampleSolution: `def identify_sensor(mission):
    sensors = {
        "distance": "HC-SR04 Ultrasonic",
        "line": "IR Reflectance Sensor",
        "fire": "IR Flame Sensor",
        "moisture": "Soil Moisture Probe",
    }
    return sensors.get(mission, "Unknown Sensor")`,
  },
  {
    id: 'rob-motor-control',
    title: 'Motor Control Challenge',
    track: 'robotics',
    trackLabel: 'Robotics',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    xpReward: 160,
    badgeTitle: 'Motor Driver Pro',
    prompt:
      'Write safe Arduino L298N motor driver logic `driveMotor(int speed)` that clamps PWM values between 0 and 255 and drives direction pins `IN1` and `IN2`.',
    learningObjectives: [
      'Control motor speed safely using 8-bit PWM (`analogWrite` 0–255).',
      'Set H-bridge direction pins (`IN1 = HIGH`, `IN2 = LOW`) for forward spin.',
      'Clamp out-of-range speeds so motors receive valid PWM signals.',
    ],
    instructions: [
      'Define `driveMotor(int speed)` with `ENA = 5`, `IN1 = 6`, and `IN2 = 7`.',
      'Clamp `speed` with `constrain(speed, 0, 255)` so it never exceeds 255.',
      'Set `digitalWrite(IN1, HIGH)` and `digitalWrite(IN2, LOW)` for forward motion.',
      'Send the PWM speed using `analogWrite(ENA, safeSpeed)`.',
    ],
    starterCode: `const int ENA = 5, IN1 = 6, IN2 = 7;

void driveMotor(int speed) {
  int safeSpeed = constrain(speed, 0, 255);
  // Set IN1/IN2 direction pins and call analogWrite on ENA
}`,
    codeLanguage: 'cpp',
    expectedKeywords: ['constrain', 'digitalWrite', 'analogWrite', 'IN1', 'IN2'],
    hints: [
      'To spin forward on an L298N channel, set one input `HIGH` and the other `LOW`.',
      'Write `analogWrite(ENA, safeSpeed);` to apply the clamped speed.',
    ],
    sampleSolution: `const int ENA = 5, IN1 = 6, IN2 = 7;

void driveMotor(int speed) {
  int safeSpeed = constrain(speed, 0, 255);
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, safeSpeed);
}`,
  },
  {
    id: 'rob-movement-challenge',
    title: 'Robot Movement Challenge',
    track: 'robotics',
    trackLabel: 'Robotics',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    xpReward: 180,
    badgeTitle: 'Differential Pilot',
    prompt:
      'Program a differential-drive rover navigation routine `steer_rover(command)` that outputs left and right wheel speeds for `"FORWARD"`, `"LEFT"`, `"RIGHT"`, and `"STOP"`.',
    learningObjectives: [
      'Understand differential-drive wheel speed pairs `(left_pwm, right_pwm)`.',
      'Execute crisp in-place turns by reversing one wheel relative to the other.',
      'Implement deterministic stop behavior for safe testing.',
    ],
    instructions: [
      'Handle `"FORWARD"` by returning `(180, 180)` for equal forward wheel speed.',
      'Handle `"LEFT"` by spinning left wheel backward and right wheel forward: `(-160, 160)`.',
      'Handle `"RIGHT"` by returning `(160, -160)`.',
      'Handle `"STOP"` (and any unknown command) by returning `(0, 0)`.',
    ],
    starterCode: `def steer_rover(command):
    if command == "FORWARD":
        return (180, 180)
    # Add LEFT, RIGHT, and STOP commands
    return (0, 0)`,
    codeLanguage: 'python',
    expectedKeywords: ['FORWARD', 'LEFT', 'RIGHT', 'STOP', 'return'],
    hints: [
      'For an in-place right turn, the left wheel spins forward (`160`) and the right wheel spins backward (`-160`).',
      'Use `elif` statements for `"LEFT"`, `"RIGHT"`, and `"STOP"`.',
    ],
    sampleSolution: `def steer_rover(command):
    if command == "FORWARD":
        return (180, 180)
    elif command == "LEFT":
        return (-160, 160)
    elif command == "RIGHT":
        return (160, -160)
    elif command == "STOP":
        return (0, 0)
    return (0, 0)`,
  },
  {
    id: 'rob-obstacle-detection',
    title: 'Obstacle Detection Challenge',
    track: 'robotics',
    trackLabel: 'Robotics',
    difficulty: 'Advanced',
    estimatedMinutes: 25,
    xpReward: 230,
    badgeTitle: 'Obstacle Guardian',
    prompt:
      'Combine HC-SR04 ultrasonic echolocation math with a safety threshold check: convert `duration_us` to centimeters and return `"AVOID"` when distance is under 20 cm.',
    learningObjectives: [
      'Compute one-way distance in cm using `(duration_us * 0.0343) / 2`.',
      'Apply a safety threshold rule before driving forward.',
      'Protect hardware rovers from front collisions using priority guard checks.',
    ],
    instructions: [
      'Compute `distance_cm = (duration_us * 0.0343) / 2.0`.',
      'Check `if distance_cm < 20:` and return `"AVOID"`.',
      'Check `elif distance_cm < 40:` and return `"SLOW"` for caution speed.',
      'Otherwise return `"CLEAR"` so the rover cruises normally.',
    ],
    starterCode: `def obstacle_guard(duration_us):
    # Convert ultrasonic echo time to cm and check safety zones
    distance_cm = 0.0
    return "CLEAR"`,
    codeLanguage: 'python',
    expectedKeywords: ['0.0343', '2', '20', 'AVOID', 'return'],
    hints: [
      'Remember to divide by `2.0` because the sound wave travels out to the wall and bounces back.',
      'Place the `< 20` check before `< 40` so close obstacles always trigger `"AVOID"` first.',
    ],
    sampleSolution: `def obstacle_guard(duration_us):
    distance_cm = (duration_us * 0.0343) / 2.0
    if distance_cm < 20:
        return "AVOID"
    elif distance_cm < 40:
        return "SLOW"
    return "CLEAR"`,
  },
];

export const INITIAL_GALLERY_SUBMISSIONS: GallerySubmission[] = [
  {
    id: 'gal-1',
    title: 'Hallway Patrol Rover v2',
    studentName: 'Maya Chen',
    studentAge: 14,
    track: 'robotics',
    trackLabel: 'Robotics',
    description:
      'Added a servo-mounted ultrasonic scanner on top of my 2WD rover so it looks left and right before choosing the widest open path.',
    learningObjectives: [
      'Mount an ultrasonic sensor onto a sweeping SG90 micro servo.',
      'Compare left vs. right obstacle distances before steering.',
    ],
    componentsUsed: [
      'Arduino Uno',
      'HC-SR04 Ultrasonic Sensor',
      'SG90 Micro Servo',
      'L298N Motor Driver',
      '2WD Rover Chassis',
    ],
    imageUrl: ROVER_IMAGE,
    likes: 28,
    submittedAt: '2 days ago',
    codeHighlight: 'lookLeft(); lookRight(); chooseWidestPath();',
  },
  {
    id: 'gal-2',
    title: 'Automated Plant Moisture Alert',
    studentName: 'Leo Park',
    studentAge: 12,
    track: 'arduino',
    trackLabel: 'Arduino',
    description:
      'Built a breadboard monitor with green and amber LEDs that lights amber when our classroom fern soil drops below 35% moisture.',
    learningObjectives: [
      'Read continuous analog moisture values using analogRead(A0).',
      'Map sensor readings into a 0–100% threshold alert.',
    ],
    componentsUsed: [
      'Arduino Uno',
      'Capacitive Soil Moisture Sensor',
      'Green & Amber LEDs',
      '2x 220Ω Resistors',
      'Breadboard',
    ],
    imageUrl: ARDUINO_IMAGE,
    likes: 19,
    submittedAt: '4 days ago',
    codeHighlight: 'if (moisturePct < 35) digitalWrite(AMBER_LED, HIGH);',
  },
  {
    id: 'gal-3',
    title: 'Lego Brick Color Sorter',
    studentName: 'Priya Nair',
    studentAge: 15,
    track: 'ai-ml',
    trackLabel: 'AI & ML',
    description:
      'Trained a 3-class geometric block classifier with 120 overhead snapshots and paired it with a smooth servo arm chute.',
    learningObjectives: [
      'Collect balanced training images across three brick colors.',
      'Gate robotic actuator movement behind an 85% confidence threshold.',
    ],
    componentsUsed: [
      'USB Webcam',
      'Python Classifier Script',
      'Arduino Uno',
      'SG90 Chute Servo',
      'Cardboard Sorting Ramp',
    ],
    imageUrl: AI_VISION_IMAGE,
    likes: 34,
    submittedAt: '1 week ago',
    codeHighlight: 'if confidence >= 0.85: move_chute(predicted_shape)',
  },
  {
    id: 'gal-4',
    title: 'Mars Lander Physics Game',
    studentName: 'Alex Rivera',
    studentAge: 13,
    track: 'scratch',
    trackLabel: 'Scratch',
    description:
      'Programmed vertical thruster physics and fuel management in Scratch blocks so players must land softly under 4 m/s.',
    learningObjectives: [
      'Simulate downward gravity and upward thruster velocity in Scratch.',
      'Check safe landing speed using absolute value comparisons.',
    ],
    componentsUsed: [
      'Scratch 3 Stage & Lander Sprite',
      'yVelocity & Fuel Variables',
      'Up-Arrow Thruster Events',
      'Landing Pad Color Sensor',
    ],
    imageUrl: HERO_LAB_IMAGE,
    likes: 22,
    submittedAt: '1 week ago',
    codeHighlight: 'if <(abs of (yVelocity)) < 4> then broadcast [Safe Landing]',
    isOwner: true,
  },
];
