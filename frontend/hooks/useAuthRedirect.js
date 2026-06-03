'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

/**
 * Protege páginas que exigem login. Redireciona para /login se não autenticado.
 */
export function useAuthRedirect() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!user) router.replace('/login')
  }, [user, loading, router])

  return {
    user,
    loading: loading || !user,
  }
}
