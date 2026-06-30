'use client'

export default function UserBadge({ userType, compact = false }) {
  if (userType === 'ADMIN') {
    return (
      <span title="Administrador" className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700 ring-1 ring-violet-200">
        <ShieldIcon /> {!compact && 'Admin'}
      </span>
    )
  }

  if (userType === 'UNIVERSITY') {
    return (
      <span title="Perfil verificado" className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-700 ring-1 ring-sky-200">
        <CheckIcon /> {!compact && 'Verificado'}
      </span>
    )
  }

  return null
}

function ShieldIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>
}

function CheckIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 4 4L19 6" /></svg>
}
