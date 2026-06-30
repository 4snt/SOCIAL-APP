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
  { value: 'attention:desc', label: 'Em destaque' },
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
 
  if (authLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="h-8 w-8 rounded-full border-2 border-[#4A4466] border-t-transparent animate-spin" />
    </div>
  )
 
  return (
    <main className="space-y-5">
      {/* Hero universitário — só para quem não está logado */}
      {!user && (
        <section className="rounded-2xl px-6 py-10 text-white shadow-md flex flex-col items-center text-center" style={{ backgroundColor: '#2969BD' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2 text-white drop-shadow-sm">UFVJM · UniVoz</p>
          <h1 className="font-oswald text-4xl font-bold leading-tight mb-3 text-white drop-shadow-sm tracking-wide">
            A Voz da Comunidade<br />Universitária
          </h1>
          <p className="text-sm font-medium mb-5 max-w-md text-[#F1F7D4]">
            Compartilhe demandas, problemas e sugestões com a sua comunidade acadêmica.
          </p>
          <div className="flex gap-2">
            <a href="/signup" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold hover:bg-[#4E84CA] hover:text-white transition" style={{ color: '#071D41' }}>
              Criar conta
            </a>
            <a href="/login" className="rounded-lg border-2 border-white px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
              Entrar
            </a>
          </div>
        </section>
      )}
 
      {/* Cabeçalho do feed */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold tracking-tight text-neutral-900">Feed</h2>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#4E84CA] focus:ring-2 focus:ring-[#6EADBC33]"
        >
          {ORDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
 
      <PostForm onCreated={(p) => setPosts((prev) => [p, ...prev])} />
 
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}
 
      {loading ? (
        <FeedSkeleton />
      ) : posts.length === 0 ? (
        <EmptyState
          icon="📢"
          title="Nenhuma demanda ainda"
          description="Seja o primeiro a compartilhar uma demanda ou problema com a comunidade."
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
            <div className="space-y-2 flex-1">
              <div className="h-3 w-28 rounded bg-neutral-200" />
              <div className="h-2.5 w-16 rounded bg-neutral-100" />
            </div>
            <div className="h-5 w-20 rounded-full bg-neutral-200" />
          </div>
          <div className="px-4 pb-3 space-y-2">
            <div className="h-3 w-3/4 rounded bg-neutral-200" />
            <div className="h-3 w-1/2 rounded bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  )
}
