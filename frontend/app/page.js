'use client'

import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
import EmptyState from '../components/EmptyState'
import { getPosts } from '../lib/api'
import { useOptionalAuth } from '../hooks/useOptionalAuth'

const ORDER_OPTIONS = [
  { value: 'createdAt:desc', label: 'Mais recentes' },
  { value: 'likes:desc',     label: 'Mais curtidos' },
  { value: 'username:asc',   label: 'Usuário (A-Z)' },
]

export default function HomeFeed() {
  const { user, loading: authLoading } = useOptionalAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [order, setOrder] = useState('createdAt:desc')

  useEffect(() => {
    if (authLoading) return
    let cancelled = false
    const [sortBy, direction] = order.split(':')

    setLoading(true)
    setError('')
    getPosts({ sortBy, direction, currentUserId: user?.id })
      .then((data) => { if (!cancelled) setPosts(Array.isArray(data) ? data : []) })
      .catch(() => { if (!cancelled) { setError('Não foi possível carregar o feed.'); setPosts([]) } })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [order, user?.id, authLoading])

  if (authLoading) return <div className="flex items-center justify-center h-screen">Carregando...</div>

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Feed</h1>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-brand-500"
        >
          {ORDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <PostForm onCreated={(p) => setPosts((prev) => [p, ...prev])} />

      {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      {loading ? (
        <FeedSkeleton />
      ) : posts.length === 0 ? (
        <EmptyState
          icon="🌱"
          title="Ainda não há posts"
          description="Que tal ser a primeira pessoa a compartilhar algo por aqui?"
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </main>
  )
}

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card animate-pulse overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="h-10 w-10 rounded-full bg-neutral-200" />
            <div className="h-3 w-32 rounded bg-neutral-200" />
          </div>
          <div className="h-80 w-full bg-neutral-200" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-24 rounded bg-neutral-200" />
            <div className="h-3 w-3/4 rounded bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  )
}
