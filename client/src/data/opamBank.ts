export type OpamPart = "self" | "forced" | "situation";

export type OpamSelfItem = {
  id: string;
  type: "self";
  trait: string;
  text: string;
};

export type OpamForcedItem = {
  id: string;
  type: "forced";
  pairKey: string;
  left: string;
  right: string;
};

export type OpamSituationItem = {
  id: string;
  type: "situation";
  text: string;
  options: string[];
  best: number;
};

export type OpamItem = OpamSelfItem | OpamForcedItem | OpamSituationItem;

const selfSeeds: Array<{ trait: string; stems: string[] }> = [
  { trait: "Initiative", stems: ["I can begin a useful task without waiting for someone to make the first move.", "When a plan changes, I look for the next workable action quickly.", "I am comfortable volunteering for a clear responsibility in a group.", "I tend to turn an open-ended problem into a first small experiment.", "If a discussion is drifting, I can suggest a practical direction.", "I would rather test a reasonable idea than wait indefinitely for certainty."] },
  { trait: "Social adaptability", stems: ["I notice when a quieter person may have something valuable to add.", "I can adjust my approach when a group has a different working rhythm.", "I am comfortable cooperating with people whose style is unlike mine.", "I try to understand the concern behind a disagreement before replying.", "I can join an unfamiliar group without needing to control the room.", "I make space for a new person to understand the task and contribute."] },
  { trait: "Determination", stems: ["I keep working on a routine task even when the reward is delayed.", "A difficult first attempt usually makes me more curious, not finished.", "I can return to a goal after a day when my energy was poor.", "I prefer a steady practice rhythm over occasional bursts of motivation.", "I finish important details even after the interesting part is over.", "I can stay with a demanding task long enough to learn its pattern."] },
  { trait: "Power of expression", stems: ["I can explain a complicated point using language the listener can follow.", "I organise my main idea before speaking when the topic matters.", "I can disagree without making the other person feel dismissed.", "I adjust the amount of detail when someone needs a shorter answer.", "I can give a clear update even when the work is not complete.", "I ask a direct question when an instruction is too vague to act on."] },
  { trait: "Speed of decision", stems: ["When information is incomplete, I can choose a safe next step.", "I do not need every possible option before making a reversible decision.", "I can decide what matters most when two tasks compete for time.", "I am willing to close a decision once the important facts are known.", "I can change a decision quickly when new evidence genuinely matters.", "I avoid confusing more discussion with better judgement."] },
  { trait: "Sense of responsibility", stems: ["If my mistake affects a group, I prefer to name it and help repair it.", "I check how my part of a task affects the people who depend on it.", "I keep a promise even when the original excitement has faded.", "I ask for help before a preventable delay becomes someone else’s problem.", "I can accept an unglamorous duty when the team needs it done.", "I review my work before handing it over rather than assuming it is fine."] },
  { trait: "Cooperation", stems: ["I can support a group decision after my own proposal is not selected.", "I share useful information instead of keeping it to make myself look important.", "I can give another person credit without feeling that my contribution disappeared.", "I look for a solution that protects the task as well as the relationship.", "I am willing to change my method when the group has a stronger reason.", "I can keep a disagreement focused on the work rather than the person."] },
  { trait: "Organising ability", stems: ["I bring order to a messy task by separating it into visible steps.", "I like to clarify who owns which part before work begins.", "I keep track of small dependencies that can affect a shared deadline.", "I can prepare the materials needed for a task without overcomplicating it.", "I usually know which detail should be handled first.", "I make a simple plan that leaves room for a change in conditions."] },
  { trait: "Self-confidence", stems: ["I can introduce myself to someone new without rehearsing every sentence.", "I am willing to share a useful point even if it is not perfectly phrased.", "I can ask a question in a group when I do not understand the direction.", "I recover reasonably quickly after a public mistake.", "I can take a lead role when the responsibility is clear.", "I trust myself to learn a task while doing the first careful attempt."] },
  { trait: "Effective intelligence", stems: ["I look for the underlying rule when a problem has many surface details.", "I can use a familiar method in a new situation without copying it blindly.", "I break a hard problem into information I can actually verify.", "I tend to ask what would change the outcome before collecting more facts.", "I can find a workable shortcut without losing the purpose of the task.", "I learn quickly when I can connect an idea to a concrete example."] },
  { trait: "Stamina", stems: ["I can keep my attention steady through a long, repetitive session.", "I manage my energy so the quality of my work does not collapse late in the day.", "I can continue making careful decisions after an early setback.", "I recover from a tiring day by returning to a simple routine.", "I stay useful in a group even when the pace is slower than I prefer.", "I can maintain effort without needing constant encouragement."] },
  { trait: "Reasoning ability", stems: ["I can revise my view when a better explanation appears.", "I separate what I know from what I am merely assuming.", "I compare two possible explanations before choosing one.", "I try to understand why an approach failed instead of only blaming the result.", "I can spot when a conclusion does not follow from the evidence.", "I use feedback to change a method rather than defend the old one."] },
];

const forcedSeeds: Array<[string, string, string]> = [
  ["planning", "I build a clear plan before I begin.", "I adapt quickly once I begin."],
  ["group", "I ask a useful question when a group is stuck.", "I offer a practical first move when a group is stuck."],
  ["detail", "I protect details that affect other people.", "I take the lead when important details are unclear."],
  ["tension", "I resolve tension early so the task can move.", "I preserve momentum and return to tension when the task is stable."],
  ["feedback", "I prefer feedback that is direct and specific.", "I prefer feedback that gives me space to reflect first."],
  ["risk", "I choose the safer option when the cost of error is high.", "I choose the bolder option when the learning value is high."],
  ["communication", "I speak early to put an idea on the table.", "I listen longer so my contribution fits the group."],
  ["effort", "I keep a steady pace from the beginning.", "I use a strong final push to close the task."],
  ["leadership", "I make the decision when the group needs direction.", "I help the group reach its own decision."],
  ["learning", "I practise a weak area repeatedly.", "I explore a new area to broaden my range."],
  ["pressure", "I simplify the task when pressure rises.", "I increase my pace when pressure rises."],
  ["ownership", "I take responsibility for the part I controlled.", "I look at the wider system that produced the outcome."],
];

