export type CsssSection = "memory" | "spatial" | "pattern" | "language" | "audio";
export type CsssQuestion = { id: string; section: CsssSection; sectionLabel: string; subtype: string; duration: number; prompt: string; renderHint?: string; audioText?: string; options: string[]; answer: number; explanation: string };
type Row = [string, string[], number, string, string?, string?];

const memoryRows: Row[] = [
  ["A sequence flashes once: 4 · 9 · 2 · 7. Which number was third?", ["2", "4", "7", "9"], 0, "The third position is 2.", "digit_recall"],
  ["A sequence flashes once: 8 · 1 · 6 · 3. Which number was last?", ["1", "3", "6", "8"], 1, "The last position is 3.", "digit_recall"],
  ["A sequence flashes once: 5 · 2 · 9 · 4. Which number was first?", ["2", "4", "5", "9"], 2, "The first position is 5.", "digit_recall"],
  ["A sequence flashes once: 7 · 3 · 8 · 1. Which number was second?", ["1", "3", "7", "8"], 1, "The second position is 3.", "digit_recall"],
  ["A sequence flashes once: 6 · 4 · 1 · 8. Which number was third?", ["1", "4", "6", "8"], 0, "The third position is 1.", "digit_recall"],
  ["A sequence flashes once: 9 · 5 · 2 · 6. Which number was last?", ["2", "5", "6", "9"], 2, "The last position is 6.", "digit_recall"],
  ["A sequence flashes once: 3 · 8 · 5 · 0. Which number was second?", ["0", "3", "5", "8"], 3, "The second position is 8.", "digit_recall"],
  ["A sequence flashes once: 1 · 7 · 4 · 9. Which number was first?", ["1", "4", "7", "9"], 0, "The first position is 1.", "digit_recall"],
  ["Remember 4 · 8 · 2. Add one to each number. Which transformed sequence is correct?", ["5 · 9 · 3", "4 · 9 · 2", "5 · 8 · 3", "3 · 7 · 1"], 0, "Each number increases by one: 5 · 9 · 3.", "updating_memory"],
  ["A sequence flashes: 7 · 2 · 9 · 4. Which pair was adjacent in the original order?", ["7 · 2", "2 · 4", "9 · 7", "4 · 2"], 0, "The original sequence begins with adjacent 7 · 2.", "order_tracking"],
  ["Remember the order: red, blue, green, yellow. Which colour was immediately before green?", ["Red", "Blue", "Green", "Yellow"], 1, "Blue came immediately before green.", "order_tracking"],
  ["A sequence flashes once: 2 · 6 · 0 · 5. Reverse the order. Which is correct?", ["5 · 0 · 6 · 2", "2 · 0 · 6 · 5", "5 · 6 · 0 · 2", "0 · 5 · 6 · 2"], 0, "Reversing the sequence gives 5 · 0 · 6 · 2.", "mental_manipulation"],
  ["A sequence flashes once: 7 · 1 · 5 · 4. Which number was third?", ["1", "4", "5", "7"], 2, "The third position is 5.", "digit_recall"],
  ["Ignore the ink colour and select the written word: GREEN shown in red ink.", ["RED", "BLUE", "GREEN", "YELLOW"], 2, "The target is the written word GREEN.", "stroop_attention"],
  ["A sequence flashes once: 6 · 9 · 0 · 3. Which number was last?", ["0", "3", "6", "9"], 1, "The last position is 3.", "digit_recall"],
];
const spatialRows: Row[] = [
  ["A paper square has a dot at the top-left corner. It is flipped horizontally. Where is the dot?", ["Top-left", "Top-right", "Bottom-left", "Bottom-right"], 1, "A horizontal flip mirrors left to right.", "mirror_grid"],
  ["A paper square has a dot at the top-left corner. It is flipped vertically. Where is the dot?", ["Top-left", "Top-right", "Bottom-left", "Bottom-right"], 2, "A vertical flip mirrors top to bottom.", "mirror_grid"],
  ["A square is rotated 90° clockwise. A mark on the top edge moves to which edge?", ["Left", "Right", "Top", "Bottom"], 1, "The top edge moves to the right edge.", "rotation"],
  ["A route goes north, then east, then south by the same distance. Where are you from the start?", ["West", "East", "North", "At the start"], 1, "North and south cancel, leaving east.", "coordinate_path"],
  ["A cube has a dot on its top face. It is rolled forward once. Where does the dot move?", ["Bottom", "Front", "Back", "It stays on top"], 1, "Rolling forward brings the top face to the front.", "cube_rotation"],
  ["You face east, turn left, then left again. Which way do you face?", ["North", "South", "East", "West"], 3, "Two left turns from east lead to west.", "direction"],
  ["A rectangle is divided into four cells. A mark is in the bottom-right cell. Rotate the grid 90° clockwise. Where is it?", ["Top-right", "Top-left", "Bottom-left", "Bottom-right"], 2, "Bottom-right rotates to bottom-left.", "grid_rotation"],
  ["A line slopes upward from left to right. Reflect it across a horizontal mirror. What happens?", ["It slopes downward", "It becomes vertical", "It keeps the same slope", "It disappears"], 0, "A horizontal reflection reverses the vertical direction.", "mirror_line"],
  ["A small arrow points down. Rotate it 90° anticlockwise. Which way does it point?", ["Right", "Left", "Up", "Down"], 0, "Down rotated anticlockwise points right.", "arrow_rotation"],
  ["A marker moves two cells north and one cell west from the centre. Where is it?", ["Upper-left", "Upper-right", "Lower-left", "Lower-right"], 0, "North is up and west is left.", "coordinate_path"],
  ["A vertical line is reflected in a vertical mirror. What happens to its orientation?", ["It becomes horizontal", "It remains vertical", "It becomes diagonal", "It vanishes"], 1, "A vertical mirror preserves vertical orientation.", "mirror_line"],
  ["A path goes east three steps and north one step. Which description matches its displacement?", ["Three west, one south", "Three east, one north", "One east, three north", "It returns to the start"], 1, "The movement is three east and one north.", "coordinate_path"],
  ["A triangle has its shaded corner at the top-left. It is flipped horizontally. Where does it move?", ["Top-left", "Top-right", "Bottom-left", "Bottom-right"], 1, "A horizontal flip mirrors the corner to top-right.", "mirror_grid"],
  ["A square mark starts at the bottom-left and rotates 180°. Where does it go?", ["Top-left", "Top-right", "Bottom-left", "Bottom-right"], 1, "A half-turn maps bottom-left to top-right.", "rotation"],
  ["A path from the centre goes to 3 o'clock and then 12 o'clock. What shape does the path make?", ["A right angle", "A straight line", "A circle", "No path"], 0, "The two perpendicular moves form a right angle.", "coordinate_path"],
];
const patternRows: Row[] = [
  ["Choose the next value in the doubling sequence.", ["30", "36", "42", "48"], 3, "Each term doubles."],
  ["Choose the next value in the constant-step sequence.", ["15", "16", "17", "18"], 2, "The series increases by 3."],
  ["Choose the next value in the odd-increment sequence.", ["24", "25", "26", "27"], 2, "The increases are +3, +5, +7, then +9."],
  ["Choose the next value in the repeated-division sequence.", ["0", "1", "2", "6"], 1, "Each term is divided by 3."],
  ["Choose the next value in the square-number sequence.", ["20", "24", "25", "36"], 2, "These are the squares of 1 through 5."],
  ["Choose the next value in the growing-gap sequence.", ["34", "35", "36", "37"], 3, "The increases are +3, +6, +9, then +12."],
  ["Choose the missing value in the alternating sequence.", ["5", "7", "9", "10"], 0, "Odd positions rise by one."],
  ["Choose the letter that follows the increasing-gap rule.", ["M", "N", "O", "P"], 2, "The gaps are +2, +3, +4, then +5."],
  ["Choose the missing value in the decreasing sequence.", ["24", "20", "18", "12"], 1, "The next subtraction is 28: 48 − 28 = 20."],
  ["Which pair has the same relationship as 3 : 12?", ["4 : 12", "5 : 20", "6 : 18", "7 : 21"], 1, "The relationship is ×4."],
  ["Apply the same letter-shift rule and select the correct code.", ["EPH", "EOH", "CNG", "FPH"], 0, "Each letter moves one place forward."],
  ["Which tile completes the visual pattern?", ["● ○ ●", "○ ● ○", "● ● ○", "○ ○ ●"], 0, "The alternating row begins and ends with a filled circle.", "nonverbal_grid"],
  ["Which shape should come next in the rotation?", ["▲", "▶", "▼", "◀"], 1, "The shape rotates 90 degrees clockwise.", "nonverbal_rotation"],
  ["Which option mirrors the shown arrangement?", ["◆ · ○", "○ · ◆", "◆ · ◆", "○ · ○"], 1, "The mirrored arrangement reverses the left and right positions.", "nonverbal_mirror"],
  ["Select the missing symbol in the visual sequence.", ["□", "△", "○", "◇"], 2, "The sequence alternates angular and curved forms.", "nonverbal_sequence"],
];
const languageRows: Row[] = [
  ["Closest meaning of ‘measured’ in ‘a measured reply’:", ["Angry", "Careful and controlled", "Very long", "Unrelated"], 1, "Measured means considered and controlled."],
  ["Opposite of ‘scarce’:", ["Rare", "Limited", "Abundant", "Hidden"], 2, "Abundant means available in large quantity."],
  ["Complete: The plan was clear and ___.", ["practical", "fragile", "distant", "silent"], 0, "Practical fits a plan that can be acted upon."],
  ["Closest meaning of ‘resilient’:", ["Able to recover", "Unable to move", "Very expensive", "Easily distracted"], 0, "Resilient means able to recover."],
  ["Which word is different: observe, notice, ignore, watch?", ["observe", "notice", "ignore", "watch"], 2, "Ignore is the opposite of paying attention."],
  ["Best synonym for ‘brief’:", ["Short", "Loud", "Late", "Exact"], 0, "Brief means short."],
  ["A person who can be trusted is ___.", ["reliable", "random", "rigid", "restless"], 0, "Reliable means dependable."],
  ["Opposite of ‘expand’:", ["Stretch", "Contract", "Explain", "Improve"], 1, "Contract means become smaller."],
  ["Which sentence is clearest?", ["Because the rain, the route changed.", "The route changed because of rain.", "Rain route changed because.", "Changed route the rain."], 1, "The second sentence is complete and direct."],
  ["Closest meaning of ‘candid’:", ["Frank", "Careless", "Secretive", "Polished"], 0, "Candid means honest and direct."],
  ["A decision made after thought is ___.", ["deliberate", "accidental", "restless", "instant"], 0, "Deliberate can mean carefully considered."],
  ["Which word does not fit: calm, steady, composed, frantic?", ["calm", "steady", "composed", "frantic"], 3, "Frantic contrasts with the other three."],
  ["The team reached a ___ agreement after discussion.", ["mutual", "musical", "minor", "remote"], 0, "Mutual means shared by both sides."],
  ["Best meaning of ‘adapt’:", ["Adjust to conditions", "Repeat exactly", "Reject evidence", "Move backward"], 0, "To adapt is to adjust to a new condition."],
  ["Book is to reading as fork is to…", ["writing", "eating", "walking", "sleeping"], 1, "A fork is a tool used for eating.", "verbal_analogy"],
];
const audioRows: Row[] = [
  ["Listen once, then select the sequence from task one.", ["7–9–3–2–8", "7–3–9–2–8", "3–7–9–8–2", "7–3–2–9–8"], 1, "Review the order and grouping of the heard sequence.", "digit_recall_audio", "7 3 9 2 8"],
  ["Listen once, then select the sequence from task two.", ["4–1–6–8–0", "4–6–1–8–0", "1–4–6–0–8", "8–6–1–4–0"], 0, "Review the order and grouping of the heard sequence.", "digit_recall_audio", "4 1 6 8 0"],
  ["Listen once, then select the sequence from task three.", ["9–5–2–1–7", "2–9–5–7–1", "9–2–5–1–7", "7–1–5–2–9"], 2, "Review the order and grouping of the heard sequence.", "digit_recall_audio", "9 2 5 1 7"],
  ["Listen once, then select the sequence from task four.", ["6–0–3–4–8", "0–6–4–3–8", "6–0–4–3–8", "8–3–4–0–6"], 2, "Review the order and grouping of the heard sequence.", "digit_recall_audio", "6 0 4 3 8"],
  ["Listen once, then select the sequence from task five.", ["2–1–8–5–6", "8–2–1–6–5", "2–8–1–5–6", "5–6–1–8–2"], 2, "Review the order and grouping of the heard sequence.", "digit_recall_audio", "2 8 1 5 6"],
  ["Listen once, then select the sequence from task six.", ["3–7–0–9–4", "3–0–7–9–4", "7–3–9–0–4", "4–9–0–7–3"], 0, "Review the order and grouping of the heard sequence.", "digit_recall_audio", "3 7 0 9 4"],
  ["Listen once, then select the sequence from task seven.", ["8–2–5–6–1", "5–8–2–1–6", "8–5–2–6–1", "1–6–2–5–8"], 2, "Review the order and grouping of the heard sequence.", "digit_recall_audio", "8 5 2 6 1"],
  ["Listen once, then select the sequence from task eight.", ["4–1–9–6–3", "1–4–9–6–3", "1–9–4–3–6", "3–6–9–4–1"], 1, "Review the order and grouping of the heard sequence.", "digit_recall_audio", "1 4 9 6 3"],
  ["Listen once, then select the sequence from task nine.", ["5–8–0–2–7", "0–5–8–7–2", "5–0–8–2–7", "7–2–8–0–5"], 2, "Review the order and grouping of the heard sequence.", "digit_recall_audio", "5 0 8 2 7"],
  ["Listen once, then select the sequence from task ten.", ["0–6–3–1–9", "6–0–1–3–9", "0–3–6–9–1", "9–1–3–6–0"], 0, "Review the order and grouping of the heard sequence.", "digit_recall_audio", "0 6 3 1 9"],
];
const build = (section: CsssSection, label: string, duration: number, rows: Row[], prefix: string): CsssQuestion[] => rows.map(([prompt, options, answer, explanation, subtype, audioText], index) => ({ id: `CSSS-${prefix}-${String(index + 1).padStart(2, "0")}`, section, sectionLabel: label, subtype: subtype ?? "standard", duration, prompt, options, answer, explanation, ...(audioText ? { audioText } : {}) }));
export const csssBank: CsssQuestion[] = [
  ...build("memory", "Working memory & selective attention", 5, memoryRows, "A"),
  ...build("spatial", "Spatial & form perception", 12, spatialRows, "B"),
  ...build("pattern", "Verbal + non-verbal reasoning", 10, patternRows, "C"),
  ...build("language", "Linguistic ability", 6, languageRows, "D"),
  ...build("audio", "Auditory discrimination", 6, audioRows, "E"),
];
export const CSSS_TOTAL = csssBank.length;
export const CSSS_SECTION_COUNTS: Record<CsssSection, number> = { memory: 15, spatial: 15, pattern: 15, language: 15, audio: 10 };
