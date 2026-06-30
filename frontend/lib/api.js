// Sempre usa rota relativa /api — em prod/docker o rewrite do next.config
// envia para http://backend:8080; em dev local envia para http://localhost:8080.
const API_BASE = '/api'

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) }
  
  // Não adiciona Content-Type se for FormData (o navegador configura automaticamente)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  
  const res = await fetch(`${API_BASE}${path}`, {
    cache: 'no-store',
    credentials: 'include',
    headers,
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    let message = text || `Erro na requisição (${res.status})`
    try {
      const json = JSON.parse(text)
      if (json.message) message = json.message
    } catch {
      // mantém texto bruto
    }
    throw new Error(message)
  }
  if (res.status === 204) return null
  return res.json()
}

// -------- POSTS --------
export async function getPosts({ userId, sortBy = 'createdAt', direction = 'desc', currentUserId } = {}) {
  const params = new URLSearchParams()
  if (userId != null) params.set('userId', userId)
  params.set('sortBy', sortBy)
  params.set('direction', direction)
  if (currentUserId != null) params.set('currentUserId', currentUserId)
  return request(`/posts?${params.toString()}`)
}

export async function getPostById(postId, currentUserId) {
  const params = new URLSearchParams()
  if (currentUserId != null) params.set('currentUserId', currentUserId)
  const qs = params.toString()
  return request(`/posts/${postId}${qs ? `?${qs}` : ''}`)
}

export async function createPost(formData) {
  // formData deve ser uma instância de FormData com "image" e "description"
  return request(`/posts`, { method: 'POST', body: formData })
}

export async function deletePost(postId) {
  return request(`/posts/${postId}`, { method: 'DELETE' })
}

// -------- LIKES --------
export async function likePost(postId) {
  return request(`/posts/${postId}/like`, { method: 'POST' })
}

export async function unlikePost(postId) {
  return request(`/posts/${postId}/like`, { method: 'DELETE' })
}

// -------- COMMENTS --------
export async function getComments(postId) {
  return request(`/posts/${postId}/comments`)
}

export async function createComment(postId, { content }) {
  return request(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

export async function deleteComment(commentId) {
  return request(`/comments/${commentId}`, { method: 'DELETE' })
}

// -------- USERS / AUTH --------
export async function registerUser(data) {
  return request(`/auth/register`, { method: 'POST', body: JSON.stringify(data) })
}

export async function loginUser(data) {
  return request(`/auth/login`, { method: 'POST', body: JSON.stringify(data) })
}

export async function logoutUser() {
  return request(`/auth/logout`, { method: 'POST' })
}

export async function getCurrentUserFromSession() {
  return request(`/auth/me`)
}

export async function getUserByUsername(username) {
  return request(`/users/by-username/${encodeURIComponent(username)}`)
}

export async function getUserById(id) {
  return request(`/users/${id}`)
}
