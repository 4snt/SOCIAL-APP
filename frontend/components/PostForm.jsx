'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Avatar from './Avatar'
import { createPost } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const CATEGORIAS = [
  { value: '', label: 'Selecione uma área…' },
  { value: 'RU', label: 'Restaurante Universitário' },
  { value: 'BIBLIOTECA', label: 'Biblioteca' },
  { value: 'INFRAESTRUTURA', label: 'Infraestrutura' },
  { value: 'TI', label: 'Tecnologia da Informação' },
  { value: 'TRANSPORTE', label: 'Transporte' },
  { value: 'SAUDE', label: 'Saúde / DAE' },
  { value: 'ACADEMICO', label: 'Acadêmico / Secretaria' },
  { value: 'ESPORTE', label: 'Esporte e Lazer' },
  { value: 'OUTRO', label: 'Outro' },
]

export default function PostForm({ onCreated }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [description, setDescription] = useState('')
  const [categoria, setCategoria] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) { setImageFile(null); setImagePreview(''); return }
    if (!file.type.startsWith('image/')) { setError('Apenas arquivos de imagem são permitidos.'); return }
    setError('')
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  function handleReset() {
    setExpanded(false)
    setImageFile(null)
    setImagePreview('')
    setDescription('')
    setCategoria('')
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!user?.id) return router.push('/login')
    if (!description.trim()) { setError('Descreva a demanda antes de publicar.'); return }

    setSubmitting(true)
    try {
      const formData = new FormData()
      if (imageFile) formData.append('image', imageFile)
      formData.append('description', description.trim())
      if (categoria) formData.append('categoria', categoria)

      const created = await createPost(formData)
      onCreated?.(created)
      handleReset()
      router.refresh()
    } catch (err) {
      setError(err.message || 'Erro ao publicar. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) return <div className="card px-4 py-3 text-sm text-neutral-400">Carregando…</div>

  if (!user) {
    return (
      <div className="card flex items-center justify-between gap-3 px-4 py-3.5">
        <p className="text-sm text-neutral-500">Tem uma demanda para compartilhar?</p>
        <button onClick={() => router.push('/login')} className="btn-primary text-xs px-3 py-1.5">
          Entrar para postar
        </button>
      </div>
    )
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="card w-full flex items-center gap-3 px-4 py-3.5 text-left transition hover:ring-brand-200 hover:ring-2"
      >
        <Avatar username={user.username} avatarUrl={user.avatarUrl} size="sm" />
        <span className="text-sm text-neutral-400">Compartilhe uma demanda ou problema…</span>
        <span className="ml-auto btn-primary text-xs px-3 py-1.5 pointer-events-none">Nova publicação</span>
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <Avatar username={user.username} avatarUrl={user.avatarUrl} />
        <div>
          <p className="text-sm font-semibold text-neutral-900">@{user.username}</p>
          <p className="text-xs text-neutral-400">Nova publicação</p>
        </div>
        <button type="button" onClick={handleReset} className="ml-auto text-neutral-400 hover:text-neutral-600 p-1">
          <CloseIcon />
        </button>
      </div>

      {/* Categoria */}
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="input-field text-sm"
      >
        {CATEGORIAS.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      {/* Descrição */}
      <textarea
        className="input-field min-h-[100px] resize-y"
        placeholder="Descreva a demanda, problema ou sugestão com detalhes…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={1000}
        required
        autoFocus
      />

      {/* Imagem opcional */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <span className="text-xs font-medium text-neutral-500">Anexar imagem (opcional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <span className="inline-flex items-center gap-1 rounded-lg border border-dashed border-neutral-300 px-3 py-1.5 text-xs text-neutral-500 hover:border-brand-400 hover:text-brand-600 transition">
            <ImageIcon /> Escolher foto
          </span>
        </label>
        {imagePreview && (
          <div className="relative overflow-hidden rounded-xl bg-neutral-100">
            <img src={imagePreview} alt="Preview" className="max-h-72 w-full object-cover" />
            <button
              type="button"
              onClick={() => { setImageFile(null); setImagePreview('') }}
              className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <CloseIcon size={14} />
            </button>
          </div>
        )}
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-end gap-2">
        <button type="button" onClick={handleReset} className="btn-ghost text-sm">Cancelar</button>
        <button type="submit" disabled={submitting || !description.trim()} className="btn-primary">
          {submitting ? 'Publicando…' : 'Publicar'}
        </button>
      </div>
    </form>
  )
}

function ImageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
    </svg>
  )
}

function CloseIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}
