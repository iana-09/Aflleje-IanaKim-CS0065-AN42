import { AlertCircle, CheckCircle2, Clock, ListChecks, LoaderCircle, Timer } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { PageHeading, Priority, TicketStatus } from '../components/ui'

import { compareTriageOrder } from '../utils/tickets'

export default function Dashboard({ tickets, view, inspect }) {
  const high = tickets.filter(ticket => ticket.priority === 'HIGH')
  const medium = tickets.filter(ticket => ticket.priority === 'MEDIUM')
  const low = tickets.filter(ticket => ticket.priority === 'LOW')
  const alerts = high.filter(ticket => ticket.status !== 'Resolved').sort(compareTriageOrder)
  const stats = [
    ['Total tickets', tickets.length, ListChecks, 'blue'],
    ['Open tickets', tickets.filter(ticket => ticket.status === 'Open').length, Clock, 'blue'],
    ['In progress', tickets.filter(ticket => ticket.status === 'In Progress').length, LoaderCircle, 'lavender'],
    ['Resolved tickets', tickets.filter(ticket => ticket.status === 'Resolved').length, CheckCircle2, 'green'],
  ]
  const distribution = [
    { name: 'High', value: high.length, color: '#c54d60' },
    { name: 'Medium', value: medium.length, color: '#b78130' },
    { name: 'Low', value: low.length, color: '#3e8a75' },
  ]

  return <>
    <PageHeading title="Dashboard" description="Monitor your support queue and review active escalations." />
    <div className="metrics">{stats.map(([label, value, Icon, tone]) => <article className="card metric" key={label}>
      <span className="metric-label">{label}</span><span className={'metric-icon ' + tone}><Icon size={19} /></span><strong>{value}</strong>
    </article>)}</div>
    <div className="dashboard-grid dashboard-overview">
      <section className="card panel">
        <div className="section-heading"><div><h2>High-priority alerts</h2><p className="muted">Unresolved high-priority tickets, longest wait first</p></div><span className="priority high">{alerts.length} active</span></div>
        <div className="alert-list">{alerts.length ? alerts.map(ticket => <button className="alert-row" key={ticket.id} onClick={() => inspect(ticket.id)}>
          <span className="metric-icon red"><AlertCircle size={18} /></span><span><strong>{ticket.title}</strong><small>{ticket.category} · {ticket.triggeredRule}</small></span>
          <span className="alert-time"><Timer size={15} /> {ticket.waitingHours}h</span>
        </button>) : <p className="empty">No active escalation alerts.</p>}</div>
      </section>
      <section className="card panel priority-panel">
        <h2>Priority distribution</h2><p className="muted">All tickets by assigned priority</p>
        {tickets.length ? <div className="chart-area" aria-label="Priority distribution chart">
          <ResponsiveContainer width="100%" height={174} minWidth={0}>
            <PieChart><Pie data={distribution} dataKey="value" nameKey="name" innerRadius={58} outerRadius={76} paddingAngle={3} cornerRadius={5} stroke="none" isAnimationActive={false}>
              {distribution.map(item => <Cell key={item.name} fill={item.color} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
          <div className="chart-total"><strong>{tickets.length}</strong><span>Total tickets</span></div>
        </div> : <p className="empty">No tickets to chart.</p>}
        <ul className="legend">{distribution.map(item => <li key={item.name}>
          <div className="priority-breakdown-label">
            <span className="swatch" style={{ background: item.color }} />
            <span>{item.name}</span>
            <strong>{item.value}</strong>
          </div>
          <div className="priority-meter" aria-hidden="true">
            <span style={{ background: item.color, width: (tickets.length ? item.value * 100 / tickets.length : 0) + '%' }} />
          </div>
        </li>)}</ul>
      </section>
    </div>
    <section className="card table-card">
      <div className="section-heading panel"><div><h2>Recent support tickets</h2><p className="muted">Latest tickets added to the service desk</p></div><a className="secondary" href="#tickets">View all tickets</a></div>
      <div className="table-scroll"><table><thead><tr><th>Ticket</th><th>Category</th><th>Priority</th><th>Status</th></tr></thead>
        <tbody>{[...tickets].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5).map(ticket => <tr key={ticket.id}>
          <td><button className="text-button" onClick={() => view(ticket)}>{ticket.title}</button></td>
          <td>{ticket.category}</td><td><Priority value={ticket.priority} /></td><td><TicketStatus value={ticket.status} /></td>
        </tr>)}</tbody>
      </table></div>
      {!tickets.length && <p className="empty">Create a ticket to start tracking support requests.</p>}
    </section>
  </>
}
