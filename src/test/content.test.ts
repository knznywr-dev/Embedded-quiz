import { describe, expect, it } from 'vitest'
import { questions } from '../data/questions'
import {
  identificationDirections,
  identificationHeading,
  identificationItems,
  isIdentificationConfigured,
  wordBank,
} from '../data/identification'

const EXPECTED_ANSWERS = [
  'Missing a deadline is a system failure, even once.',
  'Video streaming/media playback; non-critical display updates.',
  'Time from the event to the completed output.',
  'Timing Margin.',
  'The time from the interrupt request to the first instruction of the ISR.',
  'Are used for work that repeats at a fixed interval.',
  'Sampling Rate.',
  'Short and fast: read the sensor, set a flag, return.',
  'PWM is a technique that switches a digital output ON and OFF repeatedly at a fixed frequency and changes the fraction of time it is ON.',
  'Duty cycle.',
  'In a repeating frame of about 20 ms (50 Hz) sets the angle.',
  'Converts an analog voltage into an N-bit digital code.',
  'The driver is needed because an MCU pin cannot supply the fan current.',
  'Direct: GPIO, timers, ADC.',
  'Run once after power-up, and loop forever.',
  'Sets the direction of a pin. The pin driver is enabled so the MCU can source or sink current.',
  'Pauses the program for the given milliseconds (blocking). The pin keeps its last level; the CPU only waits.',
  'It is a non-blocking, loop() runs continuously and checks elapsed time.',
  'Flashing/Uploading.',
  'Uploaded to the right board and port? If not, fix the board, port, or cable and upload again.',
]

const EXPECTED_QUESTIONS = [
  'What is the meaning of Hard real-time?',
  'Example of Soft real-time?',
  'What is Response time?',
  'The deadline (-) minus the response time?',
  'What is interrupt latency?',
  'What is Periodic Interrupts?',
  'How often a sample is taken (samples per second). Must exceed 2 × the highest signal frequency (Nyquist principle).',
  'What is the role of ISR?',
  'Definition of PWM?',
  'It is expressed as a fraction or as a percentage?',
  'What is the value on setting the angle of hobby servo position?',
  'What is the purpose of ADC (Analog-to-Digital Converter)?',
  'What is the use of MOSFET driver in Smart Cooling System?',
  'Choose from the following aspect that describes Embedded software/hardware?',
  'What the setup() and loop() Arduino module do?',
  'What does this Arduino code pinMode(pin, OUTPUT) means?',
  'What does delay(ms) means?',
  'What does millis() mean?',
  'Writes the firmware image into the MCU flash memory through a bootloader or programmer?',
  'What should be the first step when LED is not blinking?',
]

describe('multiple-choice content audit', () => {
  it('contains exactly 20 questions numbered 1 through 20', () => {
    expect(questions).toHaveLength(20)
    expect(questions.map((question) => question.id)).toEqual(
      Array.from({ length: 20 }, (_, index) => index + 1),
    )
  })

  it('preserves every supplied question wording', () => {
    expect(questions.map((question) => question.question)).toEqual(
      EXPECTED_QUESTIONS,
    )
  })

  it('preserves every supplied correct answer', () => {
    expect(questions.map((question) => question.answer)).toEqual(
      EXPECTED_ANSWERS,
    )
  })

  it('gives every question four unique options including the answer', () => {
    for (const question of questions) {
      const options = [question.answer, ...question.distractors]
      expect(options).toHaveLength(4)
      expect(new Set(options).size).toBe(4)
      expect(options).toContain(question.answer)
      options.forEach((option) => expect(option.trim().length).toBeGreaterThan(0))
    }
  })

  it('provides an explanation for every question', () => {
    for (const question of questions) {
      expect(question.explanation.trim().length).toBeGreaterThan(0)
    }
  })
})

describe('identification content audit', () => {
  it('uses the exact heading and directions', () => {
    expect(identificationHeading).toBe(
      'B. IDENTIFICATION WITH WORD BANK (Items 21–30)',
    )
    expect(identificationDirections).toBe(
      'Choose the correct term from the Word Bank for each description and write it on the blank. Use each term only once.',
    )
  })

  it('contains exactly the 10 supplied Word Bank terms in order', () => {
    expect(wordBank).toEqual([
      'Compilation',
      'Finite state machine',
      'LED_BUILTIN',
      'Polling',
      'Sampling rate',
      'Duty cycle',
      'Hysteresis',
      'Linking',
      'Quantization',
      'Timing margin',
    ])
  })

  it('has exactly ten identification items numbered 21 through 30', () => {
    expect(identificationItems).toHaveLength(10)
    expect(identificationItems.map((item) => item.id)).toEqual([
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    ])
  })

  it('provides a description and verified answer key for every item', () => {
    expect(isIdentificationConfigured).toBe(true)

    for (const item of identificationItems) {
      expect(item.description.trim().length).toBeGreaterThan(0)
      expect(item.acceptedAnswers.length).toBeGreaterThan(0)
      item.acceptedAnswers.forEach((answer) => {
        expect(wordBank).toContain(answer)
      })
    }
  })

  it('uses every Word Bank term exactly once as an answer', () => {
    const keys = identificationItems.flatMap((item) => item.acceptedAnswers)
    expect(keys).toHaveLength(wordBank.length)
    expect(new Set(keys).size).toBe(wordBank.length)
    expect([...keys].sort()).toEqual([...wordBank].sort())
  })
})
