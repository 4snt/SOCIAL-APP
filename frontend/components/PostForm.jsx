'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Avatar from './Avatar'
import { createPost } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function PostForm({ onCreated }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) {
      setImageFile(null)
      setImagePreview('')
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Apenas arquivos de imagem são permitidos.')
      return
    }

    setError('')
    setImageFile(file)

    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!user?.id) return router.push('/login')
    if (!imageFile || !description.trim()) {
      setError('Imagem e descrição são obrigatórias.')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('description', description.trim())

      const created = await createPost(formData)
      setImageFile(null)
      setImagePreview('')
      setDescription('')
      onCreated?.(created)
      router.refresh()
    } catch (err) {
      setError(err.message || 'Erro ao publicar.')
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="card px-4 py-3 text-sm text-neutral-500">
        Carregando…
      </div>
    )
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

      <div className="space-y-2">
        <label htmlFor="image-input" className="block text-sm font-medium text-neutral-700">
          Selecionar imagem
        </label>
        <input
          id="image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="input-field block w-full text-sm"
          required
        />
        {imagePreview && (
          <div className="relative w-full overflow-hidden rounded bg-neutral-100">
            <img src={imagePreview} alt="Preview" className="max-h-80 h-auto w-full object-cover" />
          </div>
        )}
      </div>

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
