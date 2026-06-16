import type { Difficulty } from "../../shared/types";
import { EXTRA_TOPICS } from "./exercises_extra";

// ---------------------------------------------------------------------------
// Deterministic pedagogical knowledge base. This powers Agora's simulation mode
// (no API key required) and also seeds prompts when a live LLM is configured.
// Each concept carries teaching material at two depths plus assessment items —
// including one item that targets a classic misconception, which is what lets
// the diagnostician trigger emergent remediation during an autonomous run.
// ---------------------------------------------------------------------------

export interface KBQuestion {
  type: "mcq" | "open";
  prompt: string;
  choices?: string[];
  correctIndex?: number;
  expectedKeywords?: string[];
  difficulty: Difficulty;
  /** When set, a wrong answer here reveals this misconception by name. */
  targetsMisconception?: string;
}

export interface KBRemediation {
  title: string;
  summary: string;
  analogy: string;
  keyPoints: string[];
  question: KBQuestion;
}

export interface KBConcept {
  key: string;
  title: string;
  difficulty: Difficulty;
  summary: string;
  analogy: string;
  keyPoints: string[];
  /** Richer body used when the tutor re-teaches at a deeper level. */
  deeperBody: string;
  questions: KBQuestion[];
  /** The misconception name reported when this concept is failed. */
  misconception?: string;
  /** Human-readable prerequisite gap the diagnostician surfaces. */
  prerequisiteGap?: string;
  /** Optional remediation micro-concept injected before retrying. */
  remediation?: KBRemediation;
}

export interface KBTopic {
  id: string;
  match: string[];
  goalTitle: string;
  rationale: string;
  concepts: KBConcept[];
}

// --------------------------------- Recursion --------------------------------

