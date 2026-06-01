'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Avatar from './Avatar'
import { createPost } from '../lib/api'
import { getCurrentUser } from './AuthGate'

export default function PostForm({ onCreated }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!user?.id) return router.push('/login')
    if (!imageUrl.trim() || !description.trim()) {
      setError('Imagem e descrição são obrigatórias.')
      return
    }

    setSubmitting(true)
    try {
      const created = await createPost({
        imageUrl: imageUrl.trim(),
        description: description.trim(),
      })
      setImageUrl('')
      setDescription('')
      onCreated?.(created)
      router.refresh()
    } catch (err) {
      setError(err.message || 'Erro ao publicar.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="card flex items-center justify-between gap-3 px-4 py-3 text-sm">
        <span className="text-neutral-600">Quer compartilhar algo?</span>
        <button onClick={() => router.push('/login')} className="btn-primary">Entrar para postar</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3 p-4">
      <div className="flex items-center gap-3">
        <Avatar username={user.username} avatarUrl={user.avatarUrl} />
        <p className="text-sm font-semibold">@{user.username}</p>
      </div>
      <input
        type="url"
        className="input-field"
        placeholder="URL da imagem (ex: https://images.unsplash.com/...)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        required
      />
      <textarea
        className="input-field min-h-[80px] resize-y"
        placeholder="Escreva uma legenda…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={1000}
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Publicando…' : 'Publicar'}
        </button>
      </div>
    </form>
  )
}
