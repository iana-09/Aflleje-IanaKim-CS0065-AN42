export function Priority({ value }) {
  return <span className={'priority ' + value.toLowerCase()}>{value}</span>
}

export function PageHeading({ title, description, children }) {
  return <div className="page-heading">
    <div><h1>{title}</h1><p>{description}</p></div>{children}
  </div>
}

export function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
}

export function TicketStatus({ value }) {
  return <span className={'ticket-status ' + value.toLowerCase().replace(' ', '-')}>{value}</span>
}