const recursion: KBTopic = {
  id: "recursion",
  match: ["recursion", "recursive", "récursion", "récursivité", "call stack"],
  goalTitle: "Understand recursion",
  rationale:
    "Recursion is best learned bottom-up: first what a function call really is, then the call stack that records them, then the two halves of every recursive definition, and finally tracing and comparing to iteration.",
  concepts: [
    {
      key: "function-call",
      title: "What a function call really is",
      difficulty: "intro",
      summary:
        "Calling a function pauses the current work, runs the function with its arguments, and resumes once it returns a value.",
      analogy:
        "Like pausing a recipe to follow a sub-recipe: you note where you stopped, make the sauce, then come back.",
      keyPoints: [
        "A call suspends the caller until the callee returns.",
        "Each call gets its own fresh set of local variables.",
        "The returned value flows back to where the call was made.",
      ],
      deeperBody:
        "Every call creates an activation record holding its arguments and locals. Two calls to the same function never share locals — that independence is exactly what makes recursion possible.",
      questions: [
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "When a function calls another function, what happens to the caller?",
          choices: [
            "It is discarded and forgotten",
            "It is suspended and resumes after the callee returns",
            "It runs in parallel with the callee",
            "It restarts from the beginning afterwards",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      key: "call-stack",
      title: "The call stack",
      difficulty: "core",
      summary:
        "The call stack is the runtime's stack of paused calls. Each new call pushes a frame; each return pops one.",
      analogy:
        "A stack of plates: you add to the top and remove from the top, last-in first-out.",
      keyPoints: [
        "Each active call has a frame on the stack.",
        "Returning pops the top frame and resumes the one beneath.",
        "Unbounded recursion overflows the stack.",
      ],
      deeperBody:
        "Because frames are independent and ordered, you can read a recursion's state by reading the stack top-to-bottom. A missing base case never pops frames, so the stack grows until it overflows.",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          prompt: "In what order do call-stack frames return?",
          choices: [
            "First-in, first-out",
            "Last-in, first-out",
            "Random order",
            "All at once",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      key: "base-case",
      title: "The base case",
      difficulty: "core",
      summary:
        "The base case is the condition where the function returns directly without recursing. It is what stops the recursion.",
      analogy:
        "Like the bottom step of a staircase: when you reach it, you stop going down.",
      keyPoints: [
        "Every recursion needs at least one base case.",
        "Without a reachable base case the recursion never ends.",
        "The recursive case must move toward the base case.",
      ],
      deeperBody:
        "A correct recursion guarantees that each recursive call strictly approaches a base case. If it does not, frames pile up forever and the stack overflows — the single most common recursion bug.",
      // This is the trap concept: failing the misconception question triggers
      // the diagnostician to inject a remediation about progress toward the base.
      misconception: "Believing a recursive function will stop on its own without an explicit base case.",
      prerequisiteGap: "Why each recursive call must move closer to the base case",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          targetsMisconception: "missing-base-case",
          prompt:
            "A function calls itself on the same input every time, with no base case. What happens?",
          choices: [
            "It returns 0 by default",
            "It eventually stops on its own",
            "It recurses forever and overflows the stack",
            "The compiler fixes it automatically",
          ],
          correctIndex: 2,
        },
      ],
      remediation: {
        title: "Progress toward the base case",
        summary:
          "A recursion only terminates if every recursive call makes the problem strictly smaller, so it must reach the base case.",
        analogy: "Each call should take one real step down the staircase — never stay on the same step.",
        keyPoints: [
          "Identify what shrinks on each call (a counter, list length, range).",
          "Check that the shrinking quantity hits the base case.",
          "If nothing shrinks, the base case is unreachable.",
        ],
        question: {
          type: "mcq",
          difficulty: "core",
          prompt: "What guarantees a recursion reaches its base case?",
          choices: [
            "Calling itself with a strictly smaller input each time",
            "Using a faster computer",
            "Adding more base cases at the end",
            "Nothing — it is automatic",
          ],
          correctIndex: 0,
        },
      },
    },
    {
      key: "tracing",
      title: "Tracing a recursive call",
      difficulty: "advanced",
      summary:
        "Tracing means following each call and return by hand, building the stack down then collapsing it back up.",
      analogy: "Unrolling a scroll on the way down, then rolling it back up as answers return.",
      keyPoints: [
        "Write each call with its argument as you descend.",
        "Mark the base case where descent stops.",
        "Collapse upward, substituting each returned value.",
      ],
      deeperBody:
        "For factorial(3): 3*factorial(2) -> 3*(2*factorial(1)) -> 3*(2*(1)) = 6. The multiplication only resolves on the way back up, once the base case supplies the first concrete value.",
      questions: [
        {
          type: "mcq",
          difficulty: "advanced",
          prompt: "Tracing factorial(3) = 3 * factorial(2) = ..., when is the first multiplication actually computed?",
          choices: [
            "Immediately, before any recursion",
            "On the way back up, after the base case returns 1",
            "Never, it is symbolic",
            "Only if you use a loop",
          ],
          correctIndex: 1,
        },
      ],
    },
  ],
};

// --------------------------------- Fractions --------------------------------

const fractions: KBTopic = {
  id: "fractions",
  match: ["fraction", "fractions", "numerator", "denominator", "dénominateur"],
  goalTitle: "Master adding fractions",
  rationale:
    "Adding fractions sits on top of three ideas: what numerator and denominator mean, when fractions are equivalent, and why a common denominator is required before adding.",
  concepts: [
    {
      key: "parts",
      title: "Numerator and denominator",
      difficulty: "intro",
      summary:
        "The denominator says how many equal parts a whole is split into; the numerator says how many of those parts you have.",
      analogy: "A pizza cut into 8 slices: denominator 8, and 3 slices eaten is numerator 3.",
      keyPoints: [
        "Denominator = size of each part (how many parts make a whole).",
        "Numerator = how many parts you have.",
        "Same denominator means same-sized parts.",
      ],
      deeperBody:
        "A larger denominator means smaller parts, not a larger value. 1/8 is smaller than 1/4 because eighths are smaller slices than quarters.",
      questions: [
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "In 3/8, what does the 8 represent?",
          choices: [
            "How many parts you have",
            "How many equal parts the whole is divided into",
            "The total value",
            "The number you add",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      key: "equivalence",
      title: "Equivalent fractions",
      difficulty: "core",
      summary:
        "Multiplying numerator and denominator by the same number gives an equal fraction in different parts.",
      analogy: "Cutting each pizza slice in two: twice as many slices, but the same amount of pizza.",
      keyPoints: [
        "1/2 = 2/4 = 3/6 — same value, different parts.",
        "Multiply or divide top and bottom by the same number.",
        "This is the tool that creates common denominators.",
      ],
      deeperBody:
        "Equivalence is the bridge to addition: to add halves and thirds, you re-express both over sixths, the smallest common multiple of 2 and 3.",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Which fraction is equivalent to 1/3?",
          choices: ["2/3", "2/6", "1/6", "3/1"],
          correctIndex: 1,
        },
      ],
    },
    {
      key: "adding",
      title: "Adding fractions",
      difficulty: "core",
      summary:
        "To add fractions you first give them a common denominator, then add only the numerators.",
      analogy: "You can only add slices that are the same size; resize them first, then count.",
      keyPoints: [
        "Find a common denominator.",
        "Convert each fraction to that denominator.",
        "Add the numerators; keep the denominator.",
      ],
      deeperBody:
        "1/2 + 1/3 becomes 3/6 + 2/6 = 5/6. The denominator stays 6 because the part size does not change when you combine counts of equal parts.",
      misconception: "Adding both numerators and denominators, e.g. 1/2 + 1/3 = 2/5.",
      prerequisiteGap: "Why denominators are not added when combining fractions",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          targetsMisconception: "add-denominators",
          prompt: "What is 1/2 + 1/3?",
          choices: ["2/5", "5/6", "1/5", "2/6"],
          correctIndex: 1,
        },
      ],
      remediation: {
        title: "Why denominators stay the same",
        summary:
          "Adding fractions counts equal-sized parts. The part size (denominator) does not change, only how many parts you have.",
        analogy: "Three sixths plus two sixths is five sixths — the slices are still sixths.",
        keyPoints: [
          "A common denominator makes the parts equal-sized.",
          "Adding counts the parts: numerators add.",
          "The shared denominator is carried through unchanged.",
        ],
        question: {
          type: "mcq",
          difficulty: "core",
          prompt: "3/6 + 2/6 = ?",
          choices: ["5/12", "5/6", "6/6", "1/6"],
          correctIndex: 1,
        },
      },
    },
  ],
};

