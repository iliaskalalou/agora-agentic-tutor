import type { KBTopic } from "./curriculum";

// ---------------------------------------------------------------------------
// Additional deterministic teaching topics for Agora's simulation mode. Each
// topic mirrors the shape of the seed curriculum: concepts ordered intro ->
// core -> advanced, each with multiple-choice assessment items, and exactly one
// concept per topic carrying a misconception trap plus a remediation micro-
// concept that the diagnostician injects when the trap question is failed.
// ---------------------------------------------------------------------------

// -------------------------------- Percentages -------------------------------

const percentages: KBTopic = {
  id: "percentages",
  match: ["percentage", "percent", "ratio", "proportion"],
  goalTitle: "Work confidently with percentages and ratios",
  rationale:
    "Percentages build in order: first what 'per hundred' means, then converting between forms, then taking a percent of a quantity, then ratios and proportions, and finally percentage change.",
  concepts: [
    {
      key: "what-is-a-percent",
      title: "What a percentage means",
      difficulty: "intro",
      summary:
        "A percentage is a fraction out of one hundred; 'per cent' literally means 'per hundred'.",
      analogy: "Think of a chocolate bar split into 100 squares: 25% is 25 of those squares.",
      keyPoints: [
        "Percent means 'out of 100'.",
        "50% is the same as the fraction 50/100 = 1/2.",
        "100% represents the whole amount.",
      ],
      deeperBody:
        "Because a percentage is always relative to 100, it lets you compare parts of different-sized wholes on the same scale. 30% of a small class and 30% of a large class are the same proportion even though the head-counts differ.",
      questions: [
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "What does the symbol '%' literally stand for?",
          choices: ["Per thousand", "Per hundred", "Per ten", "Per dozen"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "Which fraction equals 50%?",
          choices: ["1/5", "1/4", "1/2", "5/1"],
          correctIndex: 2,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "100% of a quantity is equal to what?",
          choices: ["Half of it", "None of it", "The whole quantity", "Twice the quantity"],
          correctIndex: 2,
        },
      ],
    },
    {
      key: "convert-percent-fraction-decimal",
      title: "Converting between percent, fraction and decimal",
      difficulty: "core",
      summary:
        "To turn a percent into a decimal you divide by 100; to turn a decimal into a percent you multiply by 100.",
      analogy: "Moving between percent and decimal is just sliding the decimal point two places.",
      keyPoints: [
        "Percent to decimal: divide by 100 (25% -> 0.25).",
        "Decimal to percent: multiply by 100 (0.6 -> 60%).",
        "Percent to fraction: write over 100 and simplify (40% -> 40/100 = 2/5).",
      ],
      deeperBody:
        "These three forms describe the same number, so any calculation can use whichever is easiest. Decimals are convenient for multiplying, fractions for exact simplification, and percents for communication.",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Write 25% as a decimal.",
          choices: ["2.5", "0.25", "0.025", "25.0"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Write 0.6 as a percentage.",
          choices: ["6%", "0.6%", "60%", "600%"],
          correctIndex: 2,
        },
        {
          type: "mcq",
          difficulty: "advanced",
          prompt: "Simplify 40% as a fraction in lowest terms.",
          choices: ["4/10", "2/5", "40/100", "1/4"],
          correctIndex: 1,
        },
      ],
    },
    {
      key: "percent-of-a-quantity",
      title: "Finding a percentage of a quantity",
      difficulty: "core",
      summary:
        "To find a percent of a number, convert the percent to a decimal (or fraction) and multiply by the number.",
      analogy: "Finding 20% of a bill is like taking one-fifth of it before you pay.",
      keyPoints: [
        "20% of 50 = 0.20 x 50 = 10.",
        "Convert the percent first, then multiply.",
        "Percentages can exceed 100% (e.g. 150% of 40 = 60).",
      ],
      deeperBody:
        "A common shortcut is to find 10% first (move the decimal one place) and scale from there: 10% of 80 is 8, so 30% of 80 is 24. This makes mental estimation fast and reliable.",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          prompt: "What is 20% of 50?",
          choices: ["5", "10", "20", "25"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "What is 10% of 80?",
          choices: ["0.8", "8", "18", "800"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "advanced",
          prompt: "What is 150% of 40?",
          choices: ["40", "60", "55", "600"],
          correctIndex: 1,
        },
      ],
    },
    {
      key: "ratios-and-proportions",
      title: "Ratios and proportions",
      difficulty: "core",
      summary:
        "A ratio compares two quantities; a proportion states that two ratios are equal and lets you solve for a missing value.",
      analogy: "A recipe ratio of 2 cups flour to 1 cup sugar scales up by keeping the same balance.",
      keyPoints: [
        "A ratio 2:1 means two of the first for every one of the second.",
        "Equivalent ratios scale both sides by the same factor (2:1 = 4:2).",
        "A proportion a/b = c/d can be solved by cross-multiplying.",
      ],
      deeperBody:
        "Ratios and percentages are two ways of expressing proportion. A ratio of 3:1 means the first part is 3/4 of the total, or 75%, because the whole has 3 + 1 = 4 parts.",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Which ratio is equivalent to 2:1?",
          choices: ["1:2", "4:2", "3:4", "2:3"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "advanced",
          prompt: "In a mix with ratio 3:1, what fraction of the total is the first part?",
          choices: ["1/4", "1/3", "3/4", "3/1"],
          correctIndex: 2,
        },
        {
          type: "mcq",
          difficulty: "advanced",
          prompt: "If 2/4 = x/10, what is x?",
          choices: ["2", "4", "5", "8"],
          correctIndex: 2,
        },
      ],
    },
    {
      key: "percentage-change",
      title: "Percentage increase and decrease",
      difficulty: "advanced",
      summary:
        "Percentage change is the difference between two values divided by the original value, expressed as a percent.",
      analogy: "A price rising from 100 to 120 grows by 20 out of the original 100, a 20% increase.",
      keyPoints: [
        "Change = (new - old) / old, then multiply by 100.",
        "A rise from 100 to 120 is a 20% increase.",
        "The base is always the original value, not the new one.",
      ],
      deeperBody:
        "Increases and decreases are not symmetric. A 20% rise followed by a 20% fall does not return to the start: 100 becomes 120, then 120 minus 20% (24) is 96, because the second percentage is taken on a different base.",
      misconception:
        "Calculating percentage change against the new value, or assuming a percent rise is undone by an equal percent fall.",
      prerequisiteGap: "Which value serves as the base (denominator) when computing percentage change",
      questions: [
        {
          type: "mcq",
          difficulty: "advanced",
          targetsMisconception: "wrong-base",
          prompt: "A price rises from 100 to 120. What is the percentage increase?",
          choices: ["12%", "16.7%", "20%", "120%"],
          correctIndex: 2,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "A value falls from 200 to 150. What is the percentage decrease?",
          choices: ["25%", "33%", "50%", "75%"],
          correctIndex: 0,
        },
        {
          type: "mcq",
          difficulty: "advanced",
          prompt: "100 increases by 20%, then that result decreases by 20%. What is the final value?",
          choices: ["100", "96", "98", "104"],
          correctIndex: 1,
        },
      ],
      remediation: {
        title: "The base is always the original value",
        summary:
          "Percentage change compares the change to where you started. The original (old) value goes in the denominator, never the new value.",
        analogy: "Measure how far you have travelled from your starting line, not from the finish.",
        keyPoints: [
          "Subtract: new minus old gives the raw change.",
          "Divide that change by the old value, not the new one.",
          "Multiply by 100 to express it as a percent.",
        ],
        question: {
          type: "mcq",
          difficulty: "intro",
          prompt: "When finding percentage change, which value goes in the denominator?",
          choices: ["The new value", "The original (old) value", "Their sum", "Their average"],
          correctIndex: 1,
        },
      },
    },
  ],
};

