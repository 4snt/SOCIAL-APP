'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Wrapper para ações que exigem login: se não houver usuário no localStorage,
// redireciona para /login em vez de executar a ação.
export function getCurrentUser() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Hook que redireciona se não autenticado (chamar no corpo do componente, não em useEffect!)
export function useRequireAuth() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/login')
    } else {
      setUser(currentUser)
    }
  }, [router])

  return user
}

// Versão antiga (manter para ações)
export function useRequireAuthCallback() {
  const router = useRouter()
  return (callback) => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return null
    }
    return callback(user)
  }
}
