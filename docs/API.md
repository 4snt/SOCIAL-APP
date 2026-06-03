# 🌐 API REST — Social App

> Base: `http://localhost:8080` (direto) ou `/api` via proxy do Next.js.
> Autenticação por **sessão** — frontend envia `credentials: 'include'` para propagar o cookie `JSESSIONID`.

---

## Autenticação

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Cadastra novo usuário (hash de senha automático) |
| `POST` | `/api/auth/login` | ❌ | Inicia sessão; retorna `{ success, user }` e seta `JSESSIONID` |
| `POST` | `/api/auth/logout` | ✅ | Invalida a sessão |
| `GET`  | `/api/auth/me` | ✅ | Retorna o usuário logado (`401` se sem sessão) |

### `POST /api/auth/login`

```json
// Request
{ "email": "gabriel@email.com", "password": "123" }

// Response 200
{
  "success": true,
  "user": {
    "id": 1, "username": "gabriel", "email": "gabriel@email.com",
    "avatarUrl": "https://...", "bio": "Curtindo a vida..."
  }
}
```

> Em caso de credenciais inválidas, retorna `200` com `{ success: false, message: "Credenciais inválidas" }` — **não** `401`. Veja [AuthController.java:58-62](../backend/src/main/java/com/example/social/controller/AuthController.java#L58-L62).

### `POST /api/auth/register`

```json
// Request — campos da entidade User (e subclasses se quiser persistir como STUDENT/UNIVERSITY)
{
  "username": "novousuario",
  "email": "novo@email.com",
  "password": "senha123",
  "avatarUrl": "https://...",
  "bio": "..."
}

// Response 200 — UserResponse (sem senha)
{ "id": 9, "username": "novousuario", "email": "novo@email.com", "avatarUrl": "...", "bio": "..." }
```

---

## Posts

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET`  | `/api/posts` | ❌ | Lista posts (feed) |
| `GET`  | `/api/posts/{postId}` | ❌ | Detalhe de um post |
| `POST` | `/api/posts` | ✅ | Cria novo post |

### `GET /api/posts`

Query params (todos opcionais):

| Param | Tipo | Default | Valores | Descrição |
|---|---|---|---|---|
| `userId` | `Long` | — | — | Filtra posts de um usuário |
| `sortBy` | `String` | `createdAt` | `createdAt`, `username`, `likes` | Critério de ordenação |
| `direction` | `String` | `desc` | `asc`, `desc` | Sentido |
| `currentUserId` | `Long` | — | — | Override do viewer (normalmente o backend usa a sessão) |

```json
// Response 200 — List<PostResponse>
[
  {
    "id": 1,
    "userId": 4,
    "username": "lara.viagens",
    "avatarUrl": "https://...",
    "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "description": "Praia perfeita pra começar o dia 🌊",
    "likeCount": 7,
    "commentCount": 4,
    "likedByMe": false,
    "createdAt": "2026-05-20T10:00:00"
  }
]
```

### `POST /api/posts`

Cria um novo post com upload de arquivo usando `multipart/form-data`.

```http
POST /api/posts HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="image"; filename="foto.jpg"
Content-Type: image/jpeg

[binary image data]
------WebKitFormBoundary
Content-Disposition: form-data; name="description"

Minha legenda do post
------WebKitFormBoundary--
```

**Validações:**
- `image`: Obrigatório. Apenas arquivos de imagem (MIME type `image/*`)
- `description`: Obrigatório. Máximo 1000 caracteres

**Response 200:**
```json
{
  "id": 21,
  "userId": 1,
  "username": "gabriel",
  "avatarUrl": "https://...",
  "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "description": "Minha legenda do post",
  "likeCount": 0,
  "commentCount": 0,
  "likedByMe": false,
  "createdAt": "2026-06-02T15:30:00",
  "status": "PENDENTE"
}
```

**Response 400:** Campo obrigatório faltando ou tipo de arquivo inválido

---

## Likes

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST`   | `/api/posts/{postId}/like` | ✅ | Curte o post (idempotente — `UNIQUE(user_id, post_id)`) |
| `DELETE` | `/api/posts/{postId}/like` | ✅ | Remove a curtida |

```json
// Response 200 (ambos)
{ "likes": 8 }
```

---

## Comentários

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET`    | `/api/posts/{postId}/comments` | ❌ | Lista comentários de um post |
| `POST`   | `/api/posts/{postId}/comments` | ✅ | Cria comentário |
| `DELETE` | `/api/comments/{commentId}` | ✅ | Remove comentário (apenas o autor) |

### `GET /api/posts/{postId}/comments`

```json
// Response 200 — List<CommentResponse>
[
  {
    "id": 1,
    "userId": 2,
    "username": "maria",
    "avatarUrl": "https://...",
    "content": "Que vista incrível! 😍",
    "createdAt": "2026-05-20T11:00:00"
  }
]
```

### `POST /api/posts/{postId}/comments`

```json
// Request
{ "content": "comentário até 500 chars" }
```

---

## Usuários

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/api/users/{id}` | ❌ | Busca usuário por ID |
| `GET` | `/api/users/by-username/{username}` | ❌ | Busca por username (usado nas páginas `/u/[username]`) |

```json
// Response 200 — UserResponse
{ "id": 1, "username": "gabriel", "email": "gabriel@email.com", "avatarUrl": "...", "bio": "..." }
```

---

## Admin (⚠️ atualmente sem proteção)

> Estas rotas **não** estão sob o prefixo `/api` e **não** validam role — ainda em construção. Ver backlog [EP-05](BACKLOG_SOCIAL_APP.md#ep-05--painel-administrativo).

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET`  | `/admin?adminId=N` | ❌ (a corrigir) | Retorna um `AdminUser` |
| `POST` | `/admin/create` | ❌ (a corrigir) | Cria um `AdminUser` |

---

## Códigos de erro

| Código | Quando |
|---|---|
| `200` | Sucesso. Em alguns fluxos de erro de negócio (login), também retorna `200` com `success: false` |
| `401` | `GET /api/auth/me` sem sessão; ou endpoints protegidos sem cookie |
| `403` | Rota protegida acessada sem permissão |
| `500` | Erros inesperados (ex.: `RuntimeException` de "post não encontrado") |

> Atualmente não há um `@ControllerAdvice` global; muitos erros 4xx aparecem como `500`. Item de melhoria.

---

## Cliente JS (frontend)

Wrapper centralizado em [lib/api.js](../frontend/lib/api.js):

```js
import { getPosts, createPost, likePost, loginUser } from '@/lib/api'

const feed = await getPosts({ sortBy: 'createdAt', direction: 'desc' })

// Criar post com upload de arquivo
const formData = new FormData()
formData.append('image', fileInputElement.files[0])
formData.append('description', 'Minha legenda')
const created = await createPost(formData)

await likePost(created.id)
```

Todas as chamadas passam por um `fetch` com `credentials: 'include'` — o cookie da sessão é enviado automaticamente.
