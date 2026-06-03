'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loginUser } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useRedirectIfAuthenticated } from '../../hooks/useRedirectIfAuthenticated'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const { setUserFromLogin } = useAuth()
  const { ready } = useRedirectIfAuthenticated()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const result = await loginUser({ email, password })
      if (result.success) {
        setUserFromLogin(result.user)
        router.replace('/')
      } else {
        setError(result.message || 'Credenciais inválidas')
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!ready) return <div className="flex items-center justify-center h-screen">Carregando...</div>

  return (
    <main className="mx-auto max-w-md">
      <div className="card space-y-4 p-6">
        <header className="space-y-1">
          <h1 className="text-xl font-bold">Entrar</h1>
          <p className="text-sm text-neutral-500">Acesse sua conta para curtir, comentar e postar.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          Não tem conta?{' '}
          <Link href="/signup" className="font-semibold text-brand-600 hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </main>
  )
}
