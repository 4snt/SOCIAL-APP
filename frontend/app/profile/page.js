'use client'

import { useEffect, useState } from 'react'
import Avatar from '../../components/Avatar'
import PostCard from '../../components/PostCard'
import PostForm from '../../components/PostForm'
import EmptyState from '../../components/EmptyState'
import { useAuthRedirect } from '../../hooks/useAuthRedirect'
import { getPosts } from '../../lib/api'

export default function Profile() {
  const { user, loading: authLoading } = useAuthRedirect()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    setLoading(true)
    getPosts({ userId: user.id, currentUserId: user.id })
      .then((data) => { if (!cancelled) setPosts(Array.isArray(data) ? data : []) })
      .catch(() => { if (!cancelled) setPosts([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [user?.id])

  if (authLoading) return <div className="flex items-center justify-center h-screen">Carregando...</div>
  if (!user) return null

  return (
    <main className="space-y-4">
      <section className="card flex items-center gap-4 p-6">
        <Avatar username={user.username} avatarUrl={user.avatarUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold">@{user.username}</h1>
          <p className="text-sm text-neutral-500">{user.email}</p>
          {user.bio && <p className="mt-1 text-sm text-neutral-700">{user.bio}</p>}
          <p className="mt-2 text-xs text-neutral-500">
            {posts.length} {posts.length === 1 ? 'publicação' : 'publicações'}
          </p>
        </div>
      </section>

      <PostForm onCreated={(p) => setPosts((prev) => [p, ...prev])} />

      <h2 className="pt-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">Minhas publicações</h2>

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando…</p>
      ) : posts.length === 0 ? (
        <EmptyState
          icon="📷"
          title="Você ainda não postou nada"
          description="Compartilhe sua primeira imagem usando o formulário acima."
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </main>
  )
}
