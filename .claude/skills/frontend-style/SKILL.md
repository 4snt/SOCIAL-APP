---
name: frontend-style
description: Guia de estilo do frontend (Next.js + Tailwind) do Social App. Use SEMPRE que for criar, editar ou refatorar componentes/páginas em `frontend/` — garante consistência com os padrões já existentes (paleta `brand-*`, classes utilitárias `btn-primary`/`btn-ghost`/`input-field`/`card`, estrutura de componentes, idioma PT-BR, uso de `lib/api.js` e `getCurrentUser()`).
---

# Guia de Estilo — Frontend (Social App)

Este projeto usa **Next.js 14 (App Router)** + **Tailwind CSS** + **React Client Components**. Toda nova UI deve seguir os padrões abaixo. Quando estiver editando algo já existente, **siga o estilo do componente vizinho** em vez de introduzir um novo.

---

## 1. Paleta e tema

Cores e fontes ficam em [frontend/tailwind.config.js](frontend/tailwind.config.js):

- **Cor primária**: `brand-*` (índigo) — escala completa de `brand-50` a `brand-900`. Use `brand-600` como cor principal (botões, links destacados) e `brand-700` no hover.
- **Cinzas**: use a escala `neutral-*` do Tailwind (`neutral-50` fundo, `neutral-100`/`200` bordas, `neutral-500` texto secundário, `neutral-700`/`900` texto principal).
- **Erro**: `red-600` para texto, `red-50` para fundo de alerta.
- **Fonte**: Inter (já carregada em [app/layout.js](frontend/app/layout.js)). Não importe outras.

```jsx
// ✅ Bom
<button className="bg-brand-600 hover:bg-brand-700 text-white">
<p className="text-neutral-500">

// ❌ Evite
<button className="bg-indigo-500 hover:bg-blue-600">  // cor crua
<p className="text-gray-600">                          // gray em vez de neutral
```

---

## 2. Classes utilitárias do projeto

Definidas em [frontend/app/globals.css](frontend/app/globals.css) sob `@layer components`. **Use estas em vez de reinventar:**

| Classe | Quando usar | Exemplo |
|---|---|---|
| `btn-primary` | Ação principal (publicar, entrar, criar conta) | `<button className="btn-primary">Publicar</button>` |
| `btn-ghost` | Ação secundária (cancelar, navegar, "Feed") | `<Link href="/" className="btn-ghost">Feed</Link>` |
| `input-field` | Inputs e textareas de formulário | `<input className="input-field" />` |
| `card` | Qualquer container "elevado" sobre o fundo cinza | `<article className="card overflow-hidden">` |

**Composição:** `card` aceita modificadores Tailwind normais — `card p-4`, `card space-y-3 p-6`, `card overflow-hidden`. Se precisar de variação visual maior, **crie uma nova classe `.card-*` em `globals.css`**, não duplique utilitários inline em vários lugares.

---

## 3. Estrutura de um componente

Todos os componentes interativos seguem este shape:

```jsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { algumaApi } from '../lib/api'
import { getCurrentUser } from './AuthGate'

export default function MeuComponente({ prop1, onAlgo }) {
  const router = useRouter()
  const [valor, setValor] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const user = getCurrentUser()
    if (!user) return router.push('/login')

    setSubmitting(true)
    try {
      const result = await algumaApi(...)
      onAlgo?.(result)
    } catch (err) {
      setError(err.message || 'Erro genérico.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3 p-4">
      {/* ... */}
    </form>
  )
}
```

**Regras:**

- `'use client'` no topo de qualquer componente com hooks/eventos. Server Components só pra páginas estáticas.
- **`export default`** para o componente principal do arquivo. Sub-componentes auxiliares (ex.: `HeartIcon`, `FeedSkeleton`) ficam **no mesmo arquivo**, sem export.
- Ordem dentro do componente: `useRouter` → `useState` → `useEffect` → handlers → `return`.
- Loading state via flag `submitting` (não `loading`) em formulários; `loading` é pra fetch inicial.
- Erros guardados em `error` (string) e renderizados como `<p className="text-sm text-red-600">{error}</p>`.

---

## 4. Autenticação (client-side)

O backend usa **sessão por cookie**, mas o frontend mantém o usuário em `localStorage.user` pra render condicional. Nunca acesse `localStorage` direto — use sempre [AuthGate.jsx](frontend/components/AuthGate.jsx):

```jsx
import { getCurrentUser } from './AuthGate'

// Em handlers:
const user = getCurrentUser()
if (!user) return router.push('/login')

// Em render (cuidado com SSR):
const user = typeof window !== 'undefined' ? getCurrentUser() : null
```

Após login bem-sucedido: `localStorage.setItem('user', JSON.stringify(result.user))` e `router.push('/') + router.refresh()`.
No logout: `localStorage.removeItem('user')` + `router.push('/')`.

---

## 5. Chamadas à API

**Sempre** importe de [lib/api.js](frontend/lib/api.js) — nunca chame `fetch` direto. Se faltar um endpoint, adicione lá com o mesmo padrão (função nomeada exportada, usa o wrapper `request`).

