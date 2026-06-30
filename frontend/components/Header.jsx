'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Avatar from './Avatar'
import { useAuth } from '../context/AuthContext'
import NotificationMenu from './NotificationMenu'

export default function Header() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    setMenuOpen(false)
    await logout()
    router.replace('/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-2 px-3 sm:px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#4A4466] text-sm font-bold text-white shadow-sm transition group-hover:bg-[#3a3450]">
            U
          </span>
          <div className="hidden flex-col leading-none min-[360px]:flex">
            <span className="text-sm font-bold tracking-tight text-neutral-900">UniVoz</span>
            <span className="text-[10px] text-neutral-400 font-medium tracking-wide uppercase">UFVJM</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {loading ? (
            <span className="h-8 w-20 rounded-lg bg-neutral-100 animate-pulse" />
          ) : user ? (
            <>
              <Link href="/" className="btn-ghost text-neutral-600">Feed</Link>
              {user.userType === 'ADMIN' && (
                <Link href="/admin" className="btn-outline hidden sm:inline-flex">
                  <ShieldIcon /> Admin
                </Link>
              )}
              <Link href="/help" className="btn-ghost hidden sm:inline-flex">Ajuda</Link>
              <NotificationMenu />

              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-neutral-100"
                  aria-label="Menu do usuário"
                >
                  <Avatar username={user.username} avatarUrl={user.avatarUrl} size="sm" />
                  <span className="hidden sm:block text-sm font-medium text-neutral-700 max-w-[120px] truncate">
                    {user.username}
                  </span>
                  <ChevronIcon />
                </button>

                {menuOpen && (
                  <>
                    {/* overlay para fechar */}
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-neutral-200">
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="text-xs text-neutral-400">Conectado como</p>
                        <p className="text-sm font-semibold truncate text-neutral-800">@{user.username}</p>
                      </div>
                      <div className="py-1">
                        {user.userType === 'ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          >
                            <ShieldIcon /> Painel admin
                          </Link>
                        )}
                        <Link
                          href={`/u/${user.username}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                          <PersonIcon /> Meu perfil
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                          <GridIcon /> Minhas publicações
                        </Link>
                        <Link
                          href="/help"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                          <HelpIcon /> Ajuda
                        </Link>
                      </div>
                      <div className="border-t border-neutral-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogoutIcon /> Sair
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">Entrar</Link>
              <Link href="/signup" className="btn-primary">Criar conta</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}
function PersonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}
function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  )
}
function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}
function ShieldIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
function HelpIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 1-1 1.7"/><path d="M12 17h.01"/></svg>
}
