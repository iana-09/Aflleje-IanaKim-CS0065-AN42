import { sampleTickets } from '../data/sampleTickets.js'
import { evaluateTicket, priorities } from '../engine/ruleEngine.js'

const storageKey = 'priorit.tickets.v1'

export function loadTickets() {
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved === null) return { tickets: sampleTickets, error: '' }
    const tickets = JSON.parse(saved)
    if (!Array.isArray(tickets)) throw new Error('Invalid saved tickets')
    tickets.forEach(evaluateTicket)
    return { tickets, error: '' }
  } catch {
    return { tickets: sampleTickets, error: 'Saved tickets could not be loaded. Sample tickets are shown. Reset sample data to restore storage.' }
  }
}

export function saveTickets(tickets) {
  localStorage.setItem(storageKey, JSON.stringify(tickets))
}

export function csv(rows) {
  return rows.map(row => row.map(value => '"' + String(value).replaceAll('"', '""') + '"').join(',')).join('\r\n') + '\r\n'
}

const inputHeaders = ['Ticket_ID', 'Title', 'Category', 'Severity', 'Affected_Users', 'Waiting_Hours', 'Status']
export function ticketCsv(tickets, includeResults = false) {
  const headers = includeResults ? [...inputHeaders, 'Priority', 'Recommended_Action', 'Triggered_Rule'] : inputHeaders
  return csv([headers, ...tickets.map(ticket => {
    const row = [ticket.id, ticket.title, ticket.category, ticket.severity, ticket.affectedUsers, ticket.waitingHours, ticket.status]
    if (!includeResults) return row
    const { priority, recommendedAction, triggeredRule } = evaluateTicket(ticket)
    return [...row, priority, recommendedAction, triggeredRule]
  })])
}

export function exportTickets(tickets) {
  const url = URL.createObjectURL(new Blob([ticketCsv(tickets)], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'priorit-tickets.csv'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function compareTriageOrder(first, second) {
  return Number(first.status === 'Resolved') - Number(second.status === 'Resolved') ||
    priorities.indexOf(first.priority) - priorities.indexOf(second.priority) ||
    second.waitingHours - first.waitingHours ||
    second.affectedUsers - first.affectedUsers ||
    second.createdAt.localeCompare(first.createdAt)
}
