'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Avatar from '../../components/Avatar'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import TimeAgo from '../../components/TimeAgo'
import UserBadge from '../../components/UserBadge'
import { useAuthRedirect } from '../../hooks/useAuthRedirect'
import { deleteComment, deletePost, getAdminActivity, getAdminUsers, getComments, getPosts, updatePostStatus } from '../../lib/api'

const STATUS_OPTIONS = [
  ['PENDENTE', 'Pendente'],
  ['ABERTA', 'Aberta'],
  ['EM_ANDAMENTO', 'Em andamento'],
  ['CONCLUIDA', 'Concluída'],
  ['CANCELADA', 'Cancelada'],
]

export default function AdminPage() {
  const { user, loading: authLoading } = useAuthRedirect()
  const [posts, setPosts] = useState([])
  const [commentsByPost, setCommentsByPost] = useState({})
  const [adminUsers, setAdminUsers] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')
  const [deletingPostId, setDeletingPostId] = useState(null)
  const [deletingCommentId, setDeletingCommentId] = useState(null)
  const [updatingPostId, setUpdatingPostId] = useState(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) return
    if (user.userType !== 'ADMIN') return

    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const [postsData, usersData, activityData] = await Promise.all([
          getPosts({ sortBy: 'createdAt', direction: 'desc', currentUserId: user.id }),
          getAdminUsers(),
          getAdminActivity(),
        ])
        if (cancelled) return
        setPosts(Array.isArray(postsData) ? postsData : [])
        setAdminUsers(Array.isArray(usersData) ? usersData : [])
        setActivity(Array.isArray(activityData) ? activityData : [])

        const commentsEntries = await Promise.all(
          (Array.isArray(postsData) ? postsData : []).map(async (post) => {
            const comments = await getComments(post.id)
            return [post.id, Array.isArray(comments) ? comments : []]
          })
        )

        if (!cancelled) {
          setCommentsByPost(Object.fromEntries(commentsEntries))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Não foi possível carregar o painel de admin.')
          setPosts([])
          setCommentsByPost({})
          setAdminUsers([])
          setActivity([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [authLoading, user])

  const filteredPosts = useMemo(() => {
    const term = filter.trim().toLowerCase()
    if (!term) return posts
    return posts.filter((post) => {
      const postComments = commentsByPost[post.id] || []
      return [post.username, post.description, post.status, ...postComments.map((comment) => comment.content), ...postComments.map((comment) => comment.username)]
        .join(' ')
        .toLowerCase()
        .includes(term)
    })
  }, [filter, posts, commentsByPost])

  async function handleDeletePost(postId) {
    const confirmDelete = window.confirm('Excluir esta demanda e todos os comentários vinculados?')
    if (!confirmDelete) return

    setDeletingPostId(postId)
    setError('')
    try {
      await deletePost(postId)
      setPosts((current) => current.filter((post) => post.id !== postId))
      setCommentsByPost((current) => {
        const next = { ...current }
        delete next[postId]
        return next
      })
    } catch (err) {
      setError(err.message || 'Não foi possível excluir a demanda.')
    } finally {
      setDeletingPostId(null)
    }
  }

  async function handleDeleteComment(postId, commentId) {
    const confirmDelete = window.confirm('Excluir este comentário?')
    if (!confirmDelete) return

    setDeletingCommentId(commentId)
    setError('')
    try {
      await deleteComment(commentId)
      setCommentsByPost((current) => ({
        ...current,
        [postId]: (current[postId] || []).filter((comment) => comment.id !== commentId),
      }))
      setPosts((current) => current.map((post) => (
        post.id === postId
          ? { ...post, commentCount: Math.max(0, post.commentCount - 1) }
          : post
      )))
    } catch (err) {
      setError(err.message || 'Não foi possível excluir o comentário.')
    } finally {
      setDeletingCommentId(null)
    }
  }

  async function handleStatusChange(postId, status) {
    setUpdatingPostId(postId)
    setError('')
    try {
      const updated = await updatePostStatus(postId, status)
      setPosts((current) => current.map((post) => post.id === postId ? { ...post, status: updated.status } : post))
    } catch (err) {
      setError(err.message || 'Não foi possível alterar a situação da demanda.')
    } finally {
      setUpdatingPostId(null)
    }
  }

  if (authLoading || loading) {
    return <div className="flex items-center justify-center h-[60vh]">Carregando…</div>
  }

  if (!user) return null

  if (user.userType !== 'ADMIN') {
    return (
      <main className="mx-auto max-w-lg">
        <div className="card space-y-4 p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Acesso restrito</p>
          <h1 className="text-xl font-bold tracking-tight">Você não tem acesso ao painel</h1>
          <p className="text-sm text-neutral-500">Esse espaço é reservado para administração das demandas da UniVoz.</p>
          <Link href="/" className="btn-primary inline-flex">Voltar ao feed</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="space-y-5">
      <section className="card space-y-4 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Painel admin</p>
            <h1 className="text-xl font-bold tracking-tight">Moderar demandas da universidade</h1>
            <p className="mt-1 text-sm text-neutral-500">Exclua demandas e comentários que não fazem sentido para manter o feed organizado.</p>
          </div>
          <Link href="/" className="btn-ghost">Voltar ao feed</Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">Demandas</p>
            <p className="mt-1 text-2xl font-bold">{posts.length}</p>
          </div>
          <div className="rounded-xl bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">Comentários</p>
            <p className="mt-1 text-2xl font-bold">
              {Object.values(commentsByPost).reduce((acc, comments) => acc + comments.length, 0)}
            </p>
          </div>
          <div className="rounded-xl bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">Admin logado</p>
            <p className="mt-1 truncate text-sm font-semibold">@{user.username}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">Usuários online</p>
            <p className="mt-1 text-2xl font-bold">{adminUsers.filter((item) => item.online).length}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">Usuários offline</p>
            <p className="mt-1 text-2xl font-bold">{adminUsers.filter((item) => !item.online).length}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">Ações recentes</p>
            <p className="mt-1 text-2xl font-bold">{activity.length}</p>
          </div>
        </div>

        <input
          className="input-field"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrar demandas, comentários ou usuários…"
        />
      </section>

      {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">Usuários e presença</h2>
              <p className="text-sm text-neutral-500">Status calculado pela última atividade recente.</p>
            </div>
          </div>

          {adminUsers.length === 0 ? (
            <p className="text-sm text-neutral-500">Nenhum usuário encontrado.</p>
          ) : (
            <div className="space-y-3">
              {adminUsers.map((adminUser) => (
                <div key={adminUser.id} className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3">
                  <Avatar username={adminUser.username} avatarUrl={adminUser.avatarUrl} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">@{adminUser.username}</p>
                    <UserBadge userType={adminUser.userType} />
                    <p className="text-xs text-neutral-500">{adminUser.userType} · {adminUser.online ? 'online' : 'offline'}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-semibold ${adminUser.online ? 'text-green-600' : 'text-neutral-500'}`}>
                      {adminUser.online ? 'Ativo' : 'Inativo'}
                    </p>
                    {adminUser.lastSeenAt && <TimeAgo date={adminUser.lastSeenAt} />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card space-y-4 p-5">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Histórico de ações</h2>
            <p className="text-sm text-neutral-500">Login, logout, criação e remoção ficam registrados aqui.</p>
          </div>

          {activity.length === 0 ? (
            <p className="text-sm text-neutral-500">Nenhuma ação registrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {activity.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-neutral-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">@{entry.username}</p>
                      <p className="text-xs text-neutral-500">
                        {entry.actionType}
                        {entry.targetType ? ` · ${entry.targetType}` : ''}
                        {entry.targetId ? ` #${entry.targetId}` : ''}
                      </p>
                    </div>
                    <TimeAgo date={entry.createdAt} />
                  </div>
                  {entry.details && <p className="mt-2 text-sm text-neutral-700">{entry.details}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {filteredPosts.length === 0 ? (
        <EmptyState
          icon="🧹"
          title="Nenhum resultado encontrado"
          description="Tente outro termo de busca ou limpe o filtro para ver todas as demandas."
        />
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const comments = commentsByPost[post.id] || []
            return (
              <article key={post.id} className="card space-y-4 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <Avatar username={post.username} avatarUrl={post.avatarUrl} size="md" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold">@{post.username}</p>
                        <StatusBadge status={post.status} />
                      </div>
                      <TimeAgo date={post.createdAt} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="text-xs font-medium text-neutral-600" htmlFor={`status-${post.id}`}>Situação</label>
                    <select
                      id={`status-${post.id}`}
                      value={post.status || 'PENDENTE'}
                      onChange={(event) => handleStatusChange(post.id, event.target.value)}
                      disabled={updatingPostId === post.id}
                      className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#6EADBC] disabled:opacity-60"
                    >
                      {STATUS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deletingPostId === post.id}
                      className="btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-60"
                    >
                      {deletingPostId === post.id ? 'Excluindo…' : 'Excluir demanda'}
                    </button>
                  </div>
                </div>

                <p className="whitespace-pre-wrap text-sm text-neutral-800">{post.description}</p>

                <div className="flex flex-wrap gap-3 text-xs text-neutral-500">
                  <span>{post.likeCount} curtidas</span>
                  <span>{post.commentCount} comentários</span>
                </div>

                <section className="space-y-3 border-t border-neutral-100 pt-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-neutral-900">Comentários</h2>
                    <p className="text-xs text-neutral-500">{comments.length} item(ns)</p>
                  </div>

                  {comments.length === 0 ? (
                    <p className="text-sm text-neutral-500">Sem comentários para esta demanda.</p>
                  ) : (
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div key={comment.id} className={`rounded-xl border p-4 ${comment.userType === 'ADMIN' ? 'border-violet-300 bg-violet-50' : comment.userType === 'UNIVERSITY' ? 'border-sky-300 bg-sky-50' : 'border-neutral-200'}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2"><p className="text-sm font-semibold">@{comment.username}</p><UserBadge userType={comment.userType} /></div>
                              <TimeAgo date={comment.createdAt} />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(post.id, comment.id)}
                              disabled={deletingCommentId === comment.id}
                              className="btn-ghost text-red-600 hover:bg-red-50"
                            >
                              {deletingCommentId === comment.id ? 'Excluindo…' : 'Excluir'}
                            </button>
                          </div>
                          <p className="mt-2 text-sm text-neutral-700">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
