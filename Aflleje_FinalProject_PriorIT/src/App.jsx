import { useEffect, useState } from 'react'
import { BrainCircuit, BookOpen, LayoutDashboard, ListChecks, Plus } from 'lucide-react'
import logo from './PriorIT Logo.png'
import Dashboard from './pages/Dashboard'
import Tickets from './pages/Tickets'
import { DecisionSupport, KnowledgeBase } from './pages/ExpertSystem'
import { TicketDialog } from './components/TicketDialog'
import { evaluateTicket } from './engine/ruleEngine'
import { sampleTickets } from './data/sampleTickets'
import { loadTickets, saveTickets } from './utils/tickets'

const pages = [
  ['dashboard', 'Dashboard', LayoutDashboard],
  ['tickets', 'Ticket Management', ListChecks],
  ['decision', 'AI Decision Support', BrainCircuit],
  ['knowledge', 'Knowledge Base', BookOpen],
]

function currentPage() {
  const hash = location.hash.slice(1)
  return pages.some(([id]) => id === hash) ? hash : 'dashboard'
}

export default function App() {
  const [loaded] = useState(loadTickets)
  const [tickets, setTickets] = useState(loaded.tickets)
  const [error, setError] = useState(loaded.error)
  const [page, setPage] = useState(currentPage)
  const [dialog, setDialog] = useState(null)
  const [selected, setSelected] = useState('')
  const decisions = tickets.map(ticket => ({ ...ticket, ...evaluateTicket(ticket) }))

  useEffect(() => {
    const syncPage = () => setPage(currentPage())
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  useEffect(() => {
    if (loaded.error) return
    try {
      if (localStorage.getItem('priorit.tickets.v1') === null) saveTickets(loaded.tickets)
    } catch {
      setError('Browser storage is unavailable. Tickets cannot be saved.')
    }
  }, [loaded])

  function commit(next) {
    try {
      saveTickets(next)
      setTickets(next)
      setError('')
      return true
    } catch {
      setError('Browser storage could not save the change.')
      return false
    }
  }

  function updateTicket(draft) {
    const updated = tickets.some(ticket => ticket.id === draft.id)
      ? tickets.map(ticket => ticket.id === draft.id ? draft : ticket)
      : [draft, ...tickets]
    if (commit(updated)) setDialog(null)
  }

  function inspect(id) {
    setSelected(id)
    setDialog(null)
    location.hash = 'decision'
  }

  const create = () => setDialog({ mode: 'create' })
  const view = ticket => setDialog({ mode: 'view', ticket })

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a href="#dashboard" className="brand" aria-label="PriorIT dashboard">
          <img className="brand-logo" src={logo} alt="" />
        </a>
        <nav aria-label="Main navigation">
          {pages.map(([id, label, Icon]) => (
            <a key={id} href={'#' + id} aria-current={page === id ? 'page' : undefined}>
              <Icon size={19} aria-hidden="true" />{label}
            </a>
          ))}
        </nav>
        <div className="sidebar-foot"><BrainCircuit size={17} /> Rule-based expert system</div>
      </aside>
      <main id="main-content">
        <header className="topbar">
          <span>Service desk <span className="crumb">/</span> {pages.find(([id]) => id === page)[1]}</span>
          <button className="primary" onClick={create}><Plus size={17} /> New ticket</button>
        </header>
        <div className="workspace" data-page={page}>
          {error && <p className="notice" role="alert">{error}</p>}
          {page === 'dashboard' && <Dashboard tickets={decisions} view={view} inspect={inspect} />}
          {page === 'tickets' && <Tickets tickets={decisions} view={view} edit={ticket => setDialog({ mode: 'edit', ticket })}
            remove={ticket => setDialog({ mode: 'delete', ticket })} reset={() => setDialog({ mode: 'reset' })} />}
          {page === 'decision' && <DecisionSupport tickets={decisions} selected={selected} select={setSelected} />}
          {page === 'knowledge' && <KnowledgeBase />}
        </div>
      </main>
      {dialog && <TicketDialog key={dialog.mode + (dialog.ticket?.id ?? '')} {...dialog} close={() => setDialog(null)}
        save={updateTicket} inspect={inspect} error={error} edit={ticket => setDialog({ mode: 'edit', ticket })}
        confirm={() => {
          const next = dialog.mode === 'reset' ? sampleTickets : tickets.filter(ticket => ticket.id !== dialog.ticket.id)
          if (commit(next)) setDialog(null)
        }} />}
    </div>
  )
}