// ------------------------------ Photosynthesis ------------------------------

const photosynthesis: KBTopic = {
  id: "photosynthesis",
  match: ["photosynthesis", "photosynthèse", "chlorophyll", "plants energy"],
  goalTitle: "Understand photosynthesis",
  rationale:
    "Photosynthesis is clearest as inputs and outputs first, then where the energy is captured, then the two stages, then why it matters for ecosystems.",
  concepts: [
    {
      key: "inputs-outputs",
      title: "Inputs and outputs",
      difficulty: "intro",
      summary:
        "Plants take in carbon dioxide and water and, using light, produce glucose and release oxygen.",
      analogy: "A solar-powered kitchen turning air and water into sugar, venting oxygen.",
      keyPoints: [
        "Inputs: carbon dioxide, water, light energy.",
        "Outputs: glucose (stored energy) and oxygen.",
        "Light energy is captured, not consumed as matter.",
      ],
      deeperBody:
        "The carbon in a plant's mass comes mostly from CO2 in the air, not from the soil — a famously counter-intuitive fact.",
      misconception: "Thinking plants gain most of their mass from soil rather than from carbon dioxide in the air.",
      prerequisiteGap: "Where the carbon in a plant's body actually comes from",
      questions: [
        {
          type: "mcq",
          difficulty: "intro",
          targetsMisconception: "mass-from-soil",
          prompt: "Where does most of the mass of a growing tree come from?",
          choices: [
            "From the soil it is planted in",
            "From carbon dioxide in the air",
            "From the water alone",
            "From sunlight turning into matter",
          ],
          correctIndex: 1,
        },
      ],
      remediation: {
        title: "Carbon comes from the air",
        summary:
          "Through photosynthesis, carbon atoms from CO2 are built into glucose, which becomes the plant's structure. Soil mainly provides water and trace minerals.",
        analogy: "The tree is, in large part, air made solid by sunlight.",
        keyPoints: [
          "CO2 supplies the carbon backbone of glucose.",
          "Glucose polymerizes into cellulose — the plant's mass.",
          "Soil contributes minerals and water, not bulk carbon.",
        ],
        question: {
          type: "mcq",
          difficulty: "intro",
          prompt: "The carbon atoms in cellulose originally came from where?",
          choices: ["Soil minerals", "Carbon dioxide in the air", "Rainwater", "Fertilizer"],
          correctIndex: 1,
        },
      },
    },
    {
      key: "light-capture",
      title: "Capturing light with chlorophyll",
      difficulty: "core",
      summary:
        "Chlorophyll in the chloroplasts absorbs light and converts it into chemical energy carriers.",
      analogy: "Chlorophyll is the solar panel; it charges chemical batteries used in the next stage.",
      keyPoints: [
        "Chlorophyll absorbs mostly red and blue light.",
        "Captured energy charges carriers used to build glucose.",
        "Green light is reflected, which is why leaves look green.",
      ],
      deeperBody:
        "The light reactions split water, release oxygen, and store energy in carriers; the Calvin cycle then spends that energy fixing CO2 into glucose.",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Why do most leaves appear green?",
          choices: [
            "Chlorophyll absorbs green light strongly",
            "Chlorophyll reflects green light",
            "Leaves contain green dye",
            "Green light has no energy",
          ],
          correctIndex: 1,
        },
      ],
    },
  ],
};