// ---------------------------------- Algebra ---------------------------------

const algebra: KBTopic = {
  id: "algebra",
  match: ["algebra", "equation", "solve for x", "linear equation"],
  goalTitle: "Solve basic linear equations",
  rationale:
    "Linear equations are learned step by step: what a variable is, what it means to keep an equation balanced, how to undo operations, solving multi-step equations, and finally checking solutions.",
  concepts: [
    {
      key: "what-is-a-variable",
      title: "Variables and expressions",
      difficulty: "intro",
      summary:
        "A variable is a letter that stands for an unknown number; an expression combines variables and numbers with operations.",
      analogy: "A variable is like a labelled box whose contents you have not opened yet.",
      keyPoints: [
        "A variable such as x represents an unknown value.",
        "An expression like 2x + 3 has no equals sign.",
        "An equation states that two expressions are equal.",
      ],
      deeperBody:
        "The same variable always stands for the same value within one equation. Solving means discovering the single number that the letter must represent to make the equation true.",
      questions: [
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "In the expression 2x + 3, what is x?",
          choices: ["A fixed number 2", "An unknown value", "Always zero", "The answer"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "Which of these is an equation rather than an expression?",
          choices: ["3x + 1", "x - 7", "2x = 10", "5x"],
          correctIndex: 2,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "What does the coefficient 4 mean in the term 4x?",
          choices: ["Add 4 to x", "4 multiplied by x", "x raised to the 4th power", "x divided by 4"],
          correctIndex: 1,
        },
      ],
    },
    {
      key: "keeping-balance",
      title: "Keeping the equation balanced",
      difficulty: "core",
      summary:
        "Whatever operation you do to one side of an equation, you must do to the other side to keep it true.",
      analogy: "An equation is a balanced scale: add to one pan and you must add the same to the other.",
      keyPoints: [
        "Both sides stay equal only if treated identically.",
        "You may add, subtract, multiply or divide both sides.",
        "The goal is to isolate the variable on one side.",
      ],
      deeperBody:
        "Balancing is the single rule behind all equation solving. Each legal step replaces the equation with a simpler one that has exactly the same solution, until the variable stands alone.",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          prompt: "If you add 5 to the left side of an equation, what must you do to the right side?",
          choices: ["Subtract 5", "Add 5", "Multiply by 5", "Leave it unchanged"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "What is the goal when solving for a variable?",
          choices: [
            "To make both sides zero",
            "To isolate the variable on one side",
            "To remove the equals sign",
            "To add as many terms as possible",
          ],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "An equation is best compared to which object?",
          choices: ["A one-way arrow", "A balanced scale", "A ladder", "A clock"],
          correctIndex: 1,
        },
      ],
    },
    {
      key: "undoing-operations",
      title: "Undoing operations with inverses",
      difficulty: "core",
      summary:
        "To isolate a variable, apply the inverse operation: subtraction undoes addition, and division undoes multiplication.",
      analogy: "To unwrap a present you reverse the wrapping steps in the opposite order.",
      keyPoints: [
        "Subtraction undoes addition, and vice versa.",
        "Division undoes multiplication, and vice versa.",
        "Undo addition/subtraction before multiplication/division.",
      ],
      deeperBody:
        "For x + 4 = 9, subtract 4 from both sides to get x = 5. For 3x = 12, divide both sides by 3 to get x = 4. Each move strips away one operation surrounding the variable.",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Solve x + 4 = 9.",
          choices: ["x = 13", "x = 5", "x = 36", "x = 4"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Solve 3x = 12.",
          choices: ["x = 9", "x = 15", "x = 4", "x = 36"],
          correctIndex: 2,
        },
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "Which operation undoes multiplication?",
          choices: ["Addition", "Subtraction", "Division", "Squaring"],
          correctIndex: 2,
        },
      ],
    },
    {
      key: "multi-step-equations",
      title: "Solving multi-step equations",
      difficulty: "advanced",
      summary:
        "When several operations surround the variable, undo them in reverse order: addition/subtraction first, then multiplication/division.",
      analogy: "Peel the operations off like layers of an onion, outermost first.",
      keyPoints: [
        "Undo addition or subtraction before division or multiplication.",
        "For 2x + 3 = 11, subtract 3, then divide by 2.",
        "Each step yields the same solution as the original.",
      ],
      deeperBody:
        "Solving 2x + 3 = 11: subtracting 3 gives 2x = 8, then dividing by 2 gives x = 4. Reversing the order of operations is what gradually frees the variable.",
      misconception:
        "Dividing the whole equation by the coefficient before removing the added constant, so the constant is mis-divided.",
      prerequisiteGap: "The correct order in which to undo operations in a multi-step equation",
      questions: [
        {
          type: "mcq",
          difficulty: "advanced",
          targetsMisconception: "wrong-order-undo",
          prompt: "Solve 2x + 3 = 11. What is x?",
          choices: ["x = 7", "x = 4", "x = 5.5", "x = 8"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "advanced",
          prompt: "Solve 5x - 2 = 13.",
          choices: ["x = 3", "x = 2.2", "x = 11", "x = 15"],
          correctIndex: 0,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "In 2x + 3 = 11, which step should you do first?",
          choices: [
            "Divide both sides by 2",
            "Subtract 3 from both sides",
            "Add 3 to both sides",
            "Multiply both sides by 2",
          ],
          correctIndex: 1,
        },
      ],
      remediation: {
        title: "Undo addition before division",
        summary:
          "In a multi-step equation, first move the constant by subtraction or addition, and only then divide by the coefficient.",
        analogy: "Take off your coat before your shirt: outer layers come off first.",
        keyPoints: [
          "Step 1: undo the added or subtracted constant.",
          "Step 2: divide by the number multiplying the variable.",
          "Doing it out of order divides the constant incorrectly.",
        ],
        question: {
          type: "mcq",
          difficulty: "intro",
          prompt: "To solve 2x + 3 = 11, which should you undo first?",
          choices: ["The + 3", "The x 2", "The = 11", "Nothing"],
          correctIndex: 0,
        },
      },
    },
  ],
};

