'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getNotifications, getUnreadNotificationCount, markNotificationRead } from '../lib/api'
import TimeAgo from './TimeAgo'

export default function NotificationMenu() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    let active = true
    const refresh = () => getUnreadNotificationCount().then(({ count }) => { if (active) setUnread(count || 0) }).catch(() => {})
    refresh()
    const id = window.setInterval(refresh, 10000)
    return () => { active = false; window.clearInterval(id) }
  }, [])

  async function toggle() {
    const next = !open
    setOpen(next)
    if (next) {
      try { setItems(await getNotifications()) } catch { setItems([]) }
    }
  }

  async function openItem(item) {
    if (!item.read) {
      await markNotificationRead(item.id).catch(() => {})
      setUnread((value) => Math.max(0, value - 1))
    }
    setOpen(false)
  }

  return (
    <div className="relative">
      <button onClick={toggle} className="relative grid h-9 w-9 place-items-center rounded-lg text-neutral-600 hover:bg-neutral-100" aria-label={`Notificações${unread ? `, ${unread} não lidas` : ''}`}>
        <BellIcon />
        {unread > 0 && <span className="absolute right-0 top-0 min-w-4 rounded-full bg-red-500 px-1 text-center text-[10px] font-bold text-white">{unread > 9 ? '9+' : unread}</span>}
      </button>
      {open && <>
        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
        <div className="absolute right-0 z-20 mt-2 max-h-96 w-80 overflow-y-auto rounded-2xl bg-white shadow-xl ring-1 ring-neutral-200">
          <div className="sticky top-0 border-b border-neutral-100 bg-white px-4 py-3 text-sm font-bold">Notificações</div>
          {!items.length ? <p className="p-4 text-sm text-neutral-500">Nenhuma notificação por enquanto.</p> : items.map((item) => (
            <Link key={item.id} href={item.postId ? `/post/${item.postId}` : '#'} onClick={() => openItem(item)} className={`block border-b border-neutral-100 px-4 py-3 hover:bg-neutral-50 ${item.read ? '' : 'bg-sky-50'}`}>
              <p className="text-sm text-neutral-800">{item.message}</p>
              <TimeAgo date={item.createdAt} />
            </Link>
          ))}
        </div>
      </>}
    </div>
  )
}

function BellIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>
}
