export const categories = ['Network', 'Hardware', 'Software', 'Account Access', 'Security', 'Other']
export const severities = ['Low', 'Moderate', 'Critical']
export const statuses = ['Open', 'In Progress', 'Resolved']
export const priorities = ['HIGH', 'MEDIUM', 'LOW']

export const actions = {
  HIGH: 'Escalate immediately to IT support for urgent investigation.',
  MEDIUM: 'Schedule troubleshooting and monitor the ticket.',
  LOW: 'Place the ticket in the regular support queue.',
}

const condition = (field, label, test) => ({ field, label, test })
const unresolved = condition('status', 'Status is not Resolved', value => value !== 'Resolved')

export const rules = [
  {
    id: 'R1', name: 'Critical Severity', priority: 'HIGH',
    conditions: [condition('severity', 'Severity = Critical', value => value === 'Critical')],
    explanation: 'A critical issue requires immediate escalation.',
  },
  {
    id: 'R2', name: 'Widespread Impact', priority: 'HIGH',
    conditions: [condition('affectedUsers', 'Affected users ≥ 20', value => value >= 20)],
    explanation: 'At least 20 affected users indicate widespread disruption.',
  },
  {
    id: 'R3', name: 'Security Incident', priority: 'HIGH',
    conditions: [
      condition('category', 'Category = Security', value => value === 'Security'),
      condition('severity', 'Severity = Moderate', value => value === 'Moderate'),
    ],
    explanation: 'A moderate security incident requires urgent investigation.',
  },
  {
    id: 'R4', name: 'Extended Waiting Time', priority: 'HIGH',
    conditions: [condition('waitingHours', 'Waiting hours ≥ 24', value => value >= 24), unresolved],
    explanation: 'An unresolved ticket waiting at least 24 hours needs escalation.',
  },
  {
    id: 'R5', name: 'Moderate Severity', priority: 'MEDIUM',
    conditions: [condition('severity', 'Severity = Moderate', value => value === 'Moderate')],
    explanation: 'A moderate issue warrants scheduled troubleshooting.',
  },
  {
    id: 'R6', name: 'Multiple Affected Users', priority: 'MEDIUM',
    conditions: [
      condition('affectedUsers', 'Affected users ≥ 5', value => value >= 5),
      condition('affectedUsers', 'Affected users < 20', value => value < 20),
    ],
    explanation: 'The issue affects 5 to 19 users and warrants scheduled troubleshooting.',
  },
  {
    id: 'R7', name: 'Delayed Ticket', priority: 'MEDIUM',
    conditions: [condition('waitingHours', 'Waiting hours ≥ 8', value => value >= 8), unresolved],
    explanation: 'An unresolved ticket waiting at least 8 hours should be scheduled for troubleshooting.',
  },
  {
    id: 'R8', name: 'Default', priority: 'LOW', conditions: [],
    explanation: 'No earlier rule matched. The ticket can enter the regular support queue.',
  },
]

export function describeConditions(rule) {
  return rule.conditions.map(item => item.label).join(' AND ') || 'No earlier rule matched'
}

export function validateFacts(ticket) {
  if (!categories.includes(ticket.category)) throw new Error('Choose a valid category.')
  if (!severities.includes(ticket.severity)) throw new Error('Choose a valid severity.')
  if (!statuses.includes(ticket.status)) throw new Error('Choose a valid status.')
  if (!Number.isSafeInteger(ticket.affectedUsers) || ticket.affectedUsers < 0) {
    throw new Error('Affected users must be a nonnegative whole number.')
  }
  if (!Number.isFinite(ticket.waitingHours) || ticket.waitingHours < 0) {
    throw new Error('Waiting hours must be a nonnegative number.')
  }
}

export function evaluateTicket(ticket) {
  validateFacts(ticket)
  const trace = []
  for (const rule of rules) {
    const conditions = rule.conditions.map(({ field, label, test }) => ({
      label, actual: ticket[field], passed: test(ticket[field]),
    }))
    const matched = conditions.every(item => item.passed)
    trace.push({ id: rule.id, name: rule.name, conditions, matched })
    if (matched) {
      return {
        priority: rule.priority,
        triggeredRule: rule.id,
        explanation: rule.explanation,
        recommendedAction: actions[rule.priority],
        trace,
      }
    }
  }
  throw new Error('The rule base must include a fallback rule.')
}
