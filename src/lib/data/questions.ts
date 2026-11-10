export const ASSESSMENT_VERSION = '1';

export interface ScoredOption {
  id: string;
  label: string;
  /** 0 to 1. The scoring engine normalizes from this. */
  score: number;
}

interface QuestionBase {
  id: string;
  domainId: string;
  prompt: string;
  weight: number;
}

export type Question =
  | (QuestionBase & { kind: 'scale'; min: number; max: number })
  | (QuestionBase & { kind: 'frequency' | 'choice'; options: ScoredOption[] });

export const FREQUENCY: ScoredOption[] = [
  { id: 'never', label: 'Not in the last 90 days', score: 0 },
  { id: 'once', label: 'Once or twice', score: 0.25 },
  { id: 'monthly', label: 'About monthly', score: 0.5 },
  { id: 'weekly', label: 'Most weeks', score: 0.75 },
  { id: 'steady', label: 'On a schedule I keep', score: 1 },
];

function scale(domainId: string, prompt: string, weight = 1): Question {
  return {
    id: `${domainId}-scale`,
    domainId,
    kind: 'scale',
    prompt,
    weight,
    min: 1,
    max: 10,
  };
}

function frequency(domainId: string, prompt: string, weight = 1): Question {
  return {
    id: `${domainId}-habit`,
    domainId,
    kind: 'frequency',
    prompt,
    weight,
    options: FREQUENCY,
  };
}

function choice(
  domainId: string,
  prompt: string,
  options: ScoredOption[],
  weight = 1,
  suffix = 'case',
): Question {
  return {
    id: `${domainId}-${suffix}`,
    domainId,
    kind: 'choice',
    prompt,
    weight,
    options,
  };
}

