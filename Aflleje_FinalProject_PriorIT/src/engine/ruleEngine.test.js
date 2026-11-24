import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { actions, evaluateTicket, rules } from './ruleEngine.js'
import { sampleTickets } from '../data/sampleTickets.js'
import { compareTriageOrder, ticketCsv } from '../utils/tickets.js'

const base = { category: 'Network', severity: 'Low', affectedUsers: 1, waitingHours: 0, status: 'Open' }

it.each([
  ['critical severity', { severity: 'Critical' }, 'HIGH', 'R1'],
  ['20 affected users', { affectedUsers: 20 }, 'HIGH', 'R2'],
  ['moderate security incident', { category: 'Security', severity: 'Moderate' }, 'HIGH', 'R3'],
  ['24 hours unresolved', { waitingHours: 24, status: 'In Progress' }, 'HIGH', 'R4'],
  ['moderate severity', { severity: 'Moderate' }, 'MEDIUM', 'R5'],
  ['five affected users', { affectedUsers: 5 }, 'MEDIUM', 'R6'],
  ['19 affected users', { affectedUsers: 19 }, 'MEDIUM', 'R6'],
  ['eight hours unresolved', { waitingHours: 8 }, 'MEDIUM', 'R7'],
  ['just under eight hours', { waitingHours: 7.99 }, 'LOW', 'R8'],
  ['low impact', {}, 'LOW', 'R8'],
  ['resolved and waiting 24 hours', { waitingHours: 24, status: 'Resolved' }, 'LOW', 'R8'],
  ['resolved and waiting eight hours', { waitingHours: 8, status: 'Resolved' }, 'LOW', 'R8'],
  ['resolved and critical', { severity: 'Critical', status: 'Resolved' }, 'HIGH', 'R1'],
])('classifies %s', (_, facts, priority, triggeredRule) => {
  expect(evaluateTicket({ ...base, ...facts })).toMatchObject({
    priority, triggeredRule, recommendedAction: actions[priority],
  })
})

it('stops at the earliest matching rule and explains the decision', () => {
  const result = evaluateTicket({ ...base, severity: 'Moderate', waitingHours: 24, affectedUsers: 5 })
  expect(result.triggeredRule).toBe('R4')
  expect(result.explanation).toBe(rules[3].explanation)
  expect(result.trace.map(rule => [rule.id, rule.matched])).toEqual([
    ['R1', false], ['R2', false], ['R3', false], ['R4', true],
  ])
  expect(result.trace[3].conditions.map(condition => [condition.actual, condition.passed])).toEqual([
    [24, true], ['Open', true],
  ])
  expect(evaluateTicket({ ...base, severity: 'Critical', affectedUsers: 20 }).triggeredRule).toBe('R1')
})

it.each([{ affectedUsers: -1 }, { affectedUsers: 1.5 }, { waitingHours: -1 }, { waitingHours: Infinity },
  { severity: 'Unknown' }, { status: 'Closed' }, { category: 'Unknown' }])('rejects invalid facts %j', facts => {
  expect(() => evaluateTicket({ ...base, ...facts })).toThrow()
})

it('matches all 25 expected KNIME rows, including priority, action and rule ID', () => {
  expect(sampleTickets).toHaveLength(25)
  expect(new Set(sampleTickets.map(ticket => evaluateTicket(ticket).triggeredRule)).size).toBe(8)
  expect(ticketCsv(sampleTickets)).toBe(readFileSync(new URL('../../knime/sample_tickets.csv', import.meta.url), 'utf8'))
  expect(ticketCsv(sampleTickets, true)).toBe(readFileSync(new URL('../../knime/expected_results.csv', import.meta.url), 'utf8'))
})

it('ranks unresolved tickets by priority and wait ahead of resolved tickets', () => {
  const byId = id => {
    const ticket = sampleTickets.find(item => item.id === id)
    return { ...ticket, ...evaluateTicket(ticket) }
  }
  const tickets = ['IT-1004', 'IT-1024', 'IT-1025', 'IT-1016', 'IT-1021'].map(byId)
  expect(tickets.sort(compareTriageOrder).map(ticket => ticket.id)).toEqual([
    'IT-1016', 'IT-1025', 'IT-1021', 'IT-1024', 'IT-1004',
  ])
})
