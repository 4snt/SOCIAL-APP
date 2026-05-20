'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Avatar from './Avatar'
import TimeAgo from './TimeAgo'
import CommentList from './CommentList'
import { createComment, getComments, likePost, unlikePost } from '../lib/api'
import { getCurrentUser } from './AuthGate'

export default function PostCard({ post }) {
  const router = useRouter()
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
    const user = getCurrentUser()
    if (!user) return router.push('/login')

    // Otimista
    const willLike = !liked
    setLiked(willLike)
    setLikes((n) => n + (willLike ? 1 : -1))
    try {
      const { likes: serverLikes } = willLike
        ? await likePost(post.id)
        : await unlikePost(post.id)
      setLikes(serverLikes)
    } catch {
      setLiked(!willLike)
      setLikes((n) => n + (willLike ? -1 : 1))
    }
  }

  async function handleComment(e) {
    e.preventDefault()
    const user = getCurrentUser()
    if (!user) return router.push('/login')
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
      <header className="flex items-center gap-3 px-4 py-3">
        <Link href={`/u/${post.username}`}>
          <Avatar username={post.username} avatarUrl={post.avatarUrl} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/u/${post.username}`} className="block truncate text-sm font-semibold text-neutral-900 hover:underline">
            @{post.username}
          </Link>
          <TimeAgo date={post.createdAt} />
        </div>
      </header>

      <Link href={`/post/${post.id}`} className="block bg-neutral-100">
        <img
          src={post.imageUrl}
          alt={post.description}
          className="max-h-[560px] w-full object-cover"
          loading="lazy"
        />
      </Link>

      <div className="px-4 pb-2 pt-3">
        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            aria-label={liked ? 'Descurtir' : 'Curtir'}
            className="rounded-full p-2 transition hover:bg-neutral-100"
          >
            <HeartIcon filled={liked} />
          </button>
          <button
            onClick={() => setShowComments((v) => !v)}
            aria-label="Comentar"
            className="rounded-full p-2 transition hover:bg-neutral-100"
          >
            <CommentIcon />
          </button>
        </div>

        <p className="mt-1 text-sm font-semibold">
          {likes} {likes === 1 ? 'curtida' : 'curtidas'}
        </p>

        <p className="mt-1 text-sm">
          <Link href={`/u/${post.username}`} className="font-semibold hover:underline">
            @{post.username}
          </Link>{' '}
          <span className="text-neutral-800">{post.description}</span>
        </p>

        {commentCount > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="mt-2 text-xs text-neutral-500 hover:underline"
          >
            Ver {commentCount === 1 ? '1 comentário' : `os ${commentCount} comentários`}
          </button>
        )}
      </div>

      {showComments && (
        <div className="border-t border-neutral-100">
          {comments === null
            ? <p className="px-4 py-3 text-sm text-neutral-500">Carregando comentários…</p>
            : <CommentList comments={comments} />}
        </div>
      )}

      <form
        onSubmit={handleComment}
        className="flex items-center gap-2 border-t border-neutral-100 px-4 py-3"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Adicione um comentário…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!text.trim() || submitting}
          className="text-sm font-semibold text-brand-600 disabled:opacity-40"
        >
          Publicar
        </button>
      </form>
    </article>
  )
}

function HeartIcon({ filled }) {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24" fill={filled ? '#ef4444' : 'none'}
      stroke={filled ? '#ef4444' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}