```jsx
// ✅ Bom
import { getPosts, createPost, likePost } from '../lib/api'
const posts = await getPosts({ sortBy: 'createdAt', direction: 'desc' })

// ❌ Evite
const res = await fetch('/api/posts', { credentials: 'include' })
```

O wrapper já cuida de `credentials: 'include'`, `Content-Type`, parse JSON e tratamento de `204`.

---

## 6. Layout e espaçamento

- Container global em [app/layout.js](frontend/app/layout.js): `mx-auto max-w-3xl px-4 py-6`. Não recrie isso nas páginas.
- Para páginas estreitas (login, signup), use `<main className="mx-auto max-w-md">` por dentro.
- Espaçamento vertical entre seções: `space-y-4`. Entre campos de formulário: `space-y-3`.
- Padding interno de cards: `p-4` (padrão) ou `p-6` (modais/formulários grandes).
- Bordas arredondadas: `rounded-2xl` (cards grandes), `rounded-xl` (inputs/cards menores), `rounded-full` (botões, avatares, pílulas).

---

## 7. Tipografia

| Uso | Classes |
|---|---|
| Título de página (h1) | `text-xl font-bold tracking-tight` |
| Título de seção (h2/h3) | `text-base font-semibold text-neutral-900` |
| Texto principal | `text-sm` (sem cor → herda `neutral-900` do `<body>`) |
| Texto secundário | `text-sm text-neutral-500` (ou `neutral-700` se precisar mais contraste) |
| Metadados (data, contadores) | `text-xs text-neutral-500` |
| Link inline | `font-semibold text-brand-600 hover:underline` (ou `font-semibold hover:underline` se já estiver dentro de bloco colorido) |
| Username em destaque | `font-semibold` precedido de `@` (ex.: `@maria`) |

---

## 8. Ícones

SVG inline, definidos como funções **no mesmo arquivo** que os usam (ver `HeartIcon` e `CommentIcon` em [PostCard.jsx:159](frontend/components/PostCard.jsx#L159)). Padrão: `width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"`. **Não** instale `lucide-react`, `heroicons` ou similares sem combinar.

---

## 9. Estados de UI

Todo componente que faz fetch deve cobrir os 4 estados:

1. **Loading** → skeleton com `animate-pulse` e blocos `bg-neutral-200` (ver `FeedSkeleton` em [app/page.js:73](frontend/app/page.js#L73)).
2. **Erro** → banner `rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700`.
3. **Vazio** → `<EmptyState icon="..." title="..." description="..." />`.
4. **Sucesso** → renderiza os dados.

UI otimista (like, comentário): atualiza estado local primeiro, chama API, **reverte no `catch`**. Ver `handleLike` em [PostCard.jsx:27](frontend/components/PostCard.jsx#L27).

---

## 10. Idioma e tom

- Todo texto de UI em **português brasileiro**, informal mas educado.
- Reticências = `…` (unicode), não `...`.
- Placeholders curtos com `…` no fim: `"Adicione um comentário…"`, `"Publicando…"`.
- Datas relativas: use sempre `<TimeAgo date={...} />` ([TimeAgo.jsx](frontend/components/TimeAgo.jsx)) — nunca formate manualmente.

---

## 11. Acessibilidade (mínimo)

- Botões só com ícone precisam de `aria-label` (ex.: `aria-label="Curtir"`).
- Inputs sem `<label>` visível precisam de `placeholder` claro.
- Use elementos semânticos: `<article>` pra cards de post, `<header>`/`<nav>`/`<main>` no layout, `<time>` pra datas.

---

## 12. Antes de criar um componente novo

Cheque se já existe em [frontend/components/](frontend/components/):

| Preciso de... | Use |
|---|---|
| Avatar circular | `<Avatar username avatarUrl size="sm|md|lg" />` |
| Estado vazio | `<EmptyState icon title description />` |
| Data relativa | `<TimeAgo date={iso} />` |
| Lista de comentários | `<CommentList comments={array} limit={n?} />` |
| Card de post | `<PostCard post={obj} />` |
| Formulário de post | `<PostForm onCreated={fn} />` |
| Container principal | já vem do `RootLayout` |

Se nenhum servir, crie o novo em `frontend/components/`, com `export default`, e considere se vale a pena promover algum trecho repetido pra `globals.css`.

---

## 13. Checklist rápido (PR de frontend)

- [ ] Usei `brand-*` / `neutral-*` em vez de cores cruas
- [ ] Usei `btn-primary` / `btn-ghost` / `input-field` / `card` quando aplicável
- [ ] `'use client'` no topo se tem hooks ou handlers
- [ ] Chamadas de API passam por `lib/api.js`
- [ ] Estados: loading (skeleton), erro (banner vermelho), vazio (`EmptyState`)
- [ ] Texto em PT-BR, reticências `…`, datas via `<TimeAgo>`
- [ ] Botões só com ícone têm `aria-label`
- [ ] Não reinventei componente que já existe em `components/`
