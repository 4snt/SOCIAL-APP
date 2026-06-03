'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Avatar from './Avatar'
import { useAuth } from '../context/AuthContext'

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
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">S</span>
          <span className="text-base font-semibold tracking-tight">social</span>
        </Link>

        <nav className="flex items-center gap-1">
          {loading ? (
            <span className="px-3 text-sm text-neutral-400">…</span>
          ) : user ? (
            <>
              <Link href="/" className="btn-ghost">Feed</Link>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full p-1 transition hover:bg-neutral-100"
                  aria-label="Menu do usuário"
                >
                  <Avatar username={user.username} avatarUrl={user.avatarUrl} size="sm" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-neutral-200">
                    <Link
                      href={`/u/${user.username}`}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      Meu perfil
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      Meus posts
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Sair
                    </button>
                  </div>
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
