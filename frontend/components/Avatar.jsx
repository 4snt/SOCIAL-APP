'use client'

const SIZE = { xs: 'h-7 w-7 text-xs', sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-20 w-20 text-2xl' }

export default function Avatar({ username, avatarUrl, size = 'md', className = '' }) {
  const fallback = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username || 'guest')}`
  const src = avatarUrl || fallback

  return (
    <img
      src={src}
      alt={username || 'avatar'}
      className={`${SIZE[size]} shrink-0 rounded-full bg-neutral-200 object-cover ring-1 ring-neutral-200 ${className}`}
      onError={(e) => { e.currentTarget.src = fallback }}
    />
  )
}