// ---------------------------------- Grammar ---------------------------------

const grammar: KBTopic = {
  id: "grammar",
  match: ["grammar", "tense", "verb tense", "past tense", "present perfect"],
  goalTitle: "Use English verb tenses correctly",
  rationale:
    "Verb tenses are best learned by time frame: the present, the simple past, the future, the perfect aspect, and the progressive aspect, each contrasted with the others.",
  concepts: [
    {
      key: "simple-present",
      title: "The simple present",
      difficulty: "intro",
      summary:
        "The simple present describes habits, general truths, and repeated actions, not actions happening at this exact moment.",
      analogy: "It is the tense of timetables and routines: 'the train leaves at nine'.",
      keyPoints: [
        "Used for habits and routines ('I walk to work').",
        "Used for general facts ('water boils at 100C').",
        "Third-person singular usually adds -s ('she walks').",
      ],
      deeperBody:
        "Although it is called 'present', the simple present rarely means 'right now'. For an action in progress at this moment, English uses the present progressive instead ('I am walking').",
      questions: [
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "Which sentence uses the simple present correctly for a habit?",
          choices: [
            "She is walking to school every day",
            "She walks to school every day",
            "She walked to school every day",
            "She has walked to school every day",
          ],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "What is the correct third-person singular form: 'He ___ tennis on Sundays.'?",
          choices: ["play", "plays", "playing", "played"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "The simple present is most appropriate for which of these?",
          choices: [
            "An action happening at this very second",
            "A general truth or habit",
            "A finished action in the past",
            "A promise about the future",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      key: "simple-past",
      title: "The simple past",
      difficulty: "core",
      summary:
        "The simple past describes completed actions at a definite time in the past.",
      analogy: "It is the tense of finished stories: 'yesterday I finished the book'.",
      keyPoints: [
        "Used for completed actions ('I visited Rome last year').",
        "Regular verbs add -ed ('walk' -> 'walked').",
        "Many common verbs are irregular ('go' -> 'went').",
      ],
      deeperBody:
        "The simple past pairs naturally with a finished time expression such as 'yesterday' or 'in 2010'. The action is over and disconnected from the present moment.",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          prompt: "What is the simple past of 'go'?",
          choices: ["goed", "gone", "went", "going"],
          correctIndex: 2,
        },
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "What is the simple past of the regular verb 'walk'?",
          choices: ["walk", "walks", "walked", "walking"],
          correctIndex: 2,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Which time expression fits the simple past best?",
          choices: ["right now", "every day", "yesterday", "already"],
          correctIndex: 2,
        },
      ],
    },
    {
      key: "future-tenses",
      title: "Talking about the future",
      difficulty: "core",
      summary:
        "English expresses the future mainly with 'will' for predictions and decisions, and 'going to' for plans and intentions.",
      analogy: "'Will' is a spontaneous decision; 'going to' is a plan you already had in mind.",
      keyPoints: [
        "'will' + base verb for predictions ('it will rain').",
        "'going to' + base verb for plans ('I am going to study').",
        "The base verb does not change form after 'will'.",
      ],
      deeperBody:
        "Both forms point forward in time, but they differ in nuance. 'I will help you' often signals a decision made at the moment of speaking, while 'I am going to help you' suggests the intention existed beforehand.",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Which sentence states a prediction using 'will' correctly?",
          choices: [
            "It will rains tomorrow",
            "It will rain tomorrow",
            "It will rained tomorrow",
            "It wills rain tomorrow",
          ],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Which form best expresses a plan decided in advance?",
          choices: [
            "I will study tonight (sudden decision)",
            "I am going to study tonight",
            "I study tonight",
            "I studied tonight",
          ],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "What verb form follows 'will'?",
          choices: ["the base form", "the -ing form", "the past form", "the -s form"],
          correctIndex: 0,
        },
      ],
    },
    {
      key: "present-perfect",
      title: "The present perfect",
      difficulty: "advanced",
      summary:
        "The present perfect links the past to the present, used for actions with present relevance or at an unspecified past time.",
      analogy: "It is a bridge between then and now: 'I have lost my keys' (so I cannot get in now).",
      keyPoints: [
        "Formed with 'have/has' + past participle ('have eaten').",
        "Used when the exact past time is unstated or irrelevant.",
        "Often paired with 'already', 'yet', 'ever', 'since'.",
      ],
      deeperBody:
        "The key contrast is with the simple past. 'I visited Paris in 2019' fixes a finished time, so it is simple past; 'I have visited Paris' leaves the time open and focuses on the present result or experience.",
      misconception:
        "Using the present perfect with a finished past time marker, e.g. 'I have seen him yesterday' instead of the simple past.",
      prerequisiteGap: "When the present perfect is allowed versus when the simple past is required",
      questions: [
        {
          type: "mcq",
          difficulty: "advanced",
          targetsMisconception: "perfect-with-finished-time",
          prompt: "Which sentence is correct?",
          choices: [
            "I have seen him yesterday",
            "I saw him yesterday",
            "I have saw him yesterday",
            "I seen him yesterday",
          ],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "How is the present perfect formed?",
          choices: [
            "'will' + base verb",
            "'have/has' + past participle",
            "'be' + -ing form",
            "base verb + -ed only",
          ],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "advanced",
          prompt: "Which adverb fits naturally with the present perfect?",
          choices: ["yesterday", "already", "last week", "in 2010"],
          correctIndex: 1,
        },
      ],
      remediation: {
        title: "Present perfect avoids a finished time",
        summary:
          "Use the present perfect only when the past time is unspecified. If a finished time word like 'yesterday' appears, use the simple past instead.",
        analogy: "Pin the action to a date and you must use the simple past; leave it floating and the present perfect fits.",
        keyPoints: [
          "Finished time word present -> simple past.",
          "No stated time, present relevance -> present perfect.",
          "'yesterday', 'last year', 'in 2010' force the simple past.",
        ],
        question: {
          type: "mcq",
          difficulty: "intro",
          prompt: "Choose the correct sentence.",
          choices: [
            "She has finished it last night",
            "She finished it last night",
            "She have finished it last night",
            "She finish it last night",
          ],
          correctIndex: 1,
        },
      },
    },
  ],
};

