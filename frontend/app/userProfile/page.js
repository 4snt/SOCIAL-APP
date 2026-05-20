'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PostCard from '../../components/PostCard'
import { getPosts, getUserById } from '../../lib/api'
import  AuthGuard from '../../components/AuthGuard'

const ORDER_OPTIONS = [
  { value: 'createdAt:desc', label: 'Mais recentes' },
  { value: 'likes:desc', label: 'Mais curtidos' },
  { value: 'createdAt:asc', label: 'Mais antigos' },
]

export default function UserProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = useMemo(() => searchParams.get('userId'), [searchParams])

  const [user, setUser] = useState(null)
  const [userError, setUserError] = useState('')
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [postsError, setPostsError] = useState('')
  const [order, setOrder] = useState('createdAt:desc')

  useEffect(() => {
    if (!userId) return

    try {
      const storedUserRaw = localStorage.getItem('user')
      const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null
      if (storedUser?.id != null && String(storedUser.id) === String(userId)) {
        router.replace('/profile')
        return
      }
    } catch {
      // ignore parse errors and proceed
    }

    let cancelled = false
    setUserError('')
    setUser(null)

    
    getUserById(userId)
      .then((data) => {
        if (cancelled) return
        setUser(data)
      })
      .catch(() => {
        if (cancelled) return
        setUserError('Usuário não encontrado.')
      })

    return () => {
      cancelled = true
    }
  }, [userId, router])

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    const [sortBy, direction] = order.split(':')
    setLoadingPosts(true)
    setPostsError('')

    getPosts({ userId, sortBy, direction })
      .then((data) => {
        if (cancelled) return
        setPosts(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (cancelled) return
        setPostsError('Erro ao carregar os posts desse usuário.')
        setPosts([])
      })
      .finally(() => {
        if (cancelled) return
        setLoadingPosts(false)
      })

    return () => {
      cancelled = true
    }
  }, [userId, order])

  return (
    <AuthGuard>
      <main className="container">
        <button className="button" type="button" onClick={() => router.back()}>
          Voltar
        </button>

        <h1>Perfil</h1>

        {!userId ? (
          <p style={{ color: 'red' }}>Faltou o parâmetro userId na URL.</p>
        ) : userError ? (
          <p style={{ color: 'red' }}>{userError}</p>
        ) : !user ? (
          <p>Carregando usuário...</p>
        ) : (
          <div className="card">
            <div className="card-content">
              <p><strong>Usuário:</strong> @{user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>
        )}

        <h3>Posts</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <label>
            <strong>Ordenar:</strong>{' '}
            <select value={order} onChange={(e) => setOrder(e.target.value)} disabled={!userId}>
              {ORDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {postsError && <p style={{ color: 'red' }}>{postsError}</p>}
        {loadingPosts ? (
          <p>Carregando posts...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p>Esse usuário ainda não tem publicações.</p>
        )}
      </main>
    </AuthGuard>
  )
}