// --------------------------- The French Revolution --------------------------

const frenchRevolution: KBTopic = {
  id: "french-revolution",
  match: ["french revolution", "révolution française", "bastille", "1789"],
  goalTitle: "Understand the French Revolution",
  rationale:
    "The Revolution is clearest as a chain: financial crisis, the political deadlock of the Estates-General, the rupture of 1789, the new principles, then radicalization.",
  concepts: [
    {
      key: "causes",
      title: "The financial and social crisis",
      difficulty: "intro",
      summary:
        "By the 1780s France faced debt, an unfair tax system, and a rigid order of three estates.",
      analogy: "A household deep in debt where only the poorest member is taxed.",
      keyPoints: [
        "State debt from wars strained the treasury.",
        "The Third Estate carried most of the tax burden.",
        "Bad harvests pushed bread prices up sharply.",
      ],
      deeperBody:
        "The clergy and nobility were largely tax-exempt, so reform meant confronting privilege — which is why a fiscal problem became a political revolution.",
      misconception: "Reducing the Revolution to a single cause rather than a convergence of fiscal, social and political pressures.",
      prerequisiteGap: "How several pressures combined rather than one single cause",
      questions: [
        {
          type: "mcq",
          difficulty: "intro",
          targetsMisconception: "single-cause",
          prompt: "Which best describes the cause of the French Revolution?",
          choices: [
            "A single tax law",
            "A convergence of debt, unfair taxation and social rigidity",
            "Only the storming of the Bastille",
            "A foreign invasion",
          ],
          correctIndex: 1,
        },
      ],
      remediation: {
        title: "A convergence of causes",
        summary:
          "Debt, an unfair tax structure, food shortages and Enlightenment ideas reinforced each other; no single one alone explains 1789.",
        analogy: "Several fault lines slipping at once, not a single crack.",
        keyPoints: [
          "Fiscal crisis forced the king to call the Estates-General.",
          "Social inequality made fiscal reform politically explosive.",
          "Enlightenment ideas supplied a new vocabulary of rights.",
        ],
        question: {
          type: "mcq",
          difficulty: "intro",
          prompt: "Why did a financial crisis turn into a political revolution?",
          choices: [
            "Because reforming taxes meant confronting noble and clerical privilege",
            "Because the king resigned",
            "Because of a naval defeat",
            "Because of a new calendar",
          ],
          correctIndex: 0,
        },
      },
    },
    {
      key: "rupture-1789",
      title: "1789: the rupture",
      difficulty: "core",
      summary:
        "The Third Estate formed a National Assembly; the storming of the Bastille became the symbol of revolution.",
      analogy: "A board meeting where the majority walks out and forms its own company.",
      keyPoints: [
        "The Third Estate declared a National Assembly.",
        "The Tennis Court Oath vowed a constitution.",
        "14 July 1789: the Bastille is stormed.",
      ],
      deeperBody:
        "The Declaration of the Rights of Man and of the Citizen (August 1789) set out liberty, equality before the law and popular sovereignty — the principles the rest of the Revolution fought over.",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          prompt: "What did the Declaration of the Rights of Man establish?",
          choices: [
            "The restoration of the monarchy's absolute power",
            "Liberty, equality before the law and popular sovereignty",
            "A new tax on the Third Estate",
            "An alliance with Austria",
          ],
          correctIndex: 1,
        },
      ],
    },
  ],
};

export const TOPICS: KBTopic[] = [
  recursion,
  fractions,
  photosynthesis,
  frenchRevolution,
  ...EXTRA_TOPICS,
];

// --------------------------- Generic goal builder ---------------------------

