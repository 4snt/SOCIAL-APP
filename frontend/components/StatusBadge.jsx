'use client'
export default function StatusBadge({ status }) {
  const styles = {
    PENDENTE:
      'bg-yellow-100 text-yellow-800 border-yellow-300',
    EM_ANDAMENTO:
      'bg-blue-100 text-blue-800 border-blue-300',
    CONCLUIDA:
      'bg-green-100 text-green-800 border-green-300',
    CANCELADA:
      'bg-red-100 text-red-800 border-red-300',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[status] || 'bg-gray-100 text-gray-700 border-gray-300'
      }`}
    >
      {status?.replaceAll('_', ' ')}
    </span>
  )
}