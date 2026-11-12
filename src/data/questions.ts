/**
 * AUTHORITATIVE MULTIPLE-CHOICE CONTENT — ITEMS 1–20
 *
 * The `question` and `answer` fields preserve the supplied examination
 * material. Distractors were written only to complete each four-choice item;
 * they are never presented as part of the original answer key.
 *
 * Do not reorder, merge, remove, or reword the supplied questions.
 */
export interface Question {
  id: number
  question: string
  answer: string
  distractors: [string, string, string]
  explanation: string
}

export const questions: Question[] = [
  {
    id: 1,
    question: 'What is the meaning of Hard real-time?',
    answer: 'Missing a deadline is a system failure, even once.',
    distractors: [
      'Missing a deadline only lowers the quality of the output.',
      'The system has no deadlines and runs whenever data arrives.',
      'A deadline may be missed as long as the average response time is acceptable.',
    ],
    explanation:
      'In a hard real-time system, every deadline is mandatory. A single missed deadline is treated as a failure, unlike soft real-time systems where late output can still be useful.',
  },
  {
    id: 2,
    question: 'Example of Soft real-time?',
    answer: 'Video streaming/media playback; non-critical display updates.',
    distractors: [
      'Airbag deployment during a collision.',
      'A pacemaker delivering a heartbeat on time.',
      'Anti-lock braking that must respond before wheel slip becomes critical.',
    ],
    explanation:
      'Soft real-time tasks can tolerate occasional delay without catastrophic consequences. Video playback and non-critical display updates are typical examples.',
  },
  {
    id: 3,
    question: 'What is Response time?',
    answer: 'Time from the event to the completed output.',
    distractors: [
      'The difference between the deadline and the response time.',
      'The time between two consecutive periodic interrupts.',
      'The number of samples captured in one second.',
    ],
    explanation:
      'Response time measures the full delay between the triggering event and the moment the required output is complete.',
  },
  {
    id: 4,
    question: 'The deadline (-) minus the response time?',
    answer: 'Timing Margin.',
    distractors: ['Duty cycle.', 'Interrupt latency.', 'Sampling rate.'],
    explanation:
      'Timing margin is the slack left after subtracting the response time from the deadline. A positive margin means the deadline can still be met.',
  },
  {
    id: 5,
    question: 'What is interrupt latency?',
    answer:
      'The time from the interrupt request to the first instruction of the ISR.',
    distractors: [
      'The time from the event to the completed output.',
      'The total time spent executing every instruction inside the ISR.',
      'The time between two consecutive samples of a signal.',
    ],
    explanation:
      'Interrupt latency ends when the processor reaches the first instruction of the interrupt service routine (ISR).',
  },
  {
    id: 6,
    question: 'What is Periodic Interrupts?',
    answer: 'Are used for work that repeats at a fixed interval.',
    distractors: [
      'Are triggered only by an external event, such as a button press.',
      'Run once immediately after power-up and then stop.',
      'Permanently halt the CPU until the system is reset.',
    ],
    explanation:
      'Periodic interrupts occur on a regular schedule, which makes them suitable for repeated tasks such as sampling a sensor.',
  },
  {
    id: 7,
    question:
      'How often a sample is taken (samples per second). Must exceed 2 × the highest signal frequency (Nyquist principle).',
    answer: 'Sampling Rate.',
    distractors: ['Quantization.', 'Duty cycle.', 'Timing margin.'],
    explanation:
      'The sampling rate is the number of samples taken per second. The Nyquist principle requires it to be greater than twice the highest signal frequency.',
  },
  {
    id: 8,
    question: 'What is the role of ISR?',
    answer: 'Short and fast: read the sensor, set a flag, return.',
    distractors: [
      'Run the full application logic and update the display.',
      'Continuously poll every input inside the main loop.',
      'Store the firmware image and manage the bootloader.',
    ],
    explanation:
      'An ISR should do only the urgent minimum, then return quickly. Time-consuming work is normally left to the main program.',
  },
  {
    id: 9,
    question: 'Definition of PWM?',
    answer:
      'PWM is a technique that switches a digital output ON and OFF repeatedly at a fixed frequency and changes the fraction of time it is ON.',
    distractors: [
      'A method that converts an analog voltage into an N-bit digital code.',
      'A method that pauses the CPU for a fixed number of milliseconds.',
      'A method that combines compiled object files into a single program.',
    ],
    explanation:
      'Pulse-width modulation keeps the frequency fixed while varying how long the output stays ON during each period.',
  },
  {
    id: 10,
    question: 'It is expressed as a fraction or as a percentage?',
    answer: 'Duty cycle.',
    distractors: ['Timing margin.', 'Sampling rate.', 'Interrupt latency.'],
    explanation:
      'Duty cycle is the ON time divided by the total period, so it can be written as a fraction or a percentage.',
  },
  {
    id: 11,
    question: 'What is the value on setting the angle of hobby servo position?',
    answer: 'In a repeating frame of about 20 ms (50 Hz) sets the angle.',
    distractors: [
      'A single pulse of about 20 ms selects the angle once.',
      'A repeating frame of about 50 ms (20 Hz) sets the angle.',
      'A continuous analog voltage from 0 V to 5 V sets the angle.',
    ],
    explanation:
      'A hobby servo expects a repeated frame, roughly every 20 ms (50 Hz); the pulse width inside that frame determines the angle.',
  },
  {
    id: 12,
    question: 'What is the purpose of ADC (Analog-to-Digital Converter)?',
    answer: 'Converts an analog voltage into an N-bit digital code.',
    distractors: [
      'Converts an N-bit digital code into an analog voltage.',
      'Switches a digital output ON and OFF at a fixed frequency.',
      'Writes the firmware image into flash memory.',
    ],
    explanation:
      'The ADC samples an analog voltage and represents it as a discrete N-bit value that the MCU can process.',
  },
  {
    id: 13,
    question: 'What is the use of MOSFET driver in Smart Cooling System?',
    answer:
      'The driver is needed because an MCU pin cannot supply the fan current.',
    distractors: [
      "The driver converts the fan's analog speed signal into a digital code.",
      'The driver stores the temperature threshold in non-volatile memory.',
      'The driver removes the need for a power supply in the system.',
    ],
    explanation:
      'The MOSFET driver provides the current and switching capability needed by the fan, which an MCU pin cannot supply directly.',
  },
  {
    id: 14,
    question:
      'Choose from the following aspect that describes Embedded software/hardware?',
    answer: 'Direct: GPIO, timers, ADC.',
    distractors: [
      'Indirect: spreadsheets, word processors, web browsers.',
      'Abstract: cloud dashboards and database queries.',
      'Virtual: only simulated devices with no physical I/O.',
    ],
    explanation:
      'Embedded software deals directly with hardware resources such as general-purpose I/O, timers, and analog-to-digital converters.',
  },
  {
    id: 15,
    question: 'What the setup() and loop() Arduino module do?',
    answer: 'Run once after power-up, and loop forever.',
    distractors: [
      'Both run repeatedly forever after power-up.',
      'setup() loops forever, and loop() runs once after power-up.',
      'Both run once after power-up and then stop the MCU.',
    ],
    explanation:
      'Arduino calls setup() once during startup, then repeatedly calls loop() for the lifetime of the program.',
  },
  {
    id: 16,
    question: 'What does this Arduino code pinMode(pin, OUTPUT) means?',
    answer:
      'Sets the direction of a pin. The pin driver is enabled so the MCU can source or sink current.',
    distractors: [
      'Reads the digital value on the pin and stores it in a variable.',
      "Enables the pin's internal pull-up resistor for input.",
      'Sets the pin to a PWM output with a fixed 50% duty cycle.',
    ],
    explanation:
      'pinMode(pin, OUTPUT) configures the pin as an output so its driver can source or sink current.',
  },
  {
    id: 17,
    question: 'What does delay(ms) means?',
    answer:
      'Pauses the program for the given milliseconds (blocking). The pin keeps its last level; the CPU only waits.',
    distractors: [
      'Runs the program for the given milliseconds and then stops the MCU.',
      'Returns the number of milliseconds since the program started.',
      'Toggles the pin every millisecond without blocking the CPU.',
    ],
    explanation:
      'delay(ms) blocks the program for the requested time. Output pins hold their last state while the CPU waits.',
  },
  {
    id: 18,
    question: 'What does millis() mean?',
    answer:
      'It is a non-blocking, loop() runs continuously and checks elapsed time.',
    distractors: [
      'Pauses the program for the given number of milliseconds.',
      "Sets the pin's output state to HIGH or LOW.",
      'Converts elapsed time into an analog voltage.',
    ],
    explanation:
      'millis() returns elapsed milliseconds and does not pause the program, allowing loop() to keep running while checking time.',
  },
  {
    id: 19,
    question:
      'Writes the firmware image into the MCU flash memory through a bootloader or programmer?',
    answer: 'Flashing/Uploading.',
    distractors: ['Compiling.', 'Linking.', 'Polling.'],
    explanation:
      'Flashing, also called uploading, writes the firmware image into the MCU flash memory through a bootloader or programmer.',
  },
  {
    id: 20,
    question: 'What should be the first step when LED is not blinking?',
    answer:
      'Uploaded to the right board and port? If not, fix the board, port, or cable and upload again.',
    distractors: [
      'Replace the LED immediately and upload the sketch again.',
      'Increase the delay in loop() until the LED starts blinking.',
      'Rewrite the entire program from scratch before checking the connection.',
    ],
    explanation:
      'First confirm that the sketch was uploaded to the correct board and port, and check the board, port, or cable if it was not.',
  },
]

export const TOTAL_MCQ = questions.length