// For any goal outside the seed set, build a believable five-stage scaffold so
// the autonomous loop (including emergent remediation) works for arbitrary input.
// A live LLM, when configured, replaces this with domain-accurate material.
export function buildGenericTopic(goal: string): KBTopic {
  const subject = goal.replace(/^(learn|understand|master|study|how to)\s+/i, "").trim() || goal;
  const Subject = subject.charAt(0).toUpperCase() + subject.slice(1);
  return {
    id: "generic",
    match: [],
    goalTitle: goal,
    rationale: `A staged path to ${subject}: establish foundations, build core principles, examine how it works, apply it, then synthesize.`,
    concepts: [
      {
        key: "foundations",
        title: `Foundations of ${subject}`,
        difficulty: "intro",
        summary: `The essential vocabulary and mental model you need before studying ${subject} in depth.`,
        analogy: `Like learning the names of the pieces before playing the game of ${subject}.`,
        keyPoints: [
          `Define the core terms used in ${subject}.`,
          `Know the boundaries of what ${subject} covers.`,
          `Build a simple first mental model.`,
        ],
        deeperBody: `A solid foundation in ${subject} means you can state, in your own words, what problem it addresses and what its basic building blocks are.`,
        questions: [
          {
            type: "mcq",
            difficulty: "intro",
            prompt: `What should you secure first when learning ${subject}?`,
            choices: [
              "The most advanced applications",
              "The core vocabulary and a simple mental model",
              "Edge cases and exceptions",
              "Nothing in particular",
            ],
            correctIndex: 1,
          },
        ],
      },
      {
        key: "principles",
        title: `Core principles of ${subject}`,
        difficulty: "core",
        summary: `The handful of principles that most of ${subject} is built on.`,
        analogy: `The grammar rules behind the language of ${subject}.`,
        keyPoints: [
          `Identify the recurring principles in ${subject}.`,
          `See how principles connect to the foundations.`,
          `Spot where principles are commonly misapplied.`,
        ],
        deeperBody: `Mastery of ${subject} comes from internalizing a few principles deeply rather than memorizing many facts shallowly.`,
        misconception: `Treating ${subject} as a list of facts rather than a small set of connected principles.`,
        prerequisiteGap: `Connecting the principles of ${subject} back to its foundations`,
        questions: [
          {
            type: "mcq",
            difficulty: "core",
            targetsMisconception: "facts-not-principles",
            prompt: `What is the most durable way to master ${subject}?`,
            choices: [
              "Memorize as many isolated facts as possible",
              "Understand a few connected principles deeply",
              "Skip the basics entirely",
              "Only watch others do it",
            ],
            correctIndex: 1,
          },
        ],
        remediation: {
          title: `Principles over facts in ${subject}`,
          summary: `${Subject} is easier to retain when you anchor details to a few core principles rather than memorizing them in isolation.`,
          analogy: `Hang the facts on the hooks of the principles.`,
          keyPoints: [
            `Group related facts under a principle.`,
            `Re-derive details from principles when you forget them.`,
            `Test understanding by explaining the principle plainly.`,
          ],
          question: {
            type: "mcq",
            difficulty: "core",
            prompt: `Why anchor facts to principles when learning ${subject}?`,
            choices: [
              "It makes details easier to recall and re-derive",
              "It is slower but looks impressive",
              "Principles are irrelevant in practice",
              "It avoids ever needing examples",
            ],
            correctIndex: 0,
          },
        },
      },
      {
        key: "application",
        title: `Applying ${subject}`,
        difficulty: "advanced",
        summary: `Using the principles of ${subject} on a concrete, realistic problem.`,
        analogy: `Moving from rehearsal to a live performance of ${subject}.`,
        keyPoints: [
          `Translate a real problem into the terms of ${subject}.`,
          `Apply the relevant principle deliberately.`,
          `Check the result against the foundations.`,
        ],
        deeperBody: `Application is where understanding is proven: you select the right principle for a new situation in ${subject} and justify why.`,
        questions: [
          {
            type: "mcq",
            difficulty: "advanced",
            prompt: `What demonstrates real mastery of ${subject}?`,
            choices: [
              "Reciting definitions quickly",
              "Choosing and justifying the right principle on a new problem",
              "Avoiding new problems",
              "Memorizing one worked example",
            ],
            correctIndex: 1,
          },
        ],
      },
    ],
  };
}

// Pick the seed topic whose keywords best match the goal, else generic.
export function selectTopic(goal: string): KBTopic {
  const g = goal.toLowerCase();
  let best: { topic: KBTopic; score: number } | null = null;
  for (const topic of TOPICS) {
    const score = topic.match.reduce((acc, kw) => (g.includes(kw.toLowerCase()) ? acc + 1 : acc), 0);
    if (score > 0 && (!best || score > best.score)) best = { topic, score };
  }
  return best ? best.topic : buildGenericTopic(goal);
}
