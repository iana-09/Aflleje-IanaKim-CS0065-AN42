import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { categories, evaluateTicket, severities, statuses } from '../engine/ruleEngine'
import { Priority, formatDate } from './ui'

export function TicketDialog({ mode, ticket, close, save, edit, inspect, confirm, error }) {
  const dialog = useRef(null)
  const [form, setForm] = useState(ticket ?? {
    title: '', description: '', category: 'Network', severity: 'Low', affectedUsers: 1, waitingHours: 0, status: 'Open',
  })
  const [validation, setValidation] = useState('')
  const titles = { create: 'Create ticket', edit: 'Edit ticket', view: 'Ticket details', delete: 'Delete ticket?', reset: 'Reset sample data?' }
  useEffect(() => { dialog.current.showModal() }, [])

  function submit(event) {
    event.preventDefault()
    const draft = {
      id: ticket?.id ?? 'IT-' + crypto.randomUUID(),
      createdAt: ticket?.createdAt ?? new Date().toISOString(),
      title: form.title.trim(), description: form.description.trim(),
      category: form.category, severity: form.severity, status: form.status,
      affectedUsers: Number(form.affectedUsers), waitingHours: Number(form.waitingHours),
    }
    try {
      if (!draft.title || !draft.description) throw new Error('Enter a title and description.')
      evaluateTicket(draft)
      setValidation('')
      save(draft)
    } catch (exception) {
      setValidation(exception.message)
    }
  }

  const field = name => ({ value: form[name], onChange: event => setForm({ ...form, [name]: event.target.value }) })
  const select = (label, name, options) => <label>{label}<select {...field(name)}>
    {options.map(item => <option key={item}>{item}</option>)}
  </select></label>

  return <dialog ref={dialog} aria-labelledby="dialog-title" onCancel={event => { event.preventDefault(); close() }}>
    <div className="dialog-heading"><h2 id="dialog-title">{titles[mode]}</h2><button className="icon-button" aria-label="Close dialog" onClick={close}><X size={20} /></button></div>
    {error && <p className="notice" role="alert">{error}</p>}
    {(mode === 'create' || mode === 'edit') && <form onSubmit={submit}>
      <label>Title<input required maxLength={120} {...field('title')} /></label>
      <label>Description<textarea required maxLength={1500} rows={3} {...field('description')} /></label>
      <div className="form-grid">
        {select('Category', 'category', categories)}
        {select('Severity', 'severity', severities)}
        <label>Affected users<input type="number" required min="0" step="1" {...field('affectedUsers')} /></label>
        <label>Waiting hours<input type="number" required min="0" step="any" {...field('waitingHours')} /></label>
        {select('Status', 'status', statuses)}
      </div>
      {validation && <p className="notice" role="alert">{validation}</p>}
      <div className="dialog-actions"><button type="button" className="secondary" onClick={close}>Cancel</button><button className="primary">Save ticket</button></div>
    </form>}
    {mode === 'view' && <>
      <p className="eyeline">{ticket.id}</p><h3>{ticket.title}</h3><p className="ticket-description">{ticket.description}</p>
      <dl className="facts-grid">
        {Object.entries({ Category: ticket.category, Severity: ticket.severity, 'Affected users': ticket.affectedUsers,
          'Waiting hours': ticket.waitingHours, Status: ticket.status, 'Created at': formatDate(ticket.createdAt),
          Priority: <Priority value={ticket.priority} />, 'Triggered rule': ticket.triggeredRule,
          'Recommended action': ticket.recommendedAction }).map(([label, value]) =>
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <div className="dialog-actions"><button className="secondary" onClick={() => edit(ticket)}>Edit ticket</button><button className="primary" onClick={() => inspect(ticket.id)}>View decision</button></div>
    </>}
    {(mode === 'delete' || mode === 'reset') && <>
      <p>{mode === 'reset' ? 'Replace all saved tickets with the original 25 sample tickets?' : 'Permanently delete “' + ticket.title + '”?'}</p>
      <div className="dialog-actions"><button className="secondary" autoFocus onClick={close}>Cancel</button><button className="danger" onClick={confirm}>{mode === 'reset' ? 'Reset data' : 'Delete ticket'}</button></div>
    </>}
  </dialog>
}
