import { ArrowRight, BookOpen, BrainCircuit, ClipboardList, ListChecks, Tag } from 'lucide-react'
import { describeConditions, rules } from '../engine/ruleEngine'
import { PageHeading, Priority } from '../components/ui'

const steps = [
  ['Ticket information', ClipboardList], ['Knowledge base', BookOpen],
  ['Rule-based inference engine', BrainCircuit], ['Priority classification', Tag], ['Recommended action', ListChecks],
]

export function DecisionSupport({ tickets, selected, select }) {
  const ticket = tickets.find(item => item.id === selected) ?? tickets[0]
  const rule = rules.find(item => item.id === ticket?.triggeredRule)
  return <>
    <PageHeading title="AI decision support" description="See which facts and rules led to a ticket’s priority and recommended action." />
    <section className="card panel">
      <h2>Inference process</h2>
      <ol className="flow">{steps.map(([label, Icon], index) => <li key={label}>
        {index > 0 && <ArrowRight aria-hidden="true" className="flow-arrow" size={16} />}
        <span><Icon size={20} />{label}</span>
      </li>)}</ol>
    </section>
    {ticket ? <>
      <div className="dashboard-grid decision-grid">
        <section className="card panel">
          <h2>Ticket information</h2>
          <label className="ticket-picker">Select a ticket<select value={ticket.id} onChange={event => select(event.target.value)}>
            {tickets.map(item => <option key={item.id} value={item.id}>{item.title} ({item.id})</option>)}
          </select></label>
          <p className="ticket-description">{ticket.description}</p>
          <dl className="facts-grid">
            {Object.entries({ Category: ticket.category, Severity: ticket.severity, 'Affected users': ticket.affectedUsers,
              'Waiting hours': ticket.waitingHours, Status: ticket.status }).map(([label, value]) =>
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
        </section>
        <section className="card panel">
          <div className="section-heading"><h2>Decision result</h2><Priority value={ticket.priority} /></div>
          <h3>{rule.id} · {rule.name}</h3>
          <p className="rule-expression">IF {describeConditions(rule)} THEN Priority = {rule.priority}</p>
          <p>{ticket.explanation}</p>
          <div className="decision-action">
            <h3>Recommended action</h3>
            <p>{ticket.recommendedAction}</p>
            {ticket.status === 'Resolved' && <p className="muted">This ticket is resolved and excluded from active alerts.</p>}
          </div>
        </section>
      </div>
      <section className="card table-card">
        <div className="panel"><h2>Rule evaluation trace</h2><p className="muted">Evaluation stops after the first matching rule.</p></div>
        <div className="table-scroll"><table><thead><tr><th>Rule</th><th>Conditions evaluated</th><th>Outcome</th></tr></thead>
          <tbody>{ticket.trace.map(entry => <tr key={entry.id} className={entry.matched ? 'matched-rule' : undefined}><td><strong>{entry.id}</strong> · {entry.name}</td>
            <td>{entry.conditions.length ? <ul className="trace-list">{entry.conditions.map(condition => <li key={condition.label}>
              {condition.label} <span className="muted">(actual {condition.actual})</span> <strong className={condition.passed ? 'pass' : 'fail'}>{condition.passed ? 'Pass' : 'Fail'}</strong>
            </li>)}</ul> : 'No earlier rule matched'}</td>
            <td><span className={entry.matched ? 'pass' : 'muted'}>{entry.matched ? 'Matched' : 'Did not match'}</span></td>
          </tr>)}</tbody>
        </table></div>
      </section>
    </> : <section className="card panel"><p>No tickets available. Create a ticket to view its decision trace.</p></section>}
  </>
}

export function KnowledgeBase() {
  return <>
    <PageHeading title="Knowledge base" description="Review the eight rules that classify every support ticket." />
    <section className="card panel reasoning"><span className="metric-icon blue"><BrainCircuit size={21} /></span>
      <div><h2>Forward-chaining reasoning</h2><p>The engine starts with ticket facts in working memory. It checks the rules from R1 through R8 and applies the first rule whose conditions all pass. The fired rule supplies the priority and explanation, and the priority determines the recommended action.</p></div>
    </section>
    <section className="card table-card">
      <div className="panel"><h2>Priority rules</h2><p className="muted">Listed in evaluation order</p></div>
      <div className="table-scroll"><table><thead><tr><th>Order</th><th>Rule ID and name</th><th>IF conditions</th><th>THEN priority</th><th>Explanation</th></tr></thead>
        <tbody>{rules.map((rule, index) => <tr key={rule.id}><td>{index + 1}</td><td><strong>{rule.id}</strong> · {rule.name}</td>
          <td>{describeConditions(rule)}</td><td><Priority value={rule.priority} /></td><td>{rule.explanation}</td></tr>)}</tbody>
      </table></div>
    </section>
  </>
}