export const QUESTIONS: Question[] = [
  scale(
    'physical',
    'Against a high standard, where is your body right now: you can train, recover, and do hard work without being wrecked the next day.',
  ),
  frequency(
    'physical',
    'In the last 90 days, how often did you complete a planned strength or conditioning session?',
  ),
  choice('physical', 'When you get less than six hours of sleep, what do you usually do the next day?', [
    { id: 'push', label: 'I keep the hard session anyway.', score: 0.25 },
    { id: 'skip', label: 'I skip movement entirely.', score: 0.15 },
    { id: 'adjust', label: 'I shorten the session and protect the next night of sleep.', score: 1 },
    { id: 'unaware', label: 'I do not notice a pattern.', score: 0.3 },
  ]),

  scale(
    'financial',
    'Against a high standard, where is your money system: you know what comes in, what goes out, and what you owe, without guessing.',
  ),
  frequency('financial', 'In the last 90 days, how often did you review spending against a written plan?'),
  choice('financial', 'An unexpected $1,000 expense hits this month. What is true today?', [
    { id: 'card', label: 'I would put it on a credit card and sort it out later.', score: 0.1 },
    { id: 'cash', label: 'I could cover it from cash savings without new debt.', score: 1 },
    { id: 'partial', label: 'I could cover part of it and would need to borrow the rest.', score: 0.45 },
    { id: 'unsure', label: 'I am not sure.', score: 0.2 },
  ]),

  scale(
    'practical',
    'Against a high standard, where are your practical skills: you can feed yourself, fix ordinary household failures, and find your tools.',
  ),
  frequency(
    'practical',
    'In the last 90 days, how often did you cook a full meal at home from raw or minimally processed food?',
  ),
  choice('practical', 'A sink trap starts leaking on a weeknight. What do you do first?', [
    { id: 'shutoff', label: 'I shut the water off and diagnose it with tools I already own.', score: 1 },
    { id: 'call', label: 'I call someone immediately because I have no tools or experience.', score: 0.2 },
    { id: 'ignore', label: 'I ignore it until tomorrow.', score: 0.1 },
    { id: 'lookup', label: 'I look up the repair and buy what I need before the next use.', score: 0.7 },
  ]),

  scale(
    'mental',
    'Against a high standard, where is your discipline: you keep a hard promise to yourself when you are tired, bored, or irritated.',
  ),
  frequency(
    'mental',
    'In the last 90 days, how often did you finish a planned block of focused work with notifications off?',
  ),
  choice('mental', 'Someone criticizes you sharply, and unfairly, in the moment. What is your usual first move?', [
    { id: 'heat', label: 'I answer at the same heat.', score: 0.2 },
    { id: 'replay', label: 'I go quiet and replay it for days.', score: 0.35 },
    { id: 'pause', label: 'I pause, name what I feel, and respond to the point.', score: 1 },
    { id: 'leave', label: 'I leave and do not return to it.', score: 0.4 },
  ]),

  scale(
    'relational',
    'Against a high standard, where are the relationships that depend on you: clear expectations, follow-through, and repair after conflict.',
  ),
  frequency(
    'relational',
    'In the last 90 days, how often did you start a conversation you had been avoiding?',
  ),
  choice('relational', 'Someone in your household or close circle is carrying too much. What do you do?', [
    { id: 'wait', label: 'I assume they will say something if it matters.', score: 0.2 },
    { id: 'take', label: 'I ask what they need, then take a specific task off their plate.', score: 1 },
    { id: 'lecture', label: 'I tell them to be more organized.', score: 0.25 },
    { id: 'resent', label: 'I take over everything and resent it.', score: 0.4 },
  ]),

  scale(
    'purpose',
    'Against a high standard, how clearly can you say what you are building, what you will not trade away, and how you decide when two goods conflict.',
  ),
  frequency(
    'purpose',
    'In the last 90 days, how often did you review your week against a written priority list?',
  ),
  choice('purpose', 'Two commitments collide and you can keep only one. How do you decide?', [
    { id: 'last', label: 'I pick whichever person asked last.', score: 0.2 },
    { id: 'values', label: 'I use a written order of values and decline the lower one.', score: 1 },
    { id: 'both', label: 'I try to do both badly.', score: 0.3 },
    { id: 'stall', label: 'I avoid deciding until one expires.', score: 0.1 },
  ]),

  scale(
    'systems',
    'Against a high standard, how well do you know how your city, state, and federal government raise money, pass rules, and enforce them.',
    1.2,
  ),
  frequency(
    'systems',
    'In the last 90 days, how often did you read a public agenda, statute, or budget instead of only a comment about it?',
  ),
  choice(
    'systems',
    'Which statement is the most accurate?',
    [
      {
        id: 'distinct',
        label:
          'A statute is a public law. A contract is a private agreement. A contract does not erase a statute.',
        score: 1,
      },
      {
        id: 'opt-out',
        label: 'A private contract means public law no longer applies to you.',
        score: 0,
      },
      {
        id: 'consent',
        label: 'City ordinances are suggestions unless you consent in writing.',
        score: 0,
      },
      { id: 'federal-only', label: 'Only federal statutes are enforceable.', score: 0.1 },
    ],
    1.2,
  ),

  scale(
    'local',
    'Against a high standard, how well do you know the local bodies that affect your street, school, and taxes, and have you shown up.',
  ),
  frequency(
    'local',
    'In the last 90 days, how often did you read an agenda or watch a meeting of a local board that governs you?',
  ),
  choice('local', 'You want a dangerous intersection changed. What is the most direct first step?', [
    { id: 'post', label: 'Post about it and wait.', score: 0.2 },
    {
      id: 'meeting',
      label: 'Find the department that owns it and the next public meeting, then show up with a specific request.',
      score: 1,
    },
    { id: 'congress', label: 'Email a member of Congress first.', score: 0.35 },
    { id: 'brand', label: 'Hire someone to rebrand the neighborhood.', score: 0.1 },
  ]),

  scale(
    'rights',
    'Against a high standard, how well do you know the Constitution’s structure and your rights: what they cover, what they do not, and when you need a lawyer.',
    1.2,
  ),
  choice(
    'rights',
    'The Preamble says the Constitution exists in part to secure the Blessings of Liberty. Which reading matches that purpose?',
    [
      {
        id: 'exit',
        label: 'Liberty here is a private opt-out from taxes, debts, and courts.',
        score: 0,
      },
      {
        id: 'under-law',
        label:
          'The Constitution sets up a government meant to secure liberty under law, not a personal exit from legal duties.',
        score: 1,
      },
      {
        id: 'exemption',
        label: 'The Preamble is a statute that grants individual exemptions.',
        score: 0.1,
      },
      {
        id: 'affidavit',
        label: 'Posterity means only people who file a special affidavit.',
        score: 0,
      },
    ],
    1.2,
  ),
  choice(
    'rights',
    'You are unsure whether a document you found online will actually protect your property. What do you do?',
    [
      { id: 'file', label: 'File it yourself because the template looked official.', score: 0 },
      {
        id: 'counsel',
        label: 'Treat it as education only and ask a licensed attorney before you rely on it.',
        score: 1,
      },
      { id: 'belief', label: 'Assume a court will honor it if you believe in it.', score: 0 },
      { id: 'refuse', label: 'Use it to refuse a lawful debt.', score: 0 },
    ],
    1.2,
    'counsel',
  ),

  scale(
    'community',
    'Against a high standard, how able are you to organize practical help with people who live near you.',
  ),
  frequency(
    'community',
    'In the last 90 days, how often did you give or receive concrete local help (tools, meals, rides, or labor)?',
  ),
  choice(
    'community',
    'A neighbor loses work and needs groceries this week. What builds a network rather than a one-off?',
    [
      { id: 'vague', label: 'Post a vague offer and move on.', score: 0.25 },
      {
        id: 'introduce',
        label: 'Help once, then introduce them to two neighbors who can share the next load.',
        score: 1,
      },
      { id: 'dismiss', label: 'Tell them to apply for a program and end the conversation.', score: 0.3 },
      { id: 'takeover', label: 'Take over their finances.', score: 0.15 },
    ],
  ),

  scale(
    'voting',
    'Against a high standard, how prepared are you to vote the actual measures and offices in front of you, not the national mood.',
  ),
  choice('voting', 'Before you vote on a local measure, what do you actually read?', [
    { id: 'headline', label: 'The headline and a friend’s post.', score: 0.15 },
    { id: 'title', label: 'The ballot title only.', score: 0.35 },
    {
      id: 'both-sides',
      label: 'The official summary and the arguments on both sides.',
      score: 1,
    },
    { id: 'skip', label: 'I skip measures I have not heard of, and I do not look them up.', score: 0.1 },
  ]),
  choice('voting', 'A reform you support is moving through a local process. What counts as participation?', [
    { id: 'picture', label: 'Changing your profile picture.', score: 0.1 },
    {
      id: 'procedure',
      label: 'Learning the procedure, contacting the body that votes, and voting when it is on your ballot.',
      score: 1,
    },
    { id: 'agree', label: 'Arguing online with people who already agree.', score: 0.2 },
    { id: 'wait', label: 'Waiting for a national figure to mention it.', score: 0.15 },
  ], 1.2, 'reform'),

  scale(
    'digital',
    'Against a high standard, how much control do you have of your accounts, devices, and information diet.',
  ),
  frequency(
    'digital',
    'In the last 90 days, how often did you review app permissions, saved passwords, or the accounts that hold your data?',
  ),
  choice('digital', 'An AI tool offers to draft a message using your private files. What is your rule?', [
    { id: 'paste', label: 'Paste everything so the draft is better.', score: 0.15 },
    {
      id: 'boundary',
      label:
        'Use it only on material you would be willing to see retained, and keep a written boundary for what stays offline.',
      score: 1,
    },
    { id: 'avoid', label: 'Avoid every digital tool, including the ones you need.', score: 0.4 },
    { id: 'assume', label: 'Assume the vendor cannot see anything you upload.', score: 0.1 },
  ]),
];

export function questionsForDomain(domainId: string): Question[] {
  return QUESTIONS.filter((question) => question.domainId === domainId);
}
