import { useState } from 'react'
import { Download, Pencil, RotateCcw, Search, Trash2 } from 'lucide-react'
import { PageHeading, Priority, TicketStatus } from '../components/ui'
import { priorities, statuses } from '../engine/ruleEngine'
import { compareTriageOrder, exportTickets } from '../utils/tickets'

export default function Tickets({ tickets, view, edit, remove, reset }) {
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('newest')
  const query = search.trim().toLowerCase()
  const matching = tickets.filter(ticket =>
    (!priority || ticket.priority === priority) && (!status || ticket.status === status) &&
    [ticket.id, ticket.title, ticket.description, ticket.category].some(value => value.toLowerCase().includes(query)),
  )
  matching.sort(sort === 'triage' ? compareTriageOrder : (a, b) => b.createdAt.localeCompare(a.createdAt))
  return <>
    <PageHeading title="Ticket management" description="Search, review, and update your IT support requests.">
      <div className="toolbar">
        <button className="secondary" onClick={reset}><RotateCcw size={16} /> Reset sample data</button>
        <button className="secondary" onClick={() => exportTickets(tickets)}><Download size={16} /> Export CSV</button>
      </div>
    </PageHeading>
    <section className="card table-card">
      <div className="filters">
        <label className="search"><Search size={18} /><input aria-label="Search tickets" placeholder="Search tickets…" value={search} onChange={event => setSearch(event.target.value)} /></label>
        <select aria-label="Filter by priority" value={priority} onChange={event => setPriority(event.target.value)}>
          <option value="">All priorities</option>{priorities.map(item => <option key={item}>{item}</option>)}
        </select>
        <select aria-label="Filter by status" value={status} onChange={event => setStatus(event.target.value)}>
          <option value="">All statuses</option>{statuses.map(item => <option key={item}>{item}</option>)}
        </select>
        <select aria-label="Sort tickets" value={sort} onChange={event => setSort(event.target.value)}>
          <option value="newest">Newest first</option>
          <option value="triage">Triage order</option>
        </select>
      </div>
      <div className="table-scroll"><table>
        <thead><tr><th>Ticket</th><th>Category</th><th>Priority</th><th>Status</th><th>Rule</th><th>Actions</th></tr></thead>
        <tbody>{matching.map(ticket => <tr key={ticket.id}>
          <td><button className="text-button" onClick={() => view(ticket)}>{ticket.title}</button><small className="table-id" title={ticket.id}>{ticket.id}</small></td>
          <td>{ticket.category}</td><td><Priority value={ticket.priority} /></td><td><TicketStatus value={ticket.status} /></td><td>{ticket.triggeredRule}</td>
          <td><div className="row-actions">
            <button className="icon-button" aria-label={'Edit ' + ticket.title} onClick={() => edit(ticket)}><Pencil size={17} /></button>
            <button className="icon-button delete-icon" aria-label={'Delete ' + ticket.title} onClick={() => remove(ticket)}><Trash2 size={17} /></button>
          </div></td>
        </tr>)}</tbody>
      </table></div>
      {!matching.length && <p className="empty">No tickets match your current filters.</p>}
      <div className="table-footer">Showing {matching.length} of {tickets.length} tickets</div>
    </section>
  </>
}
