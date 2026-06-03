'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Avatar from '../../../components/Avatar'
import PostCard from '../../../components/PostCard'
import EmptyState from '../../../components/EmptyState'
import { useOptionalAuth } from '../../../hooks/useOptionalAuth'
import { getPosts, getUserByUsername } from '../../../lib/api'

export default function PublicProfile() {
  const params = useParams()
  const username = params?.username
  const { user, loading: authLoading } = useOptionalAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!username || authLoading) return
    let cancelled = false
    setLoading(true)
    setError('')

    getUserByUsername(username)
      .then((u) => {
        if (cancelled) return
        setProfile(u)
        return getPosts({ userId: u.id, currentUserId: user?.id })
      })
      .then((p) => { if (!cancelled && p) setPosts(Array.isArray(p) ? p : []) })
      .catch(() => { if (!cancelled) setError('Usuário não encontrado.') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [username, user?.id, authLoading])

  if (authLoading) return <p className="text-sm text-neutral-500">Carregando…</p>
  if (loading) return <p className="text-sm text-neutral-500">Carregando…</p>
  if (error || !profile) {
    return <EmptyState icon="🔍" title="Perfil não encontrado" description={error} />
  }

  return (
    <main className="space-y-4">
      <section className="card flex items-center gap-4 p-6">
        <Avatar username={profile.username} avatarUrl={profile.avatarUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold">@{profile.username}</h1>
          {profile.bio && <p className="mt-1 text-sm text-neutral-700">{profile.bio}</p>}
          <p className="mt-2 text-xs text-neutral-500">
            {posts.length} {posts.length === 1 ? 'publicação' : 'publicações'}
          </p>
        </div>
      </section>

      {posts.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Nada por aqui"
          description="Este usuário ainda não publicou nada."
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </main>
  )
}
