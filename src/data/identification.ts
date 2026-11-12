/**
 * IDENTIFICATION SECTION DATA — ITEMS 21–30
 *
 * The original source material supplied the Word Bank and directions but not
 * the five Item 21–25 descriptions. The reviewer has been expanded to ten
 * items (21–30), with one accurate description for every Word Bank term, so
 * that the section can be completed and checked out of 10.
 *
 * Each Word Bank term is used exactly once. Keep the Word Bank at exactly ten
 * terms and the identification section at exactly ten items.
 */
export const identificationHeading =
  'B. IDENTIFICATION WITH WORD BANK (Items 21–30)'

export const identificationDirections =
  'Choose the correct term from the Word Bank for each description and write it on the blank. Use each term only once.'

export const wordBank = [
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
] as const

export type IdentificationQuestionId =
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30

export interface IdentificationItem {
  id: IdentificationQuestionId
  /** Reviewer-authored description for the corresponding Word Bank term. */
  description: string
  /** Verified answer key. Must be one of the Word Bank terms. */
  acceptedAnswers: string[]
  explanation?: string
}

export const identificationItems: IdentificationItem[] = [
  {
    id: 21,
    description:
      'The process of translating source code into object code before the object files are combined into a final program.',
    acceptedAnswers: ['Compilation'],
    explanation:
      'Compilation translates source code into object code. The separate process of combining object files and libraries is linking.',
  },
  {
    id: 22,
    description:
      'A control model with a fixed set of states, where events trigger transitions from one state to another and only one state is active at a time.',
    acceptedAnswers: ['Finite state machine'],
    explanation:
      'A finite state machine models behavior using a limited set of states and transitions between them.',
  },
  {
    id: 23,
    description:
      'An Arduino constant naming the LED that is already wired to a specific pin on the board.',
    acceptedAnswers: ['LED_BUILTIN'],
    explanation:
      'LED_BUILTIN identifies the built-in board LED, so a sketch can use it without adding an external LED.',
  },
  {
    id: 24,
    description:
      'A method in which the CPU repeatedly checks an input or device for a change instead of waiting for an interrupt.',
    acceptedAnswers: ['Polling'],
    explanation:
      'Polling repeatedly reads the state of a device or input from the main program rather than using an interrupt notification.',
  },
  {
    id: 25,
    description:
      'The number of samples captured per second, which must be greater than twice the highest signal frequency under the Nyquist principle.',
    acceptedAnswers: ['Sampling rate'],
    explanation:
      'The sampling rate is measured in samples per second and must exceed 2 × the highest signal frequency.',
  },
  {
    id: 26,
    description:
      'The fraction or percentage of one PWM period during which the digital output remains ON.',
    acceptedAnswers: ['Duty cycle'],
    explanation:
      'Duty cycle is the ON time divided by the total PWM period, expressed as a fraction or percentage.',
  },
  {
    id: 27,
    description:
      'A deliberate gap between the turn-on and turn-off thresholds that prevents a noisy signal from causing rapid repeated switching.',
    acceptedAnswers: ['Hysteresis'],
    explanation:
      'Hysteresis separates the switching thresholds so noise near a single threshold does not produce rapid toggling.',
  },
  {
    id: 28,
    description:
      'The stage that combines compiled object files and libraries into a single executable or firmware image.',
    acceptedAnswers: ['Linking'],
    explanation:
      'Linking resolves references between object files and libraries and produces the final executable or firmware image.',
  },
  {
    id: 29,
    description:
      'The process of mapping a continuous analog value to the nearest discrete digital level in an ADC.',
    acceptedAnswers: ['Quantization'],
    explanation:
      'Quantization assigns each sampled analog value to one of the finite digital levels available in the ADC.',
  },
  {
    id: 30,
    description:
      'The deadline minus the response time; the amount of spare time available before a deadline is missed.',
    acceptedAnswers: ['Timing margin'],
    explanation:
      'Timing margin is the remaining slack after subtracting response time from the deadline.',
  },
]

export const isIdentificationConfigured = identificationItems.every(
  (item) =>
    item.description.trim().length > 0 &&
    item.acceptedAnswers.length > 0 &&
    item.acceptedAnswers.every((answer) =>
      (wordBank as readonly string[]).includes(answer),
    ),
)

export const identificationItemCount = identificationItems.length
