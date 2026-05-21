# Social App

Aplicação de feed social acadêmico — projeto da disciplina de Sistemas de Informação (UFVJM).

## Stack

- **Backend:** Spring Boot 3 + Spring Security + JPA/Hibernate
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Banco:** PostgreSQL 16
- **Orquestração:** Docker Compose

## Como subir

```bash
docker compose up --build
```

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8080/api/posts |
| Postgres | `localhost:5432` (db `socialdb`, user `admin`, senha `abc123`) |

> Usuários de seed têm senha `123` (ex.: `gabriel@email.com`, `maria@email.com`).

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
