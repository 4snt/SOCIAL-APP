'use client'

const STATUS_MAP = {
  PENDENTE:  { label: 'Pendente',   bg: 'bg-neutral-100', text: 'text-neutral-700', ring: 'ring-neutral-300', dot: 'bg-neutral-500' },
  ABERTA:    { label: 'Aberta',     bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-300', dot: 'bg-yellow-500' },
  EM_ANDAMENTO: { label: 'Em andamento', bg: 'bg-blue-100', text: 'text-blue-800', ring: 'ring-blue-300', dot: 'bg-blue-500' },
  CONCLUIDA: { label: 'Concluída',  bg: 'bg-green-100',  text: 'text-green-800',  ring: 'ring-green-300',  dot: 'bg-green-500' },
  CANCELADA: { label: 'Cancelada',  bg: 'bg-red-100',    text: 'text-red-800',    ring: 'ring-red-300',    dot: 'bg-red-400' },
}

export default function StatusBadge({ status }) {
  if (!status) return null
  const s = STATUS_MAP[status?.toUpperCase()] ?? { label: status, bg: 'bg-neutral-100', text: 'text-neutral-600', ring: 'ring-neutral-200', dot: 'bg-neutral-400' }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${s.bg} ${s.text} ${s.ring}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}
