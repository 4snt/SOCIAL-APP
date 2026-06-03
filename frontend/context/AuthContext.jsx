'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getCurrentUserFromSession, logoutUser } from '../lib/api'

export const AUTH_CHANGED_EVENT = 'social-auth-changed'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const sessionUser = await getCurrentUserFromSession()
      if (sessionUser) {
        setUser(sessionUser)
        localStorage.setItem('user', JSON.stringify(sessionUser))
      } else {
        setUser(null)
        localStorage.removeItem('user')
      }
    } catch {
      setUser(null)
      localStorage.removeItem('user')
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    refresh().finally(() => {
      if (!cancelled) setLoading(false)
    })

    const onAuthChanged = () => { refresh() }
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged)
    window.addEventListener('storage', onAuthChanged)

    return () => {
      cancelled = true
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged)
      window.removeEventListener('storage', onAuthChanged)
    }
  }, [refresh])

  const setUserFromLogin = useCallback((userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }, [])

  const clearUser = useCallback(() => {
    setUser(null)
    localStorage.removeItem('user')
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } catch {
      // sessão já pode estar inválida
    }
    clearUser()
  }, [clearUser])

  return (
    <AuthContext.Provider value={{ user, loading, refresh, setUserFromLogin, clearUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return ctx
}
