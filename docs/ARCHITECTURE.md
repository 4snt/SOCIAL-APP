# 🏛️ Arquitetura — Social App

> Visão técnica do sistema: stack, camadas, fluxos e modelo de dados.
> Diagramas em [Mermaid](https://mermaid.js.org/) — renderizam direto no GitHub.

---

## 1. Visão geral

Aplicação web no formato de feed social acadêmico, dividida em três contêineres orquestrados via `docker-compose`:

```mermaid
flowchart LR
    user([👤 Usuário])

    subgraph Browser["Navegador"]
      next["Next.js<br/>(SSR/CSR)"]
    end

    subgraph Docker["docker-compose"]
      direction LR
      fe["social-frontend<br/>Next.js 14<br/>:3000"]
      be["social-backend<br/>Spring Boot 3<br/>:8080"]
      db[("social-db<br/>PostgreSQL 16<br/>:5432")]
    end

    user -->|HTTP| next
    next -->|"/api/* (rewrite)"| fe
    fe -->|REST<br/>JSON + cookie JSESSIONID| be
    be -->|JDBC| db
```

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind | UI, rotas, chamadas REST com `credentials: 'include'` |
| Backend | Spring Boot 3 + Spring Security + JPA | API REST, autenticação por sessão, regras de negócio |
| Banco | PostgreSQL 16 | Persistência relacional |
| Orquestração | Docker Compose | Build e subida local dos três serviços |

---

## 2. Arquitetura interna do backend

Padrão de camadas clássico Spring (Controller → Service → Repository → Entity):

```mermaid
flowchart TB
    subgraph Web["Camada Web (REST)"]
      AC[AuthController]
      PC[PostController]
      CC[CommentController]
      LC[LikeController]
      UC[UserController]
      AdmC[AdminController]
    end

    subgraph Sec["Spring Security"]
      SC[SecurityConfig<br/>+ BCryptPasswordEncoder<br/>+ HttpSession]
    end

    subgraph Svc["Camada de Serviço"]
      AS[AuthService]
      PS[PostService]
      CS[CommentService]
      LS[LikeService]
      US[UserService<br/>implements UserDetailsService]
    end

    subgraph Rep["Camada de Repositório (JPA)"]
      UR[(UserRepository)]
      PR[(PostRepository)]
      CR[(CommentRepository)]
      LR[(LikeRepository)]
    end

    subgraph DB["PostgreSQL"]
      Tu[(users<br/>SINGLE_TABLE)]
      Tp[(posts)]
      Tc[(comments)]
      Tl[(likes)]
    end

    AC --> SC
    AC --> AS
    AC --> US
    PC --> PS
    PC --> AS
    CC --> CS
    CC --> AS
    LC --> LS
    LC --> AS
    UC --> US
    AdmC --> US

    PS --> PR
    PS --> UR
    PS --> LR
    PS --> CR
    CS --> CR
    CS --> UR
    CS --> PR
    LS --> LR
    LS --> UR
    LS --> PR
    US --> UR
    AS --> UR

    UR --> Tu
    PR --> Tp
    CR --> Tc
    LR --> Tl
```

**Pontos-chave:**

- **Autenticação por sessão** (`HttpSession` + cookie `JSESSIONID`), não JWT. O frontend envia `credentials: 'include'` em todas as chamadas.
- **BCrypt** para hash de senha ([SecurityConfig.java:71-73](backend/src/main/java/com/example/social/config/SecurityConfig.java#L71-L73)).
- **CORS** liberado para `http://localhost:3000` com `allowCredentials = true`.
- **CSRF desabilitado** — adequado pra dev, deve ser revisto antes de produção.

---

## 3. Modelo de dados

### 3.1 Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    USERS ||--o{ POSTS    : "cria"
    USERS ||--o{ COMMENTS : "escreve"
    USERS ||--o{ LIKES    : "dá"
    POSTS ||--o{ COMMENTS : "recebe"
    POSTS ||--o{ LIKES    : "recebe"

    USERS {
        bigint id PK
        varchar dtype "USER|STUDENT|UNIVERSITY|ADMIN"
        varchar username
        varchar email UK
        varchar password "BCrypt"
        varchar avatar_url
        varchar bio
        varchar student_name "nullable"
        varchar course "nullable"
        varchar university_name "nullable"
        varchar admin_name "nullable"
    }

    POSTS {
        bigint id PK
        bigint user_id FK
        varchar image_url
        varchar description
        timestamp created_at
    }

    COMMENTS {
        bigint id PK
        bigint user_id FK
        bigint post_id FK
        varchar content
        timestamp created_at
    }

    LIKES {
        bigint id PK
        bigint user_id FK
        bigint post_id FK
        timestamp created_at
    }
```

> A tabela `likes` tem `UNIQUE(user_id, post_id)` — um usuário só curte um post uma vez.

### 3.2 Herança de usuários (SINGLE_TABLE)

A entidade `User` usa `@Inheritance(SINGLE_TABLE)` com discriminador `dtype`. Todos os perfis compartilham a mesma tabela `users`:

```mermaid
classDiagram
    class User {
        +Long id
        +String username
        +String email
        +String password
        +String avatarUrl
        +String bio
    }
    class StudentsUser {
        +String studentName
        +String course
    }
    class UniversityUser {
        +String universityName
    }
    class AdminUser {
        +String adminName
    }

    User <|-- StudentsUser
    User <|-- UniversityUser
    User <|-- AdminUser

    note for User "@DiscriminatorColumn(dtype)\n@DiscriminatorValue('USER')"
    note for StudentsUser "@DiscriminatorValue('STUDENT')"
    note for UniversityUser "@DiscriminatorValue('UNIVERSITY')"
    note for AdminUser "@DiscriminatorValue('ADMIN')"
```

A migração [schema.sql](backend/src/main/resources/schema.sql) garante idempotência ao adicionar as colunas das subclasses em bancos pré-existentes.

---

## 4. Fluxos principais

### 4.1 Login

```mermaid
sequenceDiagram
    actor U as Usuário
    participant FE as Next.js
    participant BE as AuthController
    participant SS as Spring Security
    participant DB as Postgres

    U->>FE: preenche email + senha
    FE->>BE: POST /api/auth/login (credentials: include)
    BE->>SS: authenticationManager.authenticate(...)
    SS->>DB: SELECT * FROM users WHERE email=?
    DB-->>SS: hash BCrypt
    SS-->>BE: Authentication OK
    BE->>BE: SecurityContext + HttpSession.setAttribute(SPRING_SECURITY_CONTEXT)
    BE-->>FE: 200 {success: true, user} + Set-Cookie JSESSIONID
    FE-->>U: redireciona pro feed
```

### 4.2 Listar feed (visitante e logado)

```mermaid
sequenceDiagram
    actor U as Usuário
    participant FE as Next.js
    participant BE as PostController
    participant PS as PostService
    participant DB as Postgres

    U->>FE: acessa /
    FE->>BE: GET /api/posts?sortBy=createdAt&direction=desc
    BE->>BE: AuthService.getCurrentUserIdOrNull()<br/>(null se visitante)
    BE->>PS: findPosts(...)
    PS->>DB: SELECT posts JOIN users
    loop por post
        PS->>DB: COUNT(likes), COUNT(comments)
        PS->>DB: EXISTS(like do viewer) se logado
    end
    PS-->>BE: List<PostResponse>
    BE-->>FE: 200 [PostResponse{ likeCount, commentCount, likedByMe }]
    FE-->>U: renderiza feed
```

> O endpoint `GET /api/posts` é **público** ([SecurityConfig.java:47](backend/src/main/java/com/example/social/config/SecurityConfig.java#L47)) — quando logado, vem com `likedByMe` populado; visitante recebe `false`.

### 4.3 Criar post + dar like

```mermaid
sequenceDiagram
    actor U as Usuário logado
    participant FE as Next.js
    participant BE as Backend
    participant DB as Postgres

    U->>FE: cola URL da imagem + descrição
    FE->>BE: POST /api/posts (cookie JSESSIONID)
    BE->>BE: AuthService.requireCurrentUser() ➜ User
    BE->>DB: INSERT INTO posts (...)
    DB-->>BE: post.id
    BE-->>FE: 200 PostResponse
    FE-->>U: post aparece no feed

    U->>FE: clica no ❤️
    FE->>BE: POST /api/posts/{id}/like
    BE->>DB: INSERT INTO likes (user_id, post_id)<br/>(UNIQUE constraint impede duplicata)
    BE->>DB: SELECT COUNT(*) FROM likes WHERE post_id=?
    BE-->>FE: 200 { likes: N }
    FE-->>U: contador atualiza
```

---

## 5. Frontend (Next.js App Router)

```mermaid
flowchart LR
    subgraph Pages["app/"]
      home[/"page.js<br/>feed público"/]
      login[/"login/page.js"/]
      signup[/"signup/page.js"/]
      profile[/"profile/page.js<br/>(do logado)"/]
      uprofile[/"u/[username]/page.js"/]
      uprofile2[/"userProfile/page.js"/]
      post[/"post/[id]/page.js"/]
    end

    subgraph Components["components/"]
      header[Header]
      gate[AuthGate]
      card[PostCard]
      form[PostForm]
      cmts[CommentList]
      av[Avatar]
      empty[EmptyState]
      ta[TimeAgo]
    end

    api["lib/api.js<br/>fetch wrapper"]

    home --> card
    home --> form
    home --> empty
    post --> card
    post --> cmts
    uprofile --> card
    profile --> card
    Components -.usa.-> api
    Pages -.layout.-> header
    Pages -.guarda.-> gate
```

- **`lib/api.js`** centraliza o `fetch` com `credentials: 'include'` para enviar o cookie de sessão.
- **`AuthGate`** protege rotas no client-side; a API ainda valida a sessão no backend.
- A base da URL é sempre `/api` (relativa) — em dev o Next faz proxy pro `localhost:8080`; em Docker, pro hostname `backend`.

---

## 6. Segurança — estado atual

| Item | Implementado | Observação |
|---|---|---|
| Senha em hash BCrypt | ✅ | [SecurityConfig.java:71](backend/src/main/java/com/example/social/config/SecurityConfig.java#L71) |
| Sessão via cookie HttpOnly | ✅ | Padrão do Spring Security |
| CORS restrito a localhost:3000 | ✅ | [SecurityConfig.java:61](backend/src/main/java/com/example/social/config/SecurityConfig.java#L61) |
| Rotas `/api/posts` e `/api/users/**` GET públicas | ✅ | Por design (feed visível pra visitante) |
| CSRF | ❌ desabilitado | Aceitável em dev; revisar antes de prod |
| `/admin` e `/admin/create` sem proteção | ⚠️ | [AdminController.java](backend/src/main/java/com/example/social/controller/AdminController.java) — atualmente fora do prefixo `/api`, sem `requireRole` |
| Verificação de e-mail institucional | ❌ | Previsto no backlog (EP-01) |
| Rate limiting / lockout | ❌ | Não implementado |

---

## 7. Subindo o projeto

```bash
docker compose up --build
```

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8080/api/posts |
| Postgres | `localhost:5432` (db `socialdb`, user `admin`, senha `abc123`) |

Em dev local sem Docker, o backend espera Postgres em `localhost:5433` por padrão ([application.yml:3](backend/src/main/resources/application.yml#L3)).

### Seeds

- [schema.sql](backend/src/main/resources/schema.sql) — colunas do discriminador (idempotente).
- [data.sql](backend/src/main/resources/data.sql) — 8 usuários (senha `123`), 20 posts, 60 comentários, 90+ likes.

---

## 8. Referências cruzadas

- 📋 [Backlog](BACKLOG_SOCIAL_APP.md) — épicos, user stories e estimativas.
- 🌐 [API.md](API.md) — referência detalhada dos endpoints.
- 🐳 [docker-compose.yml](../docker-compose.yml) — orquestração.
