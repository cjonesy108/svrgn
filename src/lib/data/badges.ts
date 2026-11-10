export type Difficulty = 'foundation' | 'practiced' | 'demanding';
export type ProofMethod = 'self_attestation';

export interface LessonLink {
  label: string;
  url: string;
}

export interface Lesson {
  summary: string;
  steps: string[];
  link?: LessonLink;
}

export interface Badge {
  id: string;
  title: string;
  domainId: string;
  description: string;
  criteria: string[];
  proofMethod: ProofMethod;
  xp: number;
  difficulty: Difficulty;
  prerequisites: string[];
  effort: string;
  lesson: Lesson;
}

const XP: Record<Difficulty, number> = {
  foundation: 100,
  practiced: 200,
  demanding: 350,
};

function badge(input: Omit<Badge, 'proofMethod' | 'xp'>): Badge {
  return {
    ...input,
    proofMethod: 'self_attestation',
    xp: XP[input.difficulty],
  };
}

export const BADGES: Badge[] = [
  badge({
    id: 'strength-consistency',
    title: '30-Day Strength Consistency',
    domainId: 'physical',
    difficulty: 'practiced',
    prerequisites: [],
    effort: '30 days, about 45 minutes a session',
    description: 'Keep a strength practice for a full month. A good week does not count.',
    criteria: [
      'Complete at least three planned strength sessions in each of four consecutive weeks.',
      'Log the date and the main movements for every session you count.',
      'If a week drops below three sessions, start the four weeks over.',
    ],
    lesson: {
      summary: 'The sessions can be simple. The schedule cannot be optional.',
      steps: [
        'Pick three days and two or three movements you can repeat.',
        'Write what counts as a session before day one.',
        'Log the work the same day. Do not rebuild the month from memory.',
      ],
      link: {
        label: 'Physical Activity Guidelines',
        url: 'https://health.gov/our-work/nutrition-physical-activity/physical-activity-guidelines',
      },
    },
  }),
  badge({
    id: 'self-defense',
    title: 'Basic Self-Defense Competency',
    domainId: 'physical',
    difficulty: 'practiced',
    prerequisites: [],
    effort: '8 coached sessions',
    description: 'Learn enough to make space and leave. This is not a fight record.',
    criteria: [
      'Finish a beginner course or eight coached sessions in a striking, grappling, or self-defense art.',
      'With a partner or coach, show a stable frame, a break from a common grab, and how you exit.',
      'Write the rule you will use for when to train and when to disengage.',
    ],
    lesson: {
      summary: 'Train with a qualified coach. The standard is to create space and leave, not to collect wins.',
      steps: [
        'Choose a gym or instructor you can reach on a weeknight.',
        'Tell the coach the goal is exit and control, not sparring highlights.',
        'After the eighth session, write the three movements you can repeat under pressure.',
      ],
    },
  }),
  badge({
    id: 'recovery-protocol',
    title: 'Recovery Protocol Established',
    domainId: 'physical',
    difficulty: 'foundation',
    prerequisites: [],
    effort: '14 days',
    description: 'Put a sleep window and a downshift practice in writing, then keep them.',
    criteria: [
      'Write a target bedtime and wake time that leave at least seven hours in bed.',
      'Name one mobility or downshift practice you will use on rest days.',
      'Follow both for 14 days and note the days you missed.',
    ],
    lesson: {
      summary: 'Recovery is a plan, not a feeling you wait for.',
      steps: [
        'Set the wake time first. Work backward to bedtime.',
        'Pick a ten-minute practice you can do on the floor.',
        'Mark misses the next morning instead of hiding them.',
      ],
    },
  }),
  badge({
    id: 'zone-2-base',
    title: 'Zone 2 Aerobic Base',
    domainId: 'physical',
    difficulty: 'practiced',
    prerequisites: ['recovery-protocol'],
    effort: '8 sessions in 30 days',
    description: 'Build an easy aerobic base you can talk through.',
    criteria: [
      'Complete eight sessions of easy cardio, each at least 30 minutes, inside 30 days.',
      'Keep the effort low enough that you can speak in full sentences.',
      'Record the date and duration of each session.',
    ],
    lesson: {
      summary: 'Easy work is still work. If you cannot talk, it is not this badge.',
      steps: [
        'Pick walking, cycling, or a similar mode you can repeat.',
        'Stop the session if you have to gasp to finish a sentence, then continue easier.',
        'Do not stack these on top of a week you already failed to sleep.',
      ],
    },
  }),

  badge({
    id: 'emergency-fund',
    title: '3-Month Emergency Fund',
    domainId: 'financial',
    difficulty: 'demanding',
    prerequisites: [],
    effort: 'Until the cash is actually there',
    description: 'Hold three months of essential expenses in cash you can reach within a few days.',
    criteria: [
      'Calculate one month of essential expenses from real numbers: housing, food, utilities, transport, and minimum debt payments.',
      'Hold at least three times that amount in cash savings.',
      'Keep that cash separate from everyday spending for 30 days.',
    ],
    lesson: {
      summary: 'This is a cash reserve, not an investment pitch. The number comes from your bills, not from a rule of thumb you like.',
      steps: [
        'List essential expenses from the last full month.',
        'Multiply by three and name the account that will hold it.',
        'If you are short, write the monthly transfer that closes the gap. The badge is the balance, not the intention.',
      ],
      link: {
        label: 'What is a budget? — CFPB',
        url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-budget-en-1439/',
      },
    },
  }),
  badge({
    id: 'zero-consumer-debt',
    title: 'Zero Consumer Debt',
    domainId: 'financial',
    difficulty: 'demanding',
    prerequisites: [],
    effort: 'Until revolving balances are zero',
    description: 'Pay consumer revolving balances to zero and keep them there for a month.',
    criteria: [
      'List every consumer balance: credit cards, store cards, and buy-now-pay-later. Note mortgages or student loans separately. They are not this badge.',
      'Pay the consumer revolving balances to zero.',
      'Go 30 days without carrying a new consumer balance into the next cycle.',
    ],
    lesson: {
      summary: 'The badge is a zero balance you can show yourself, not a story about why the debt was reasonable.',
      steps: [
        'Write each balance, the rate, and the minimum.',
        'Stop adding new revolving debt while you pay.',
        'When it hits zero, leave the accounts open or closed on purpose, and write which you chose.',
      ],
    },
  }),
  badge({
    id: 'net-worth-tracking',
    title: 'Net Worth Tracking System',
    domainId: 'financial',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'Two snapshots, 30 days apart',
    description: 'Record what you own and what you owe, then update it once.',
    criteria: [
      'List assets and liabilities you actually have, with amounts and the date.',
      'Record the total in one place you will reopen.',
      'Update the same record at least 30 days later.',
    ],
    lesson: {
      summary: 'A net-worth record is a snapshot, not a performance score. Update it on a date you choose in advance.',
      steps: [
        'Use one page or one sheet. Do not start a new system each month.',
        'Include debts even if you dislike the number.',
        'Compare the two snapshots and write one sentence on what changed.',
      ],
    },
  }),
  badge({
    id: 'written-budget',
    title: 'Written Monthly Budget',
    domainId: 'financial',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'One month',
    description: 'Write this month’s plan before the month is half over, then check it against what happened.',
    criteria: [
      'Write expected income and expenses for the current month before the 15th.',
      'Compare actual spending with that plan once before the month ends.',
      'Keep the plan where you will open it next month.',
    ],
    lesson: {
      summary: 'A budget you write after the money is gone is a diary. Write it while you can still choose.',
      steps: [
        'Start with income you can count on.',
        'Assign the essentials first, then the rest.',
        'On the check-in, change the next month’s plan instead of defending the miss.',
      ],
      link: {
        label: 'What is a budget? — CFPB',
        url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-budget-en-1439/',
      },
    },
  }),

  badge({
    id: 'home-repair',
    title: 'Home Repair Basics',
    domainId: 'practical',
    difficulty: 'practiced',
    prerequisites: [],
    effort: 'Three real repairs',
    description: 'Do one plumbing repair, one simple electrical repair, and one mechanical repair yourself.',
    criteria: [
      'Complete a plumbing repair such as a trap, a supply line, or a toilet fill valve.',
      'Complete an electrical repair that does not open the service panel, such as a switch, outlet, or lamp. Cut power at the breaker and verify the circuit is dead before you touch the device.',
      'Complete a mechanical repair such as a door, hinge, hose, or basic bike or car job. Write the date, the failure, and the repair for all three.',
    ],
    lesson: {
      summary: 'The work has to be a real failure in your house, not a kit you bought to practice. Stop and call a licensed tradesperson if you hit the panel, gas, or anything you cannot make safe.',
      steps: [
        'Shut off water or power before you take anything apart.',
        'Lay the parts out in the order you removed them.',
        'Test the repair, then write what you would do differently.',
      ],
    },
  }),
  badge({
    id: 'cooking-independence',
    title: '30-Day Cooking Independence',
    domainId: 'practical',
    difficulty: 'practiced',
    prerequisites: [],
    effort: '30 days',
    description: 'Cook real meals at home often enough that delivery is not the default.',
    criteria: [
      'Cook a full meal at home — protein, vegetable, and starch from raw or minimally processed food — on 24 of 30 days.',
      'Shop for those meals without using delivery as the plan.',
      'Keep a list of eight meals you can cook without a recipe in front of you.',
    ],
    lesson: {
      summary: 'Independence here means you can feed yourself on a tired night without an app.',
      steps: [
        'Write the eight meals before the month starts.',
        'Shop twice a week from that list.',
        'A restaurant meal can happen. It does not count toward the 24.',
      ],
    },
  }),
  badge({
    id: 'survival-kit',
    title: 'Wilderness/Urban Survival Kit Built',
    domainId: 'practical',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'One weekend to build, then a check',
    description: 'Build a kit you can carry, with supplies you have already bought and know how to use.',
    criteria: [
      'Pack water, a way to make light, a way to stay warm or make fire, basic first aid, and copies of identification.',
      'Include a 72-hour food plan you have bought and stored, not a list you mean to buy.',
      'Walk through the kit and remove anything you do not know how to use.',
    ],
    lesson: {
      summary: 'A kit is what you can carry and operate. Extra gadgets you cannot use are weight.',
      steps: [
        'Start from the Ready.gov list, then cut it to your household.',
        'Put the kit where you can grab it, not in a closet you forget.',
        'Check water and food dates once, and write the next check on a calendar.',
      ],
      link: { label: 'Build a kit — Ready.gov', url: 'https://www.ready.gov/kit' },
    },
  }),
  badge({
    id: 'tool-crib',
    title: 'Household Tool Crib',
    domainId: 'practical',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'One afternoon, plus one real job',
    description: 'Own the basic tools, store them in one known place, and use one of them.',
    criteria: [
      'Own a screwdriver set, pliers, an adjustable wrench, a hammer, a flashlight, and a plunger.',
      'Store them in one place another person in the household could find.',
      'Use at least one of them for a real job this month.',
    ],
    lesson: {
      summary: 'Tools you cannot find do not count. The badge is the crib, not the shopping trip.',
      steps: [
        'Pick one drawer, bag, or box.',
        'Label it if more than one person lives there.',
        'The first job can be small. Write what you fixed.',
      ],
    },
  }),

  badge({
    id: 'daily-discipline',
    title: '90-Day Daily Discipline Practice',
    domainId: 'mental',
    difficulty: 'demanding',
    prerequisites: [],
    effort: '90 consecutive days',
    description: 'Keep one useful, slightly uncomfortable practice every day for 90 days.',
    criteria: [
      'Choose one daily practice before day one and write it as a single sentence.',
      'Do it every day for 90 days. A miss resets the count.',
      'The practice must be useful when you are tired: training, a focused work block, or a household close-down.',
    ],
    lesson: {
      summary: 'Pick a practice small enough to do on your worst day. A heroic plan that dies on day four is not the standard.',
      steps: [
        'Write the sentence where you will see it.',
        'Define the minimum version that still counts.',
        'If you miss, start at day one and write why without changing the standard.',
      ],
    },
  }),
  badge({
    id: 'emotional-regulation',
    title: 'Emotional Regulation Framework',
    domainId: 'mental',
    difficulty: 'practiced',
    prerequisites: [],
    effort: 'Two real disagreements',
    description: 'Name how you flood, write a pause you can use in the room, and use it twice.',
    criteria: [
      'Name three physical signs that you are flooding.',
      'Write a pause you can do in the room before you answer.',
      'Use that pause in two real disagreements and write what you did next.',
    ],
    lesson: {
      summary: 'A framework you only use alone is a theory. The badge is the pause in an actual conflict.',
      steps: [
        'Write the signs from the last time you lost your temper or shut down.',
        'Pick a pause that takes under a minute.',
        'After each real use, write the sentence you said next.',
      ],
    },
  }),
  badge({
    id: 'deep-work',
    title: 'Deep Work Capacity',
    domainId: 'mental',
    difficulty: 'practiced',
    prerequisites: [],
    effort: '12 blocks inside 21 days',
    description: 'Finish twelve uninterrupted focus blocks with a task named in advance.',
    criteria: [
      'Complete 12 blocks of at least 50 minutes inside 21 days.',
      'Name the single task before each block and turn notifications off.',
      'Do not count a block you split with messages or feeds. Log the task and whether you finished the block.',
    ],
    lesson: {
      summary: 'The block starts when the distractions are off, not when you sit down.',
      steps: [
        'Choose a start time you can protect.',
        'Write the task in one line before you begin.',
        'If you break the block, log it as a miss and start a new one later.',
      ],
    },
  }),
  badge({
    id: 'sleep-window',
    title: 'Sleep Window Held',
    domainId: 'mental',
    difficulty: 'foundation',
    prerequisites: [],
    effort: '28 nights',
    description: 'Keep a seven-hour sleep window on most nights for four weeks.',
    criteria: [
      'Set a sleep window of at least seven hours in bed, with a consistent wake time.',
      'Hit that window on 20 of 28 nights.',
      'If you use caffeine, stop it at least eight hours before the window.',
    ],
    lesson: {
      summary: 'The wake time is the part you can control. Protect it first.',
      steps: [
        'Write the window where you charge your phone.',
        'Move the phone out of the bed.',
        'Log only hit or miss. Do not negotiate with the count.',
      ],
    },
  }),

  badge({
    id: 'household-leadership',
    title: 'Family / Household Leadership Standard',
    domainId: 'relational',
    difficulty: 'practiced',
    prerequisites: [],
    effort: 'Four weekly checkpoints',
    description: 'Write the standard for the people who rely on you, say it out loud, and keep a weekly check.',
    criteria: [
      'Write what “done” looks like for money, meals, and the shared space. If you live alone, write it for the people who still rely on you.',
      'Have a direct conversation where you say that standard and ask what they need from you.',
      'Keep one weekly checkpoint for four weeks.',
    ],
    lesson: {
      summary: 'A standard you never say is a private complaint. Say it, then ask what it costs the other person.',
      steps: [
        'Write three concrete pictures of done, not a list of virtues.',
        'Hold the conversation when nobody is already angry.',
        'At each checkpoint, name one thing you kept and one thing you dropped.',
      ],
    },
  }),
  badge({
    id: 'difficult-conversation',
    title: 'Difficult Conversation Competence',
    domainId: 'relational',
    difficulty: 'practiced',
    prerequisites: [],
    effort: 'One conversation you have been avoiding',
    description: 'Have one postponed conversation by voice, with a clear ask and a next action.',
    criteria: [
      'Name one conversation you have been postponing that affects a real relationship or obligation.',
      'Have it in person or by voice, not by a vague message.',
      'Write what you asked for, what they said, and the next action you agreed to.',
    ],
    lesson: {
      summary: 'Competence is a specific ask and a next step, not a mood you vent.',
      steps: [
        'Write the ask in one sentence before you talk.',
        'Say what you need, then stop long enough to hear the answer.',
        'End with who does what by when.',
      ],
    },
  }),
  badge({
    id: 'brotherhood-circle',
    title: 'Brotherhood Circle Formed',
    domainId: 'relational',
    difficulty: 'practiced',
    prerequisites: [],
    effort: 'Two meetings in 30 days',
    description: 'Two men who will tell you when you are dodging a standard you named.',
    criteria: [
      'Name at least two men you will tell the truth to about a standard you are keeping.',
      'Meet them twice in 30 days with a specific check-in, not only a social hangout.',
      'Ask them to tell you when you are dodging, and write what they said.',
    ],
    lesson: {
      summary: 'A circle is a check against self-deception. If they only encourage you, it is not this badge.',
      steps: [
        'Tell them the standard in plain language.',
        'Put both meetings on the calendar.',
        'Ask one question you do not want answered, and write the answer.',
      ],
    },
  }),
  badge({
    id: 'conflict-repair',
    title: 'Repair After Conflict',
    domainId: 'relational',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'One repair, checked with the other person',
    description: 'After a conflict, name your part without a counterattack and make a specific repair.',
    criteria: [
      'Within the last 90 days, state what you did wrong without adding a counterattack in the same breath.',
      'Make a specific repair: a task, an apology with a change, or a replaced commitment.',
      'Ask whether the repair matched what they needed. If it did not, write what you will adjust.',
    ],
    lesson: {
      summary: 'Repair is a change the other person can point to. An explanation of your intent is not the repair.',
      steps: [
        'Say the action you took, not the story about why.',
        'Offer one concrete fix.',
        'Let them tell you if it was the right fix.',
      ],
    },
  }),

  badge({
    id: 'mission-statement',
    title: 'Personal Mission Statement',
    domainId: 'purpose',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'Three weekly readings',
    description: 'Write who you are responsible for, what you are building, and what you will not trade away.',
    criteria: [
      'Write a mission statement of no more than 80 words covering those three things.',
      'Read it aloud once a week for three weeks.',
      'Edit it once if it was vague, and put it where you will see it when you plan the week.',
    ],
    lesson: {
      summary: 'If the statement could belong to anyone, it is not done. Name the people and the work.',
      steps: [
        'Draft it in one sitting. Do not polish it for a month.',
        'Cut every adjective that does not change a decision.',
        'After three readings, change one sentence or write why you kept it.',
      ],
    },
  }),
  badge({
    id: 'decision-framework',
    title: 'Decision-Making Framework',
    domainId: 'purpose',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'Two real collisions',
    description: 'Write how you decide when two commitments conflict, then use it twice.',
    criteria: [
      'Write a one-page order of the people and duties you will protect first.',
      'Use it on two real collisions.',
      'Record what you chose and what you declined.',
    ],
    lesson: {
      summary: 'A framework that has not declined anything is a poster. The badge is the no.',
      steps: [
        'List the duties in the order you will actually keep, not the order that sounds noble.',
        'When two collide, open the page before you answer.',
        'Write the decline in a sentence you could say out loud.',
      ],
    },
  }),
  badge({
    id: 'values-hierarchy',
    title: 'Values Hierarchy Documented',
    domainId: 'purpose',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'One list, tested against one person or one week',
    description: 'Order your values as behaviors, and name what you will stop.',
    criteria: [
      'List your values in order. Write the top five as behaviors, not adjectives.',
      'For each of the top five, name one thing you will stop because it violates that behavior.',
      'Review the list with one person who knows you, or write where it is still untested.',
    ],
    lesson: {
      summary: 'A value you will not inconvenience yourself for is a preference. Write the stop.',
      steps: [
        'Start with ten words, then force an order.',
        'Turn each of the top five into a sentence that starts with a verb.',
        'Pick one stop you can do this week.',
      ],
    },
  }),
  badge({
    id: 'weekly-review',
    title: 'Weekly Review Practice',
    domainId: 'purpose',
    difficulty: 'practiced',
    prerequisites: ['mission-statement'],
    effort: '6 consecutive weeks',
    description: 'Review the week in writing, on the same day, against your mission.',
    criteria: [
      'For six consecutive weeks, write what you kept, what you dropped, and the one priority for the next week.',
      'Tie that priority to your mission statement.',
      'Do the review on the same day of the week.',
    ],
    lesson: {
      summary: 'The review is short on purpose. If it takes an evening, you will skip it.',
      steps: [
        'Pick a day and a 25-minute limit.',
        'Open the mission statement before you choose the priority.',
        'A missed week breaks the streak. Start the six again.',
      ],
    },
  }),

  badge({
    id: 'local-government-map',
    title: 'Local Government Structure Mapped',
    domainId: 'systems',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'One sitting with a real agenda',
    description: 'Name the bodies that tax you, zone your block, police your city, and run your schools.',
    criteria: [
      'Name the city or county bodies that set your local taxes, zoning, policing, and schools.',
      'Write who sits on the body that most affects your block, and when it meets.',
      'Read one real agenda from the last 60 days.',
    ],
    lesson: {
      summary: 'Map the offices that can actually move a rule or a dollar where you live. National news is not a substitute.',
      steps: [
        'Start with your city or county website, not a commentary site.',
        'Write the meeting calendar in your own notes.',
        'Read one agenda item far enough to say what decision is in front of them.',
      ],
      link: { label: 'Local governments — USA.gov', url: 'https://www.usa.gov/local-governments' },
    },
  }),
  badge({
    id: 'bill-and-budget',
    title: 'Follow a Bill or a Budget',
    domainId: 'systems',
    difficulty: 'practiced',
    prerequisites: [],
    effort: 'One primary document',
    description: 'Read one ordinance, bill, or public budget that affects you, and name who votes.',
    criteria: [
      'Pick one ordinance, bill, or public budget that affects you.',
      'Read the primary text or the official summary, not only a post about it.',
      'Write who introduced or drafted it, who votes on it, and where the money or the rule comes from.',
    ],
    lesson: {
      summary: 'If you cannot say who votes, you do not yet understand the process.',
      steps: [
        'Prefer the city clerk or the legislature’s own site.',
        'Write the date of the next vote if there is one.',
        'Separate what the text says from what a commentator claims it says.',
      ],
      link: { label: 'Congress.gov', url: 'https://www.congress.gov/' },
    },
  }),
  badge({
    id: 'statute-and-contract',
    title: 'Statute and Contract, Distinguished',
    domainId: 'systems',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'One page in your own words',
    description: 'Explain, in your own words, how a public law differs from a private agreement.',
    criteria: [
      'Write the difference between a statute and a private contract in your own words.',
      'Include, in substance, that a private agreement does not cancel a statute, a tax, a debt, or a court’s jurisdiction.',
      'Find one real example of each: a code section from a public source, and a contract you have actually signed, such as a lease or terms of service.',
    ],
    lesson: {
      summary: 'People confuse “I signed something” with “the law no longer applies.” It does not work that way. This badge is the distinction, not a tactic.',
      steps: [
        'Read a short section of your city or state code.',
        'Read a contract you already signed.',
        'Write the difference without copying a script from the internet.',
      ],
    },
  }),
  badge({
    id: 'institution-watch',
    title: '30-Day Institution Watch',
    domainId: 'systems',
    difficulty: 'practiced',
    prerequisites: ['local-government-map'],
    effort: '30 days',
    description: 'Follow one public body for a month and write two decisions it actually made.',
    criteria: [
      'Follow one public body for 30 days.',
      'Read each agenda in that window.',
      'Write two decisions it made, in plain language.',
    ],
    lesson: {
      summary: 'Watching means the record, not the argument about the record.',
      steps: [
        'Subscribe to the agenda or check the clerk’s page on the same day each week.',
        'Note votes, continuances, and dollar amounts.',
        'If a meeting is cancelled, write that. It still counts as following the body.',
      ],
    },
  }),

  badge({
    id: 'attend-meeting',
    title: 'Attended City Council or School Board',
    domainId: 'local',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'One meeting',
    description: 'Attend one local public meeting and note one item that was decided or deferred.',
    criteria: [
      'Attend one city council, school board, or equivalent local public meeting in person or on the official feed.',
      'Note the date, the body, and one item that was decided or deferred.',
      'Stay through at least one substantive item, not only the opening.',
    ],
    lesson: {
      summary: 'Showing up once teaches you the pace of the room. That is the point of the first visit.',
      steps: [
        'Read the agenda before you go.',
        'Sit through one real item.',
        'Write what was decided in a sentence a neighbor could understand.',
      ],
    },
  }),
  badge({
    id: 'public-comment',
    title: 'Public Comment Delivered',
    domainId: 'local',
    difficulty: 'practiced',
    prerequisites: ['attend-meeting'],
    effort: 'One comment under three minutes',
    description: 'Speak or file a specific comment on a real agenda item.',
    criteria: [
      'Prepare a comment under three minutes on a specific agenda item.',
      'Deliver it in the public comment period or through the body’s official process.',
      'Keep a copy of what you said and what you asked them to do.',
    ],
    lesson: {
      summary: 'Ask for a decision they can actually make. A speech about everything is easy to ignore.',
      steps: [
        'Tie the comment to an item on that agenda.',
        'State the ask in the first two sentences.',
        'Save the text you delivered.',
      ],
    },
  }),
  badge({
    id: 'neighborhood-issue',
    title: 'Neighborhood Issue Filed',
    domainId: 'local',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'One request with a confirmation',
    description: 'Take one physical problem on your street to the office that owns it.',
    criteria: [
      'Pick one physical problem on your street: lighting, traffic, drainage, or a neglected lot.',
      'Identify the department that owns it and the intake process or next meeting.',
      'File one specific request and save the confirmation.',
    ],
    lesson: {
      summary: 'A specific request with a place and a photo beats a general complaint.',
      steps: [
        'Write the location so a crew can find it.',
        'Use the city’s official intake if it has one.',
        'Save the confirmation number.',
      ],
    },
  }),
  badge({
    id: 'meet-official',
    title: 'Met a Local Office',
    domainId: 'local',
    difficulty: 'practiced',
    prerequisites: [],
    effort: 'One meeting or call with a specific ask',
    description: 'Bring one ask to a local elected office or the staffer who handles it.',
    criteria: [
      'Meet or call the office of one local elected official, or the staffer who handles constituent requests.',
      'Bring one specific ask.',
      'Write what they said would happen next.',
    ],
    lesson: {
      summary: 'Staffers move requests that are specific. Bring one, not a platform.',
      steps: [
        'Find the office contact on the official site.',
        'Write the ask in advance.',
        'Record the next step they named, including any date.',
      ],
    },
  }),

  badge({
    id: 'rights-primer',
    title: 'Constitutional Rights Primer Completed',
    domainId: 'rights',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'One careful reading',
    description: 'Read the core constitutional text and write what it does, including what it does not exempt you from.',
    criteria: [
      'Read the Preamble, Article I sections 1 and 8, the Bill of Rights, and the Fourteenth Amendment from an official text.',
      'Write, in your own words, what “secure the Blessings of Liberty” is doing in the Preamble: a purpose of the Constitution, not a personal exemption from law.',
      'List three rights and one limit or duty that sits next to each, from the text you read.',
    ],
    lesson: {
      summary: 'Read the text. Do not substitute a lecture, a meme, or a template. Liberty in the Preamble is the aim of a frame of government, not a private exit from taxes, debts, or courts.',
      steps: [
        'Use the Constitution Annotated or the National Archives text.',
        'Write notes in your own sentences.',
        'If you want to rely on a right in a real dispute, that is a question for a licensed attorney, not for this badge.',
      ],
      link: {
        label: 'Constitution of the United States',
        url: 'https://constitution.congress.gov/constitution/',
      },
    },
  }),
  badge({
    id: 'counsel-threshold',
    title: 'Counsel Threshold Written',
    domainId: 'rights',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'One page',
    description: 'Write the situations where you will hire a lawyer before you act, and the situations you will not handle with an internet template.',
    criteria: [
      'Write five situations in which you will hire a licensed attorney before you act, such as a charge, a summons, a contract you do not understand, a filing that affects property, or a dispute with a creditor.',
      'Write five situations you will not try to handle with a document from the internet.',
      'Include a line that you will not use a template to avoid a tax, a debt, or a court.',
    ],
    lesson: {
      summary: 'The skill is knowing when you are out of your depth. This app will not hand you a form and pretend that is counsel.',
      steps: [
        'Write the list before you are in a crisis.',
        'Find the bar association referral page for your state and save it.',
        'Do not collect templates “just in case.”',
      ],
    },
  }),
  badge({
    id: 'read-a-statute',
    title: 'Read a Statute That Applies to You',
    domainId: 'rights',
    difficulty: 'practiced',
    prerequisites: [],
    effort: 'One official text',
    description: 'Read one official statute or ordinance that governs something you actually do.',
    criteria: [
      'Choose one statute or ordinance that applies to something you do: a traffic rule, a landlord-tenant section, or a license requirement.',
      'Read the official text.',
      'Write what it requires, who enforces it, and one question you would ask a lawyer if you had to rely on it.',
    ],
    lesson: {
      summary: 'Reading a statute is not the same as knowing how a court will apply it. Write the question you would pay a lawyer to answer.',
      steps: [
        'Use the official code site for your state or city.',
        'Copy the citation, then close it and write the requirement in your own words.',
        'Stop at the question. Do not draft a filing.',
      ],
    },
  }),
  badge({
    id: 'structures-literacy',
    title: 'Legal Structures, Literacy Only',
    domainId: 'rights',
    difficulty: 'practiced',
    prerequisites: ['rights-primer'],
    effort: 'One page, no templates',
    description: 'Explain a trust at a high level, including what it cannot do, and write one question for a lawyer.',
    criteria: [
      'In your own words, describe a trust at a high level: one person holds property for a beneficiary under rules in a document.',
      'State plainly that a trust is not a way to escape taxes, creditors, or jurisdiction, and that courts have rejected paperwork that claims otherwise.',
      'Write one question you would take to a licensed attorney before you relied on any structure. Do not attach a template. The reflection is the note.',
    ],
    lesson: {
      summary: 'You are learning that these tools exist and that they are easy to misuse. You are not learning how to form one, and you are not learning how to step outside taxes, debts, or courts. People sell that idea. Courts do not honor it.',
      steps: [
        'Write the definition without a script.',
        'Write the warning in your own sentence.',
        'Write the question you would ask counsel. Stop there.',
      ],
    },
  }),

  badge({
    id: 'mutual-aid',
    title: 'Organized or Joined Local Mutual Aid',
    domainId: 'community',
    difficulty: 'practiced',
    prerequisites: [],
    effort: 'Two contributions',
    description: 'Join or start a concrete local effort and show up twice.',
    criteria: [
      'Join or start a concrete effort: a meal train, a tool library, a cleanup, or a regular help list.',
      'Contribute labor or material at least twice.',
      'Write who is covered and how a new person asks for help.',
    ],
    lesson: {
      summary: 'Mutual aid here means a repeating, specific help, not a group chat.',
      steps: [
        'Name the need in one sentence.',
        'Decide how someone asks, and who answers.',
        'Do the work twice before you call it formed.',
      ],
    },
  }),
  badge({
    id: 'two-introductions',
    title: 'Two Useful Introductions',
    domainId: 'community',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'Two introductions that connect',
    description: 'Introduce two people who can each solve a real problem the other has.',
    criteria: [
      'Introduce two people in your area who can each solve a real problem the other has.',
      'Make the introduction specific: the need and the skill, not a vague suggestion that they meet.',
      'Confirm they actually connected.',
    ],
    lesson: {
      summary: 'A useful introduction names the need. “You two should talk” is not an introduction.',
      steps: [
        'Ask each person if they want the introduction.',
        'Write one sentence on why you are connecting them.',
        'Check back once.',
      ],
    },
  }),
  badge({
    id: 'skill-share',
    title: 'Skill Share Hosted',
    domainId: 'community',
    difficulty: 'practiced',
    prerequisites: [],
    effort: 'One session with at least two people',
    description: 'Teach a practical skill you can do, and leave a step list behind.',
    criteria: [
      'Host a session, or teach your part of one, for at least two other people.',
      'Teach a skill you can do yourself, not a lecture you have not practiced.',
      'Leave a written step list they can use without you.',
    ],
    lesson: {
      summary: 'Teach something you have done with your hands this year.',
      steps: [
        'Pick a skill that fits in 90 minutes.',
        'Have the tools ready before people arrive.',
        'Hand them the steps on paper or in a message they can keep.',
      ],
    },
  }),
  badge({
    id: 'asset-map',
    title: 'Neighborhood Asset Map',
    domainId: 'community',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'A list of at least 10, shared once',
    description: 'List the people, tools, places, and offices you could call, then share the list.',
    criteria: [
      'List at least ten local assets: people and their skills, shared tools, meeting spots, or public offices.',
      'Include a way to contact each one.',
      'Share the list with one neighbor and add what they know.',
    ],
    lesson: {
      summary: 'An asset map is contactable. A list of categories is not.',
      steps: [
        'Start with people you would actually call.',
        'Add the offices from your local government map.',
        'Ask one neighbor what you missed.',
      ],
    },
  }),

  badge({
    id: 'ballot-measure',
    title: 'Ballot Measure Analysis & Vote',
    domainId: 'voting',
    difficulty: 'practiced',
    prerequisites: [],
    effort: 'One measure on a real ballot',
    description: 'Read a measure, write what it changes, and vote it if you are eligible.',
    criteria: [
      'For one measure on a ballot you can vote, read the official text or official summary and the arguments on both sides.',
      'Write the cost or rule it changes, and how you voted or why you abstained.',
      'Cast a ballot in that election if you are eligible. If you are not eligible, write the rule that applies and finish the analysis anyway.',
    ],
    lesson: {
      summary: 'Read the measure. A campaign slogan is not the text.',
      steps: [
        'Open the official voter guide or the measure text.',
        'Write one cost and one rule change.',
        'Vote, or write the eligibility rule if you cannot.',
      ],
      link: { label: 'Vote.gov', url: 'https://www.vote.gov/' },
    },
  }),
  badge({
    id: 'candidate-comparison',
    title: 'Candidate Comparison',
    domainId: 'voting',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'One office, two candidates',
    description: 'Compare two candidates for one office on three concrete issues, using their own materials.',
    criteria: [
      'Pick one office on your next ballot, or the most recent one.',
      'Compare two candidates on three concrete issues using their own materials or an official voter guide.',
      'Write who you supported and one point you still doubt.',
    ],
    lesson: {
      summary: 'Use their words and the voter guide. A party label is not the comparison.',
      steps: [
        'Choose the office closest to your daily life.',
        'Pick three issues that office actually controls.',
        'Write the doubt you did not resolve.',
      ],
    },
  }),
  badge({
    id: 'reform-tracker',
    title: 'Reform Tracked for 30 Days',
    domainId: 'voting',
    difficulty: 'practiced',
    prerequisites: [],
    effort: '30 days on one live process',
    description: 'Follow one reform that is actually in a committee, a council docket, or a ballot qualification.',
    criteria: [
      'Choose one local or state reform that is in a real process.',
      'Track it for 30 days from primary sources.',
      'Write the next vote or deadline and one lawful way to participate.',
    ],
    lesson: {
      summary: 'If there is no docket, no committee, and no ballot, it is a hope, not a reform you can track.',
      steps: [
        'Find the official page for the process.',
        'Check it once a week.',
        'Write the next date and one action that is actually available to you.',
      ],
    },
  }),
  badge({
    id: 'registration-current',
    title: 'Registration Confirmed',
    domainId: 'voting',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'One official check',
    description: 'Confirm your registration from an official source and record the elections in front of you.',
    criteria: [
      'Confirm your voter registration on an official state or local site, or register if you are eligible and were not.',
      'Record the election dates in the next 12 months that apply to you.',
      'If you are ineligible, write the rule and the date you will check again.',
    ],
    lesson: {
      summary: 'Use the official lookup. A third-party site that wants your data is not the check.',
      steps: [
        'Start at vote.gov and follow it to your state.',
        'Save the elections that include local offices, not only the presidential year.',
        'Write the date of the next one where you will read the measures.',
      ],
      link: { label: 'Vote.gov', url: 'https://www.vote.gov/' },
    },
  }),

  badge({
    id: 'data-audit',
    title: 'Personal Data Audit & Privacy Hardening',
    domainId: 'digital',
    difficulty: 'practiced',
    prerequisites: [],
    effort: 'One pass through your accounts',
    description: 'Find the accounts that hold your life, lock the important ones, and close one door you left open.',
    criteria: [
      'List the accounts that hold your money, messages, photos, and identity documents.',
      'Turn on multi-factor authentication for email and for banking.',
      'Revoke access for at least three apps or sites you do not use, and export or delete one set of data you did not mean to leave in an old account.',
    ],
    lesson: {
      summary: 'Start with email and the bank. Everything else recovers from those two if you still control them.',
      steps: [
        'Write the list before you change settings, so you do not lock yourself out.',
        'Turn on multi-factor authentication and save the recovery codes offline.',
        'Revoke three unused connections and close or export one old account.',
      ],
      link: {
        label: 'Protect your personal information — FTC',
        url: 'https://consumer.ftc.gov/articles/protect-your-personal-information-hackers-and-identity-thieves',
      },
    },
  }),
  badge({
    id: 'password-manager',
    title: 'Password Manager in Use',
    domainId: 'digital',
    difficulty: 'foundation',
    prerequisites: [],
    effort: 'Email, bank, and the device account',
    description: 'Put a password manager in place and move the accounts that matter onto unique passwords.',
    criteria: [
      'Install a password manager you control.',
      'Move your email, bank, and primary device accounts onto unique passwords.',
      'Write the recovery method and store it offline.',
    ],
    lesson: {
      summary: 'Unique means unique. A clever variation of the same password is still one password.',
      steps: [
        'Pick a manager and learn how to recover it before you depend on it.',
        'Change email first, then the bank, then the device account.',
        'Store the recovery method on paper, not in the same account.',
      ],
    },
  }),
  badge({
    id: 'source-ledger',
    title: 'Media Source Ledger',
    domainId: 'digital',
    difficulty: 'foundation',
    prerequisites: [],
    effort: '14 days',
    description: 'Write down what you actually read, and open a primary source before you repeat a civic claim.',
    criteria: [
      'List the news and commentary sources you actually used in the last week.',
      'Mark which are primary documents, which are reporting, and which are opinion.',
      'For 14 days, when you repeat a civic claim, open one primary or official source first and note it.',
    ],
    lesson: {
      summary: 'The ledger is about your diet, not about other people’s. Write what you opened.',
      steps: [
        'List a real week, including group chats if that is where you get the claim.',
        'Label each source.',
        'For 14 days, do not pass on a civic claim you have not opened.',
      ],
    },
  }),
  badge({
    id: 'ai-boundaries',
    title: 'AI Tool Boundaries',
    domainId: 'digital',
    difficulty: 'foundation',
    prerequisites: [],
    effort: '14 days with a written rule',
    description: 'Write what you will not paste into an AI tool, and keep the rule for two weeks.',
    criteria: [
      'Write what you will and will not paste into an AI tool. Include account numbers, private messages, and other people’s documents on the will-not list.',
      'Turn off training or history where the product allows it, or stop using a tool that will not let you.',
      'Keep the boundary for 14 days and note one time you almost broke it.',
    ],
    lesson: {
      summary: 'Assume anything you paste can be retained. Write the boundary before you need it.',
      steps: [
        'List the tools you already use.',
        'Write the will-not list in a place you will see before you paste.',
        'If a tool offers no control, decide whether you still use it.',
      ],
    },
  }),
];

export function getBadge(id: string): Badge | undefined {
  return BADGES.find((item) => item.id === id);
}

export function badgesInDomain(domainId: string): Badge[] {
  return BADGES.filter((item) => item.domainId === domainId);
}
