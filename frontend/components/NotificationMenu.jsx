'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { getNotifications, getUnreadNotificationCount, markNotificationRead } from '../lib/api'
import TimeAgo from './TimeAgo'

export default function NotificationMenu() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [unread, setUnread] = useState(0)
  const previousUnread = useRef(null)
  const [browserPermission, setBrowserPermission] = useState('default')

  useEffect(() => {
    let active = true
    if ('Notification' in window) setBrowserPermission(Notification.permission)
    const refresh = () => getUnreadNotificationCount().then(async ({ count }) => {
      if (!active) return
      const nextCount = count || 0
      if (previousUnread.current !== null && nextCount > previousUnread.current && 'Notification' in window && Notification.permission === 'granted') {
        const notifications = await getNotifications().catch(() => [])
        const newest = notifications.find((item) => !item.read)
        if (newest) {
          const browserNotification = new Notification('UniVoz', { body: newest.message, tag: `univoz-${newest.id}` })
          browserNotification.onclick = () => {
            window.focus()
            if (newest.postId) window.location.href = `/post/${newest.postId}`
          }
        }
      }
      previousUnread.current = nextCount
      setUnread(nextCount)
    }).catch(() => {})
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

  async function enableBrowserNotifications() {
    if (!('Notification' in window)) return
    const permission = await Notification.requestPermission()
    setBrowserPermission(permission)
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
        <div className="fixed left-3 right-3 top-14 z-20 max-h-[70vh] overflow-y-auto rounded-2xl bg-white shadow-xl ring-1 ring-neutral-200 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-80">
          <div className="sticky top-0 border-b border-neutral-100 bg-white px-4 py-3 text-sm font-bold">Notificações</div>
          {browserPermission === 'default' && (
            <button onClick={enableBrowserNotifications} className="m-3 w-[calc(100%-1.5rem)] rounded-xl bg-[#2969BD] px-3 py-2 text-xs font-semibold text-white">
              Ativar notificações do navegador
            </button>
          )}
          {browserPermission === 'denied' && <p className="mx-3 mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">Notificações bloqueadas no navegador. Libere a permissão nas configurações do site.</p>}
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
