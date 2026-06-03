'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

/**
 * Para /login e /signup: redireciona para / se já autenticado.
 */
export function useRedirectIfAuthenticated() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (user) router.replace('/')
  }, [user, loading, router])

  return { ready: !loading && !user }
}