// --------------------------------- Geography --------------------------------

const geography: KBTopic = {
  id: "geography",
  match: ["geography", "capital", "continent", "country"],
  goalTitle: "Learn the basics of world geography",
  rationale:
    "World geography starts with the big picture: the continents, then the oceans, then how countries and capitals relate, and finally reading position with latitude and longitude.",
  concepts: [
    {
      key: "the-continents",
      title: "The seven continents",
      difficulty: "intro",
      summary:
        "Earth's land is grouped into seven continents: Africa, Antarctica, Asia, Europe, North America, South America and Australia.",
      analogy: "Think of the continents as the seven great islands of land on the globe.",
      keyPoints: [
        "There are seven continents in the common model.",
        "Asia is the largest by area and population.",
        "Antarctica is the southernmost and is ice-covered.",
      ],
      deeperBody:
        "Asia is by far the largest continent and holds most of the world's people, while Antarctica, though large, has almost no permanent population. Australia is the smallest continent.",
      questions: [
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "How many continents are there in the standard seven-continent model?",
          choices: ["Five", "Six", "Seven", "Eight"],
          correctIndex: 2,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Which is the largest continent by area?",
          choices: ["Africa", "Asia", "North America", "Europe"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Which continent is covered by ice and lies furthest south?",
          choices: ["Australia", "Antarctica", "South America", "Europe"],
          correctIndex: 1,
        },
      ],
    },
    {
      key: "the-oceans",
      title: "The five oceans",
      difficulty: "intro",
      summary:
        "Earth's water is divided into five oceans: the Pacific, Atlantic, Indian, Southern and Arctic.",
      analogy: "The oceans are the connected seas that wrap around and between the continents.",
      keyPoints: [
        "The Pacific is the largest and deepest ocean.",
        "The Atlantic separates the Americas from Europe and Africa.",
        "The Arctic is the smallest and coldest ocean.",
      ],
      deeperBody:
        "The Pacific Ocean is larger than all the land area of Earth combined. The oceans are interconnected, so they form one continuous body of salt water broken up by the continents.",
      questions: [
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "Which is the largest ocean?",
          choices: ["Atlantic", "Indian", "Pacific", "Arctic"],
          correctIndex: 2,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Which ocean lies between the Americas and Europe and Africa?",
          choices: ["Pacific", "Atlantic", "Indian", "Southern"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Which ocean is the smallest and coldest?",
          choices: ["Arctic", "Indian", "Southern", "Atlantic"],
          correctIndex: 0,
        },
      ],
    },
    {
      key: "countries-and-capitals",
      title: "Countries and their capitals",
      difficulty: "core",
      summary:
        "A capital is the city where a country's government is based; it is not always the largest city.",
      analogy: "A capital is a country's headquarters, not necessarily its biggest branch.",
      keyPoints: [
        "The capital hosts the national government.",
        "The capital is not always the largest city.",
        "Examples: Paris (France), Tokyo (Japan), Canberra (Australia).",
      ],
      deeperBody:
        "Many countries place their capital in a city other than their biggest. Australia's capital is Canberra, not Sydney; the United States' capital is Washington, D.C., not New York; Brazil's is Brasilia, not Sao Paulo.",
      misconception:
        "Assuming a country's capital is always its largest or most famous city.",
      prerequisiteGap: "What defines a capital city (seat of government) versus the largest city",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          targetsMisconception: "capital-is-largest",
          prompt: "What is the capital of Australia?",
          choices: ["Sydney", "Melbourne", "Canberra", "Perth"],
          correctIndex: 2,
        },
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "What is the capital of Japan?",
          choices: ["Osaka", "Tokyo", "Kyoto", "Nagoya"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "advanced",
          prompt: "What primarily defines a capital city?",
          choices: [
            "It has the most people",
            "It is the seat of the national government",
            "It has the busiest airport",
            "It is the oldest city",
          ],
          correctIndex: 1,
        },
      ],
      remediation: {
        title: "Capital means seat of government",
        summary:
          "A capital is chosen as the centre of government, which is why it can be a smaller, purpose-built, or central city rather than the largest one.",
        analogy: "The capital is where the country's 'control room' sits, not where the most people live.",
        keyPoints: [
          "Capital = location of the national government.",
          "It may be deliberately separate from the biggest city.",
          "Canberra, Brasilia and Washington, D.C. are examples.",
        ],
        question: {
          type: "mcq",
          difficulty: "intro",
          prompt: "A capital city is the one that...",
          choices: [
            "always has the largest population",
            "is the seat of the national government",
            "has the tallest buildings",
            "is closest to the coast",
          ],
          correctIndex: 1,
        },
      },
    },
    {
      key: "latitude-and-longitude",
      title: "Latitude and longitude",
      difficulty: "advanced",
      summary:
        "Latitude lines run east-west and measure distance north or south of the equator; longitude lines run north-south and measure distance east or west of the prime meridian.",
      analogy: "Latitude and longitude form a grid, like the rows and columns of a global map.",
      keyPoints: [
        "The equator is 0 degrees latitude.",
        "The prime meridian is 0 degrees longitude.",
        "Together they pinpoint any location on Earth.",
      ],
      deeperBody:
        "Latitude lines (parallels) circle the globe horizontally and stay the same distance apart, while longitude lines (meridians) converge at the poles. A pair of latitude and longitude values gives a unique address for any point.",
      questions: [
        {
          type: "mcq",
          difficulty: "advanced",
          prompt: "What is the latitude of the equator?",
          choices: ["90 degrees", "0 degrees", "180 degrees", "45 degrees"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Lines of latitude measure distance in which direction?",
          choices: ["East or west", "North or south", "Up or down", "Toward the centre"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "advanced",
          prompt: "The prime meridian marks which value?",
          choices: ["0 degrees latitude", "0 degrees longitude", "the equator", "the date line"],
          correctIndex: 1,
        },
      ],
    },
  ],
};