const situationSeeds: Array<{ text: string; options: string[]; best: number }> = [
  { text: "Your group has ten minutes left and two members are speaking over each other. What do you do?", options: ["Summarise the shared point, suggest a next step, and invite one quieter voice.", "Wait silently because interrupting would be uncomfortable.", "Take over the whole discussion so the group cannot lose time.", "Ask the group to restart the task from the beginning."], best: 0 },
  { text: "You notice an important detail was missed in a team task just as the group is moving on. What is the most responsible response?", options: ["Flag it clearly, suggest a quick fix, and help carry it out.", "Wait to see if someone else notices it later.", "Point out who missed it so the group learns a lesson.", "Ignore it because changing the plan could create delay."], best: 0 },
  { text: "A teammate is visibly anxious before a timed activity. You have one minute. What is the best use of it?", options: ["Give one concrete instruction, then let them begin.", "Tell them there is nothing to worry about.", "Explain every possible thing that could go wrong.", "Take the task from them so the group is safe."], best: 0 },
  { text: "A new member joins your group after the instructions have started. How do you help without losing momentum?", options: ["Give the short task summary and the next action they can own.", "Tell them to watch until they understand everything.", "Ask them to repeat the entire briefing before joining.", "Leave them out so the group can work faster."], best: 0 },
  { text: "Your first idea fails during a practical task. What is the most useful next move?", options: ["State what failed, keep the useful part, and test a simpler alternative.", "Defend the idea until the group agrees it was reasonable.", "Wait for someone else to solve the problem.", "Abandon the objective because the first method did not work."], best: 0 },
  { text: "Two teammates disagree about the priority of a task. What do you do first?", options: ["Bring the discussion back to the objective and the time available.", "Choose the person who speaks most confidently.", "Avoid the disagreement and work on an unrelated detail.", "Ask the assessor to decide for the group."], best: 0 },
  { text: "You promised to bring a resource but realise you may be late. What is the responsible response?", options: ["Tell the group early, give an exact update, and offer a workaround.", "Say nothing until the deadline has passed.", "Blame the person who gave you the original request.", "Drop the task and hope the group adapts."], best: 0 },
  { text: "A group member keeps making jokes while the task is losing time. How do you respond?", options: ["Acknowledge the energy, then redirect the group to the next task step.", "Embarrass them in front of the group.", "Join the jokes so the group stays friendly.", "Leave the group to avoid the tension."], best: 0 },
  { text: "You are asked a question in a discussion and do not know the complete answer. What is the best response?", options: ["Share what you know, label the uncertainty, and reason toward a next step.", "Invent a confident answer so the discussion keeps moving.", "Stay silent even if you have a relevant partial point.", "Change the topic to something you prepared."], best: 0 },
  { text: "Your group completes the task but has one minute to review it. What do you check?", options: ["The objective, the important constraint, and the handover detail.", "Only the neatness of the final presentation.", "Who contributed the most during the task.", "Whether everyone agrees that the task felt difficult."], best: 0 },
  { text: "A plan is working but a safer improvement becomes available halfway through. What is the best judgement?", options: ["Compare the change cost with the risk, then switch only if it improves the outcome.", "Change immediately because new ideas are always better.", "Refuse to change because the original plan was approved.", "Ask the group to vote without explaining the trade-off."], best: 0 },
  { text: "You receive critical feedback after a group activity. What do you do next?", options: ["Ask for one concrete example and choose one behaviour to practise.", "Explain why the assessor misunderstood you.", "Ignore the feedback until the next full attempt.", "Ask friends to confirm that the feedback was unfair."], best: 0 },
];

export const selfItems: OpamSelfItem[] = selfSeeds.flatMap((group, groupIndex) => group.stems.map((text, itemIndex) => ({ id: `opam-self-${String(groupIndex * 6 + itemIndex + 1).padStart(3, "0")}`, type: "self", trait: group.trait, text })));
export const forcedItems: OpamForcedItem[] = Array.from({ length: 24 }, (_, index) => { const [pairKey, left, right] = forcedSeeds[index % forcedSeeds.length]; const cycle = Math.floor(index / forcedSeeds.length) + 1; return { id: `opam-forced-${String(index + 1).padStart(3, "0")}`, type: "forced", pairKey: `${pairKey}-${cycle}`, left: cycle === 1 ? left : `${left} when the situation is unfamiliar.`, right: cycle === 1 ? right : `${right} when the situation is unfamiliar.` }; });
export const situationItems: OpamSituationItem[] = Array.from({ length: 24 }, (_, index) => { const seed = situationSeeds[index % situationSeeds.length]; const cycle = Math.floor(index / situationSeeds.length) + 1; return { id: `opam-situation-${String(index + 1).padStart(3, "0")}`, type: "situation", text: cycle === 1 ? seed.text : `${seed.text.replace("What do you", "What would you")} (variant ${cycle})`, options: seed.options, best: seed.best }; });

export const opamBank: OpamItem[] = [...selfItems, ...forcedItems, ...situationItems];
export const OPAM_TOTAL = opamBank.length;
