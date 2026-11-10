export interface Protocol {
  domainId: string;
  title: string;
  body: string;
}

export const PROTOCOLS: Protocol[] = [
  {
    domainId: 'physical',
    title: 'Reset the session, not the standard.',
    body: 'If you miss training, do twenty easy minutes today, write tomorrow’s session time, and go to bed on schedule. Do not add volume to make up a missed week.',
  },
  {
    domainId: 'financial',
    title: 'Correct the number.',
    body: 'Write what you spent outside the plan, move that amount out of next month’s discretionary money, and look at the plan once this week. The miss is data.',
  },
  {
    domainId: 'practical',
    title: 'Repair one thing at the smallest size.',
    body: 'Pick the smallest broken item in the house. Fix it or schedule it within 48 hours, then put the tool back where the next job can find it.',
  },
  {
    domainId: 'mental',
    title: 'Return on the next rep.',
    body: 'When you break a commitment, do the next smallest version of it within a day. Note what pulled you off. Do not renegotiate the standard while you are irritated.',
  },
  {
    domainId: 'relational',
    title: 'Name it and repair it.',
    body: 'Within 48 hours, say what you did, what you will do differently, and ask what the other person needs. Then do that thing.',
  },
  {
    domainId: 'purpose',
    title: 'Rewrite the priority in one sentence.',
    body: 'If the week got captured by other people’s urgency, write the one outcome that still matters and cancel or defer one competing task.',
  },
  {
    domainId: 'systems',
    title: 'Read the primary source.',
    body: 'When a claim about government or law is circulating, open the agenda, statute, or budget itself before you repeat it. Write one sentence on who decides and how.',
  },
  {
    domainId: 'local',
    title: 'Show up once.',
    body: 'Put the next public meeting on your calendar and attend, even if you only listen. Note one specific request the body can act on.',
  },
  {
    domainId: 'rights',
    title: 'Literacy, then counsel.',
    body: 'If a document promises to cancel a legal duty, stop. Reread the constitutional text, write the question in plain language, and take that question to a licensed attorney. Do not file templates from the internet.',
  },
  {
    domainId: 'community',
    title: 'Make the help specific.',
    body: 'If a group effort stalled, ask for one task, one time, and one person. Vague solidarity does not move groceries or tools.',
  },
  {
    domainId: 'voting',
    title: 'Read the measure.',
    body: 'Open the official text or summary and write one reason for and one reason against before you decide. Skip the slogan.',
  },
  {
    domainId: 'digital',
    title: 'Close one open door.',
    body: 'Revoke one unused app’s access, change one reused password, and write the kind of material you will not paste into an AI tool.',
  },
];

export function getProtocol(domainId: string): Protocol | undefined {
  return PROTOCOLS.find((protocol) => protocol.domainId === domainId);
}
