export type CsssSection = "memory" | "spatial" | "pattern" | "language" | "audio";
export type CsssQuestion = {
  id: string;
  section: CsssSection;
  sectionLabel: string;
  duration: number;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

const memorySequences: Array<[string, string, string[], number, string]> = [
  ["4 · 9 · 2 · 7", "Which number was third?", ["2", "4", "7", "9"], 0, "The third position was 2."],
  ["8 · 1 · 6 · 3", "Which number was last?", ["1", "3", "6", "8"], 1, "The last position was 3."],
  ["5 · 2 · 9 · 4", "Which number was first?", ["2", "4", "5", "9"], 2, "The first position was 5."],
  ["7 · 3 · 8 · 1", "Which number was second?", ["1", "3", "7", "8"], 1, "The second position was 3."],
  ["6 · 4 · 1 · 8", "Which number was third?", ["1", "4", "6", "8"], 0, "The third position was 1."],
  ["9 · 5 · 2 · 6", "Which number was last?", ["2", "5", "6", "9"], 2, "The last position was 6."],
  ["3 · 8 · 5 · 0", "Which number was second?", ["0", "3", "5", "8"], 3, "The second position was 8."],
  ["1 · 7 · 4 · 9", "Which number was first?", ["1", "4", "7", "9"], 0, "The first position was 1."],
  ["2 · 6 · 0 · 5", "Which number was third?", ["0", "2", "5", "6"], 0, "The third position was 0."],
  ["8 · 4 · 7 · 2", "Which number was last?", ["2", "4", "7", "8"], 0, "The last position was 2."],
  ["5 · 9 · 3 · 1", "Which number was second?", ["1", "3", "5", "9"], 3, "The second position was 9."],
  ["0 · 2 · 8 · 6", "Which number was first?", ["0", "2", "6", "8"], 0, "The first position was 0."],
  ["7 · 1 · 5 · 4", "Which number was third?", ["1", "4", "5", "7"], 2, "The third position was 5."],
  ["6 · 9 · 0 · 3", "Which number was last?", ["0", "3", "6", "9"], 1, "The last position was 3."],
];
const spatialPrompts: Array<[string, string[], number, string]> = [
  ["A paper arrow points north. Fold the page left once, then open it. Where does the crease sit?", ["At the centre line", "Along the top edge", "Along the left edge", "There is no crease"], 0, "A single fold from the left places the crease on the centre line."],
  ["A square is rotated a quarter-turn clockwise. Which side is now at the top if the original top side was marked A?", ["A", "The original right side", "The original bottom side", "The original left side"], 1, "A quarter-turn clockwise brings the original right side to the top."],
  ["A route goes north, then east, then south by the same distance. Where are you relative to the start?", ["West", "East", "North", "At the start"], 1, "The north and south movements cancel, leaving east."],
  ["A triangle has its shaded corner at the top-left. It is flipped horizontally. Where does the shade move?", ["Top-left", "Top-right", "Bottom-left", "Bottom-right"], 1, "A horizontal flip mirrors left to right."],
  ["A cube has a dot on its top face. It is rolled forward once. Where does the dot move?", ["Bottom face", "Front face", "Back face", "It stays on top"], 1, "Rolling forward brings the top face to the front."],
  ["A compass points west. Turn it 180 degrees. Which direction does it point?", ["North", "South", "East", "West"], 2, "A half-turn reverses west to east."],
  ["A rectangle is divided into four equal cells. The marked cell is bottom-right. Rotate the grid 90 degrees clockwise. Where is it?", ["Top-right", "Top-left", "Bottom-left", "Bottom-right"], 2, "Bottom-right rotates to bottom-left."],
  ["A line slopes upward from left to right. Reflect it across a horizontal line. What changes?", ["It slopes downward", "It becomes vertical", "It keeps the same slope", "It disappears"], 0, "A horizontal reflection reverses the vertical direction."],
  ["You face east, turn left, then turn left again. Which way do you face?", ["North", "South", "East", "West"], 3, "Two left turns from east lead to west."],
  ["A folded strip has a mark on its outer right end. Open it symmetrically. Where are the marks?", ["Only on the right", "Only on the left", "At both ends", "At the centre"], 2, "A symmetric opening mirrors the mark to both ends."],
  ["A small arrow points down. Rotate it 90 degrees anticlockwise. Which way does it point?", ["Right", "Left", "Up", "Down"], 0, "Down rotated anticlockwise points right."],
  ["A square moves two places north and one place west. Which description matches its final position?", ["Upper-left", "Upper-right", "Lower-left", "Lower-right"], 0, "North is up and west is left."],
  ["A vertical line is reflected across a vertical mirror. What happens to its orientation?", ["It becomes horizontal", "It remains vertical", "It becomes diagonal", "It vanishes"], 1, "A vertical mirror preserves vertical orientation."],
  ["A marker begins at the centre of a clock face and moves to 3 o'clock, then 12 o'clock. Which path shape is made?", ["A right angle", "A straight line", "A circle", "A triangle"], 0, "The two perpendicular moves create a right angle."],
];
const patternPrompts: Array<[string, string[], number, string]> = [
  ["Complete the series: 3, 6, 12, 24, __", ["30", "36", "42", "48"], 3, "Each number doubles: 24 × 2 = 48."],
  ["Complete the series: 5, 8, 11, 14, __", ["15", "16", "17", "18"], 2, "The series increases by 3."],
  ["Complete the series: 2, 5, 10, 17, __", ["24", "25", "26", "27"], 2, "The increases are +3, +5, +7, then +9."],
  ["Complete the series: 81, 27, 9, 3, __", ["0", "1", "2", "6"], 1, "Each term is divided by 3."],
  ["Complete the series: 1, 4, 9, 16, __", ["20", "24", "25", "36"], 2, "These are the squares of 1 through 5."],
  ["Complete the series: 7, 10, 16, 25, __", ["34", "35", "36", "37"], 3, "The increases are +3, +6, +9, then +12."],
  ["If FIELD becomes GJFME by shifting each letter one place forward, PARK becomes…", ["QBSL", "QBQL", "OZQJ", "QBRL"], 0, "P→Q, A→B, R→S, K→L."],
  ["If each letter moves two places forward, ARMY becomes…", ["CTOA", "CTO[A]", "ZPKW", "BSNZ"], 0, "A→C, R→T, M→O, Y→A."],
  ["Which number does not belong: 4, 8, 12, 15, 20?", ["4", "8", "15", "20"], 2, "The others are multiples of four."],
  ["A rule changes 2 to 6, 3 to 12, and 4 to 20. What does it do to 5?", ["25", "30", "35", "40"], 1, "The rule is n × (n + 1): 5 × 6 = 30."],
  ["Complete the alternating series: 2, 4, 3, 6, 4, 8, __", ["5", "7", "9", "10"], 0, "Odd positions rise by one: 2, 3, 4, 5."],
  ["A, C, F, J, __ follows increasing letter gaps. What comes next?", ["M", "N", "O", "P"], 2, "The gaps are +2, +3, +4, then +5: O."],
  ["Complete: 100, 90, 72, 48, __", ["24", "20", "18", "12"], 1, "Subtract 10, 18, 24; the next subtraction is 28."],
  ["Which pair follows the same relationship as 3 : 12?", ["4 : 12", "5 : 20", "6 : 18", "7 : 21"], 1, "The relationship is ×4."],
];
const languagePrompts: Array<[string, string[], number, string]> = [
  ["Choose the closest meaning of ‘measured’ in: She gave a measured reply.", ["Angry", "Careful and controlled", "Very long", "Unrelated"], 1, "Measured means considered, calm, and controlled here."],
  ["Choose the opposite of ‘scarce’.", ["Rare", "Limited", "Abundant", "Hidden"], 2, "Abundant means available in large quantity."],
  ["Which word best completes: The plan was clear and ___.", ["practical", "fragile", "distant", "silent"], 0, "Practical fits a plan that can be acted upon."],
  ["Choose the closest meaning of ‘resilient’.", ["Able to recover", "Unable to move", "Very expensive", "Easily distracted"], 0, "Resilient describes the ability to recover after difficulty."],
  ["Which word is different from the others?", ["Observe", "Notice", "Ignore", "Watch"], 2, "Ignore is the opposite of paying attention."],
  ["Choose the best synonym for ‘brief’.", ["Short", "Loud", "Late", "Exact"], 0, "Brief means short in duration or length."],
  ["Complete: A person who can be trusted is ___.", ["reliable", "random", "rigid", "restless"], 0, "Reliable means dependable."],
  ["Choose the opposite of ‘expand’.", ["Stretch", "Contract", "Explain", "Improve"], 1, "Contract means become smaller."],
  ["Which sentence is clearest?", ["Because the rain, the route changed.", "The route changed because of rain.", "Rain route changed because.", "Changed route the rain."], 1, "The second sentence is complete and direct."],
  ["Choose the closest meaning of ‘candid’.", ["Frank", "Careless", "Secretive", "Polished"], 0, "Candid means honest and direct."],
  ["Which word best describes a decision made after thought?", ["deliberate", "accidental", "restless", "instant"], 0, "Deliberate can mean carefully considered."],
  ["Choose the word that does not fit: calm, steady, composed, frantic.", ["calm", "steady", "composed", "frantic"], 3, "Frantic is the contrasting word."],
  ["Complete: The team reached a ___ agreement after discussion.", ["mutual", "musical", "minor", "remote"], 0, "Mutual means shared by both sides."],
  ["Choose the best meaning of ‘adapt’.", ["Adjust to conditions", "Repeat exactly", "Reject evidence", "Move backward"], 0, "To adapt is to adjust to a new condition."],
];
const audioPrompts: Array<[string, string[], number, string]> = [
  ["Listen for the higher tone. Which label matches what you heard?", ["LOW", "HIGH", "TWO TONES", "NO TONE"], 1, "The demo tone is high."],
  ["A voice says: 8 — 1 — 6. Which sequence did you hear?", ["8 — 6 — 1", "1 — 8 — 6", "8 — 1 — 6", "6 — 1 — 8"], 2, "The heard sequence was 8 — 1 — 6."],
  ["Listen for the lower tone. Which label matches what you heard?", ["LOW", "HIGH", "TWO TONES", "NO TONE"], 0, "The demo tone is low."],
  ["A voice says: 3 — 9 — 4. Which sequence did you hear?", ["3 — 4 — 9", "9 — 3 — 4", "4 — 9 — 3", "3 — 9 — 4"], 3, "The heard sequence was 3 — 9 — 4."],
  ["Two tones play together. Which label matches the sound?", ["LOW", "HIGH", "TWO TONES", "NO TONE"], 2, "The demo uses two simultaneous tones."],
  ["A voice says: 7 — 0 — 2. Which sequence did you hear?", ["0 — 7 — 2", "7 — 0 — 2", "2 — 0 — 7", "7 — 2 — 0"], 1, "The heard sequence was 7 — 0 — 2."],
  ["A short tone is followed by silence. Which label matches the ending?", ["LOW", "HIGH", "TWO TONES", "NO TONE"], 3, "The final event in the demo is silence."],
  ["A voice says: 5 — 2 — 8. Which sequence did you hear?", ["5 — 8 — 2", "2 — 5 — 8", "8 — 2 — 5", "5 — 2 — 8"], 3, "The heard sequence was 5 — 2 — 8."],
  ["Listen for the higher tone in the pair. Which label matches it?", ["LOW", "HIGH", "TWO TONES", "NO TONE"], 1, "The target tone is high."],
  ["A voice says: 1 — 4 — 9. Which sequence did you hear?", ["4 — 1 — 9", "1 — 9 — 4", "9 — 4 — 1", "1 — 4 — 9"], 3, "The heard sequence was 1 — 4 — 9."],
  ["A low tone and a high tone play together. Which label matches the sound?", ["LOW", "HIGH", "TWO TONES", "NO TONE"], 2, "Both tones are present together."],
  ["A voice says: 6 — 3 — 0. Which sequence did you hear?", ["3 — 6 — 0", "6 — 0 — 3", "0 — 3 — 6", "6 — 3 — 0"], 3, "The heard sequence was 6 — 3 — 0."],
  ["The target sound is the lower pitch. Which label matches it?", ["LOW", "HIGH", "TWO TONES", "NO TONE"], 0, "The target pitch is low."],
  ["A voice says: 2 — 7 — 5. Which sequence did you hear?", ["7 — 2 — 5", "2 — 5 — 7", "2 — 7 — 5", "5 — 7 — 2"], 2, "The heard sequence was 2 — 7 — 5."],
];

const make = (section: CsssSection, label: string, duration: number, rows: Array<[string, string, string[], number, string]>, prefix: string): CsssQuestion[] => rows.map(([prompt, _kind, options, answer, explanation], index) => ({ id: `csss-${prefix}-${String(index + 1).padStart(2, "0")}`, section, sectionLabel: label, duration, prompt, options, answer, explanation }));

const memoryQuestions: CsssQuestion[] = memorySequences.map(([sequence, ask, options, answer, explanation], index) => ({ id: `csss-memory-${String(index + 1).padStart(2, "0")}`, section: "memory", sectionLabel: "Working memory & selective attention", duration: 10, prompt: `A sequence flashes once: ${sequence}. ${ask}`, options, answer, explanation }));
const spatialQuestions: CsssQuestion[] = spatialPrompts.map(([prompt, options, answer, explanation], index) => ({ id: `csss-spatial-${String(index + 1).padStart(2, "0")}`, section: "spatial", sectionLabel: "Spatial & form perception", duration: 22, prompt, options, answer: answer as number, explanation: explanation as string }));
const patternQuestions: CsssQuestion[] = patternPrompts.map(([prompt, options, answer, explanation], index) => ({ id: `csss-pattern-${String(index + 1).padStart(2, "0")}`, section: "pattern", sectionLabel: "Pattern recognition & reasoning", duration: 20, prompt, options, answer: answer as number, explanation: explanation as string }));
const languageQuestions: CsssQuestion[] = languagePrompts.map(([prompt, options, answer, explanation], index) => ({ id: `csss-language-${String(index + 1).padStart(2, "0")}`, section: "language", sectionLabel: "Linguistic ability", duration: 16, prompt, options, answer: answer as number, explanation: explanation as string }));
const audioQuestions: CsssQuestion[] = audioPrompts.map(([prompt, options, answer, explanation], index) => ({ id: `csss-audio-${String(index + 1).padStart(2, "0")}`, section: "audio", sectionLabel: "Auditory discrimination", duration: 10, prompt, options, answer: answer as number, explanation: explanation as string }));

export const csssBank: CsssQuestion[] = [...memoryQuestions, ...spatialQuestions, ...patternQuestions, ...languageQuestions, ...audioQuestions];
export const CSSS_TOTAL = csssBank.length;
export const CSSS_SECTION_COUNTS: Record<CsssSection, number> = { memory: memoryQuestions.length, spatial: spatialQuestions.length, pattern: patternQuestions.length, language: languageQuestions.length, audio: audioQuestions.length };
