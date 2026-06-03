'use client'

import { useAuth } from '../context/AuthContext'

/** @deprecated Prefer useAuth() — mantido para compatibilidade */
export function useOptionalAuth() {
  const { user, loading } = useAuth()
  return { user, loading }
}
