'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Avatar from './Avatar'
import TimeAgo from './TimeAgo'
import CommentList from './CommentList'
import StatusBadge from './StatusBadge'
import { createComment, getComments, likePost, unlikePost } from '../lib/api'
import { useAuth } from '../context/AuthContext'

// mapa de ícone por categoria
const CATEGORIA_LABEL = {
  RU:              'RU',
  BIBLIOTECA:      'Biblioteca',
  INFRAESTRUTURA:  'Infraestrutura',
  TI:              'TI',
  TRANSPORTE:      'Transporte',
  SAUDE:           'Saúde',
  ACADEMICO:       'Acadêmico',
  ESPORTE:         'Esporte',
  OUTRO:           'Outro',
}

export default function PostCard({ post }) {
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [likes, setLikes] = useState(post.likeCount ?? 0)
  const [liked, setLiked] = useState(!!post.likedByMe)
  const [commentCount, setCommentCount] = useState(post.commentCount ?? 0)
  const [comments, setComments] = useState(null)
  const [showComments, setShowComments] = useState(false)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!showComments || comments) return
    getComments(post.id).then(setComments).catch(() => setComments([]))
  }, [showComments, comments, post.id])

  async function handleLike() {
    if (!currentUser) return router.push('/login')
    const willLike = !liked
    setLiked(willLike)
    setLikes((n) => n + (willLike ? 1 : -1))
    try {
      const { likes: serverLikes } = willLike ? await likePost(post.id) : await unlikePost(post.id)
      setLikes(serverLikes)
    } catch {
      setLiked(!willLike)
      setLikes((n) => n + (willLike ? -1 : 1))
    }
  }

  async function handleComment(e) {
    e.preventDefault()
    if (!currentUser) return router.push('/login')
    const trimmed = text.trim()
    if (!trimmed || submitting) return
    setSubmitting(true)
    try {
      const created = await createComment(post.id, { content: trimmed })
      setComments((prev) => [...(prev || []), created])
      setCommentCount((n) => n + 1)
      setText('')
      setShowComments(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <article className="card overflow-hidden">
      {/* Header do post */}
      <header className="flex items-center gap-3 px-4 py-3">
        <Link href={`/u/${post.username}`}>
          <Avatar username={post.username} avatarUrl={post.avatarUrl} size="sm" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/u/${post.username}`}
            className="block truncate text-sm font-semibold text-neutral-900 hover:underline"
          >
            @{post.username}
          </Link>
          <TimeAgo date={post.createdAt} />
        </div>
        {/* status e categoria ao lado do header */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {post.categoria && (
            <span className="hidden sm:inline-flex category-tag">
              {CATEGORIA_LABEL[post.categoria] ?? post.categoria}
            </span>
          )}
          {post.status && <StatusBadge status={post.status} />}
        </div>
      </header>

      {/* Imagem (opcional) */}
      {post.imageUrl && (
        <Link href={`/post/${post.id}`} className="block bg-neutral-100">
          <img
            src={post.imageUrl}
            alt={post.description}
            className="max-h-[480px] w-full object-cover"
            loading="lazy"
          />
        </Link>
      )}

      {/* Corpo do post */}
      <div className="px-4 pt-3 pb-1">
        {/* categoria mobile */}
        {post.categoria && (
          <span className="inline-flex sm:hidden category-tag mb-2">
            {CATEGORIA_LABEL[post.categoria] ?? post.categoria}
          </span>
        )}

        {/* descrição */}
        <p className="text-sm text-neutral-800 leading-relaxed">
          <Link href={`/u/${post.username}`} className="font-semibold text-neutral-900 hover:underline mr-1">
            @{post.username}
          </Link>
          {post.description}
        </p>
      </div>

      {/* Ações */}
      <div className="px-4 pb-2 pt-2 flex items-center gap-1">
        <button
          onClick={handleLike}
          aria-label={liked ? 'Descurtir' : 'Curtir'}
          className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm transition hover:bg-neutral-100 group"
        >
          <HeartIcon filled={liked} />
          <span className={`text-xs font-medium ${liked ? 'text-red-500' : 'text-neutral-500'}`}>{likes}</span>
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          aria-label="Ver comentários"
          className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm transition hover:bg-neutral-100"
        >
          <CommentIcon />
          <span className="text-xs font-medium text-neutral-500">{commentCount}</span>
        </button>
      </div>

      {/* Link "ver comentários" */}
      {commentCount > 0 && !showComments && (
        <button
          onClick={() => setShowComments(true)}
          className="px-4 pb-2 text-xs text-neutral-400 hover:text-neutral-600 hover:underline block"
        >
          Ver {commentCount === 1 ? '1 comentário' : `os ${commentCount} comentários`}
        </button>
      )}

      {/* Lista de comentários */}
      {showComments && (
        <div className="border-t border-neutral-100">
          {comments === null
            ? <p className="px-4 py-3 text-sm text-neutral-400">Carregando comentários…</p>
            : <CommentList comments={comments} />}
        </div>
      )}

      {/* Caixa de novo comentário */}
      <form
        onSubmit={handleComment}
        className="flex items-center gap-2 border-t border-neutral-100 px-4 py-3"
      >
        {currentUser && (
          <Avatar username={currentUser.username} avatarUrl={currentUser.avatarUrl} size="xs" />
        )}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={currentUser ? 'Adicione um comentário…' : 'Entre para comentar…'}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
          maxLength={500}
          onFocus={() => { if (!currentUser) router.push('/login') }}
          readOnly={!currentUser}
        />
        {text.trim() && (
          <button
            type="submit"
            disabled={submitting}
            className="text-sm font-semibold text-[#4A4466] hover:text-[#3a3450] disabled:opacity-40"
          >
            Publicar
          </button>
        )}
      </form>
    </article>
  )
}

function HeartIcon({ filled }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? '#ef4444' : 'none'}
      stroke={filled ? '#ef4444' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="transition-transform group-hover:scale-110"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}
