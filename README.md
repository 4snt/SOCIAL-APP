# Social App

Aplicação de feed social acadêmico — projeto da disciplina de Sistemas de Informação (UFVJM).

## Stack

- **Backend:** Spring Boot 3 + Spring Security + JPA/Hibernate
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Banco:** PostgreSQL 16
- **Orquestração:** Docker Compose

## Como subir

### Local (Docker Compose)

```bash
# 1. copie o template de variáveis de ambiente
cp .env.example .env

# 2. ajuste os valores em .env se necessário (defaults já funcionam)

# 3. suba os containers
docker compose up --build
```

| Serviço | URL padrão |
|---|---|
| Frontend | http://localhost:6003 |
| Backend | http://localhost:6001/api/posts |
| Postgres | `localhost:6002` (db `socialdb`, user `admin`, senha `abc123`) |

As portas do host são configuráveis via `DB_HOST_PORT`, `BACKEND_HOST_PORT` e `FRONTEND_HOST_PORT` no `.env`.

> Usuários de seed têm senha `123` (ex.: `gabriel@email.com`, `maria@email.com`).

### Deploy no Coolify

No Coolify, configure as seguintes variáveis de ambiente pelo painel (as portas do host não são necessárias — o Traefik gerencia o roteamento):

| Variável | Descrição | Exemplo prod |
|---|---|---|
| `POSTGRES_DB` | Nome do banco | `socialdb` |
| `POSTGRES_USER` | Usuário do banco | `admin` |
| `POSTGRES_PASSWORD` | Senha do banco | `<senha segura>` |
| `SPRING_DATASOURCE_URL` | URL JDBC interna | `jdbc:postgresql://db:5432/socialdb` |
| `CORS_ALLOWED_ORIGINS` | Domínios permitidos pelo CORS | `https://seu-dominio.com,https://www.seu-dominio.com` |
| `NEXT_PUBLIC_API_URL` | URL interna do backend (server-side) | `http://backend:8080` |

## Estrutura

```
.
├── backend/          # Spring Boot — controllers, services, entities, repositories
│   └── src/main/java/com/example/social/
├── frontend/         # Next.js — app/, components/, lib/
├── docs/             # Documentação do projeto
│   ├── ARCHITECTURE.md       # diagramas (Mermaid), camadas, fluxos
│   ├── API.md                # referência REST
│   └── BACKLOG_SOCIAL_APP.md # épicos e user stories
└── docker-compose.yml
```

## Documentação

- 🏛️ [Arquitetura](docs/ARCHITECTURE.md) — visão técnica do sistema, diagramas C4/ER/sequência e modelo de dados.
- 🌐 [API REST](docs/API.md) — referência de endpoints com exemplos de request/response.
- 📋 [Backlog](docs/BACKLOG_SOCIAL_APP.md) — épicos, user stories e estimativas por papel.

## Equipe

| Membro | Papel |
|---|---|
| Gabriel Castro Guimarães | Backend |
| Humberto Freire Pereira | Frontend |
| Pávila Miranda Cardoso | Frontend |
| Victor Ryan Vieira | DevOps |
| Murilo Santiago Escobedo | QA |