// --------------------------------- Chemistry --------------------------------

const chemistry: KBTopic = {
  id: "chemistry",
  match: ["chemistry", "atom", "molecule", "element", "periodic"],
  goalTitle: "Understand atoms, elements and molecules",
  rationale:
    "Chemistry builds upward: the atom and its parts, what an element is, how the periodic table organizes elements, how atoms bond into molecules, and how to read a chemical formula.",
  concepts: [
    {
      key: "the-atom",
      title: "The structure of the atom",
      difficulty: "intro",
      summary:
        "An atom has a central nucleus of protons and neutrons, surrounded by electrons.",
      analogy: "An atom is like a tiny solar system: a dense nucleus at the centre with electrons around it.",
      keyPoints: [
        "Protons carry positive charge; electrons carry negative charge.",
        "Neutrons have no charge and sit in the nucleus.",
        "Most of an atom's mass is in its nucleus.",
      ],
      deeperBody:
        "Protons and neutrons are packed into the small, heavy nucleus, while the much lighter electrons occupy the comparatively vast space around it. A neutral atom has equal numbers of protons and electrons.",
      questions: [
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "Which particle carries a negative charge?",
          choices: ["Proton", "Neutron", "Electron", "Nucleus"],
          correctIndex: 2,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "Where is most of an atom's mass located?",
          choices: ["In the electrons", "In the nucleus", "In empty space", "Evenly spread out"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "Which particle has no electric charge?",
          choices: ["Proton", "Electron", "Neutron", "Ion"],
          correctIndex: 2,
        },
      ],
    },
    {
      key: "what-is-an-element",
      title: "What an element is",
      difficulty: "core",
      summary:
        "An element is a substance made of only one kind of atom, defined by its number of protons (its atomic number).",
      analogy: "An element is a pure ingredient; every atom in it is the same type.",
      keyPoints: [
        "An element has only one type of atom.",
        "The atomic number is the number of protons.",
        "Changing the proton count changes the element itself.",
      ],
      deeperBody:
        "The proton count is what makes an element that element: every carbon atom has 6 protons, and any atom with 6 protons is carbon. Electrons can be gained or lost without changing the element.",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          prompt: "What defines which element an atom is?",
          choices: [
            "Its number of neutrons",
            "Its number of protons",
            "Its number of electrons",
            "Its total mass only",
          ],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "An element is made of how many kinds of atom?",
          choices: ["One", "Two", "Several", "It varies"],
          correctIndex: 0,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "An atom with 6 protons is always which element?",
          choices: ["Oxygen", "Hydrogen", "Carbon", "Helium"],
          correctIndex: 2,
        },
      ],
    },
    {
      key: "periodic-table",
      title: "The periodic table",
      difficulty: "core",
      summary:
        "The periodic table arranges the elements by increasing atomic number, grouping those with similar properties together.",
      analogy: "It is a sorted library of elements, with related ones shelved in the same column.",
      keyPoints: [
        "Elements are ordered by atomic number.",
        "Columns (groups) share similar chemical behaviour.",
        "Each element has a one- or two-letter symbol.",
      ],
      deeperBody:
        "Elements in the same column, such as the noble gases, behave similarly because they have the same number of outer electrons. The symbol H stands for hydrogen, O for oxygen, and Na for sodium.",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          prompt: "The periodic table orders elements by what?",
          choices: ["Alphabetical name", "Increasing atomic number", "Date discovered", "Colour"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "What is the chemical symbol for oxygen?",
          choices: ["Ox", "O", "Og", "Om"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "advanced",
          prompt: "Elements in the same column of the periodic table tend to have what in common?",
          choices: [
            "The same number of protons",
            "Similar chemical properties",
            "Identical mass",
            "The same colour",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      key: "molecules-and-formulas",
      title: "Molecules and chemical formulas",
      difficulty: "advanced",
      summary:
        "A molecule forms when two or more atoms bond together; a chemical formula shows which atoms and how many are present.",
      analogy: "A molecule is like a word built from atom 'letters'; the formula spells it out.",
      keyPoints: [
        "Atoms bond to form molecules (H2O is water).",
        "Subscripts count atoms of each element.",
        "A compound contains atoms of more than one element.",
      ],
      deeperBody:
        "In the formula H2O, the subscript 2 means two hydrogen atoms, and the absence of a subscript on O means one oxygen atom, so a water molecule has three atoms in total.",
      misconception:
        "Reading the subscript in a formula such as H2O as the number of molecules rather than the number of atoms of that element.",
      prerequisiteGap: "What the subscript number in a chemical formula actually counts",
      questions: [
        {
          type: "mcq",
          difficulty: "advanced",
          targetsMisconception: "subscript-means-molecules",
          prompt: "How many hydrogen atoms are in one molecule of H2O?",
          choices: ["1", "2", "3", "12"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "What forms when two or more atoms bond together?",
          choices: ["An element", "A molecule", "A proton", "An isotope"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "advanced",
          prompt: "How many atoms in total are in one molecule of H2O?",
          choices: ["2", "3", "4", "1"],
          correctIndex: 1,
        },
      ],
      remediation: {
        title: "Subscripts count atoms, not molecules",
        summary:
          "In a chemical formula, a subscript tells you how many atoms of the element just before it are in a single molecule.",
        analogy: "The small number is a tally of atoms inside one molecule, like counting letters in a word.",
        keyPoints: [
          "The subscript applies to the element directly to its left.",
          "No subscript means exactly one atom.",
          "In H2O: 2 hydrogen atoms and 1 oxygen atom.",
        ],
        question: {
          type: "mcq",
          difficulty: "intro",
          prompt: "In the formula CO2, what does the subscript 2 tell you?",
          choices: [
            "There are two molecules",
            "There are two oxygen atoms",
            "There are two carbon atoms",
            "There are two of each atom",
          ],
          correctIndex: 1,
        },
      },
    },
  ],
};

// -------------------------------- Programming -------------------------------

const programming: KBTopic = {
  id: "programming",
  match: ["variable", "loop", "programming basics", "for loop", "iteration"],
  goalTitle: "Learn variables and loops in programming",
  rationale:
    "Programming fundamentals build in order: what a variable is, how assignment works, what a loop does, how a counter controls iteration, and how loops can repeat the wrong number of times.",
  concepts: [
    {
      key: "what-is-a-variable",
      title: "What a variable is",
      difficulty: "intro",
      summary:
        "A variable is a named container that stores a value your program can read and change later.",
      analogy: "A variable is a labelled box you can put a value into and take it out of again.",
      keyPoints: [
        "A variable has a name and holds a value.",
        "You can read its value by using its name.",
        "Its value can change while the program runs.",
      ],
      deeperBody:
        "Naming values lets a program refer to them and update them over time. The name stays the same while the stored value can be replaced, which is what makes variables flexible.",
      questions: [
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "What does a variable do in a program?",
          choices: [
            "Stores a named value that can be used and changed",
            "Permanently fixes a value that can never change",
            "Draws something on screen",
            "Connects to the internet",
          ],
          correctIndex: 0,
        },
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "Which is the best everyday analogy for a variable?",
          choices: ["A one-time receipt", "A labelled box holding a value", "A locked safe", "A printed photo"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "How do you use the value stored in a variable?",
          choices: ["By deleting it", "By referring to its name", "By restarting the program", "You cannot"],
          correctIndex: 1,
        },
      ],
    },
    {
      key: "assignment",
      title: "Assigning values to variables",
      difficulty: "core",
      summary:
        "Assignment, written with '=', stores the value on the right into the variable on the left; it is not a test of equality.",
      analogy: "Assignment is putting a value into the box, not checking whether two things are equal.",
      keyPoints: [
        "'x = 5' stores 5 in x.",
        "The right side is evaluated, then stored on the left.",
        "Equality testing usually uses '==' instead.",
      ],
      deeperBody:
        "After 'x = 5' then 'x = x + 1', x holds 6: the right side x + 1 is computed first using the old value, then the result is stored back into x. This re-assignment pattern is how counters work.",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          prompt: "After 'x = 5' and then 'x = x + 1', what is x?",
          choices: ["5", "6", "1", "x + 1"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "What does the single '=' usually mean in code?",
          choices: [
            "Test whether two values are equal",
            "Store the right-hand value in the variable on the left",
            "Print a value",
            "Delete a variable",
          ],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "advanced",
          prompt: "In 'x = x + 1', which value of x is used on the right side?",
          choices: ["The new value", "The current (old) value", "Always zero", "It causes an error"],
          correctIndex: 1,
        },
      ],
    },
    {
      key: "what-is-a-loop",
      title: "What a loop does",
      difficulty: "core",
      summary:
        "A loop repeats a block of code multiple times, so you do not have to write the same statements over and over.",
      analogy: "A loop is like telling someone 'do ten push-ups' instead of saying 'do a push-up' ten times.",
      keyPoints: [
        "Loops repeat a block of code.",
        "They avoid copying the same lines repeatedly.",
        "A condition decides whether to repeat again.",
      ],
      deeperBody:
        "Each pass through a loop is called an iteration. The loop checks a condition before (or after) each iteration to decide whether to run the body again or stop.",
      questions: [
        {
          type: "mcq",
          difficulty: "core",
          prompt: "What is the main purpose of a loop?",
          choices: [
            "To repeat a block of code multiple times",
            "To store a single value",
            "To end the program",
            "To name a function",
          ],
          correctIndex: 0,
        },
        {
          type: "mcq",
          difficulty: "intro",
          prompt: "What is one run through a loop's body called?",
          choices: ["A variable", "An iteration", "A function", "A condition"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "What decides whether a loop runs again?",
          choices: ["Its name", "A condition", "Its colour", "The variable type"],
          correctIndex: 1,
        },
      ],
    },
    {
      key: "for-loop-counter",
      title: "The for loop and its counter",
      difficulty: "advanced",
      summary:
        "A for loop uses a counter variable that starts at an initial value, is checked against a condition, and updates after each iteration.",
      analogy: "The counter is a tally that ticks up once per repetition until it reaches the limit.",
      keyPoints: [
        "A for loop has a start value, a condition, and an update step.",
        "Counters often start at 0 in many languages.",
        "The loop stops when the condition becomes false.",
      ],
      deeperBody:
        "A loop written 'for i from 0 while i < 5, i = i + 1' runs with i equal to 0, 1, 2, 3, 4, which is exactly 5 times. The condition i < 5 is false once i reaches 5, so the body does not run for i = 5.",
      misconception:
        "Miscounting iterations of a for loop, especially with a zero-based counter and a 'less than' condition (an off-by-one error).",
      prerequisiteGap: "How the start value, condition, and update together determine the iteration count",
      questions: [
        {
          type: "mcq",
          difficulty: "advanced",
          targetsMisconception: "off-by-one",
          prompt: "How many times does the body run: start i = 0, repeat while i < 5, with i = i + 1 each time?",
          choices: ["4 times", "5 times", "6 times", "Infinitely"],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "core",
          prompt: "What three parts does a typical for loop have?",
          choices: [
            "A name, a type, and a value",
            "A start value, a condition, and an update step",
            "A title, a body, and a footer",
            "Only a condition",
          ],
          correctIndex: 1,
        },
        {
          type: "mcq",
          difficulty: "advanced",
          prompt: "When does a for loop stop repeating?",
          choices: [
            "When its condition becomes false",
            "After exactly ten runs always",
            "When the counter reaches zero",
            "It never stops on its own",
          ],
          correctIndex: 0,
        },
      ],
      remediation: {
        title: "Counting iterations of a for loop",
        summary:
          "With a counter starting at 0 and the condition 'less than N', the loop runs for the values 0 up to N - 1, which is exactly N times.",
        analogy: "Counting 0, 1, 2, 3, 4 gives five numbers even though it stops before five.",
        keyPoints: [
          "Start at 0 and stop before N: that is N iterations.",
          "List the counter values to count them safely.",
          "'less than 5' from 0 yields 0,1,2,3,4 = 5 runs.",
        ],
        question: {
          type: "mcq",
          difficulty: "intro",
          prompt: "Starting at 0 and running while the counter is less than 3, how many times does the loop run?",
          choices: ["2", "3", "4", "0"],
          correctIndex: 1,
        },
      },
    },
  ],
};

export const EXTRA_TOPICS: KBTopic[] = [
  percentages,
  algebra,
  grammar,
  geography,
  chemistry,
  programming,
];
