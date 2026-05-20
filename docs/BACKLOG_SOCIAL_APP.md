# 📋 Backlog — Sistema Colaborativo com Apoio à Democracia Eletrônica

> **Repositório:** https://github.com/GabGC0608/SOCIAL-APP  
> **Disciplina:** Sistemas de Informação — UFVJM  
> **Equipe:**
> | Membro | Papel |
> |---|---|
> | Gabriel Castro Guimarães | Backend (BE) |
> | Humberto Freire Pereira | Frontend (FE) |
> | Pávila Miranda Cardoso | Frontend (FE) |
> | Victor Ryan Vieira | DevOps (OPS) |
> | Murilo Santiago Escobedo | QA |

---

## 🗂️ Índice de Épicos

| # | Épico | Prioridade |
|---|---|---|
| EP-01 | Autenticação e Controle de Acesso | 🔴 Alta |
| EP-02 | Feed e Gerenciamento de Propostas | 🔴 Alta |
| EP-03 | Página de Demandas em Andamento | 🟡 Média |
| EP-04 | Ranking de Engajamento | 🟡 Média |
| EP-05 | Painel Administrativo | 🔴 Alta |
| EP-06 | Infraestrutura e CI/CD | 🟡 Média |
| EP-07 | QA e Qualidade | 🔵 Contínua |

---

## EP-01 — Autenticação e Controle de Acesso

> **Objetivo:** Garantir que apenas membros da comunidade acadêmica (alunos, professores, técnicos) possam acessar a plataforma, via e-mail institucional da UFVJM.

### US-01.1 — Cadastro com e-mail institucional

**Como** membro da comunidade acadêmica,  
**quero** me cadastrar usando meu e-mail `@ufvjm.edu.br`,  
**para** garantir que só pessoas da instituição acessem a plataforma.

**Critérios de Aceite:**
- [ ] O sistema aceita apenas e-mails com domínio `@ufvjm.edu.br` (ou domínios configuráveis pelo admin)
- [ ] E-mails de domínios externos são recusados com mensagem clara
- [ ] Um e-mail de confirmação é enviado após o cadastro
- [ ] O usuário só consegue logar após confirmar o e-mail

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-01.1.1 | Criar endpoint `POST /auth/register` com validação de domínio por regex | BE | 3h |
| T-01.1.2 | Configurar lista de domínios permitidos via variável de ambiente | BE | 1h |
| T-01.1.3 | Integrar serviço de envio de e-mail (ex: Resend, Nodemailer) | BE | 3h |
| T-01.1.4 | Criar token de verificação com expiração (24h) e endpoint `GET /auth/verify/:token` | BE | 2h |
| T-01.1.5 | Criar tela de cadastro com campo de e-mail e feedback de domínio inválido | FE | 4h |
| T-01.1.6 | Criar tela de "Confirme seu e-mail" pós-cadastro | FE | 2h |
| T-01.1.7 | Criar tela de confirmação bem-sucedida / token expirado | FE | 2h |
| T-01.1.8 | Escrever casos de teste: e-mail válido, inválido, token expirado, reenvio | QA | 3h |

---

### US-01.2 — Login e gerenciamento de sessão

**Como** usuário cadastrado e verificado,  
**quero** fazer login com e-mail e senha,  
**para** acessar a plataforma de forma segura.

**Critérios de Aceite:**
- [ ] Login retorna JWT com expiração adequada
- [ ] Usuário não verificado não consegue logar (mensagem específica)
- [ ] Logout invalida o token no lado do cliente
- [ ] Sessão expira após inatividade configurável

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-01.2.1 | Criar endpoint `POST /auth/login` com retorno de JWT | BE | 2h |
| T-01.2.2 | Implementar middleware de autenticação para rotas protegidas | BE | 2h |
| T-01.2.3 | Criar tela de login com campos e-mail/senha e link "Esqueci a senha" | FE | 3h |
| T-01.2.4 | Implementar fluxo de logout e limpeza de token no localStorage/cookie | FE | 1h |
| T-01.2.5 | Testar: login correto, senha errada, e-mail não verificado, token expirado | QA | 2h |

---

### US-01.3 — Recuperação de senha

**Como** usuário,  
**quero** recuperar minha senha via e-mail,  
**para** não perder o acesso à conta.

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-01.3.1 | Criar endpoint `POST /auth/forgot-password` que envia link de reset | BE | 2h |
| T-01.3.2 | Criar endpoint `POST /auth/reset-password/:token` | BE | 2h |
| T-01.3.3 | Criar tela de "Esqueci a senha" e tela de redefinição de senha | FE | 3h |
| T-01.3.4 | Testar fluxo completo de reset, token expirado e reutilização de token | QA | 2h |

---

## EP-02 — Feed e Gerenciamento de Propostas

> **Objetivo:** Permitir que usuários criem, votem e comentem propostas/demandas, seguindo o modelo 3C de Colaboração descrito no roteiro.

### US-02.1 — Criar proposta/post

**Como** usuário autenticado,  
**quero** criar uma nova proposta com título, descrição e categoria,  
**para** relatar um problema ou sugestão à comunidade e à gestão.

**Critérios de Aceite:**
- [ ] Formulário com título (max 100 chars), descrição (max 1000 chars) e categoria obrigatórios
- [ ] Post salvo com status inicial `pendente`
- [ ] Post aparece imediatamente no feed do autor; para outros após moderação (se admin configurar)
- [ ] Histórico de criação é registrado (memória do sistema — requisito do roteiro)

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-02.1.1 | Criar modelo `Proposal` com campos: título, descrição, categoria, status, autor, timestamps | BE | 2h |
| T-02.1.2 | Criar endpoint `POST /proposals` com validação de campos | BE | 2h |
| T-02.1.3 | Criar endpoint `GET /proposals` com paginação e filtro por status/categoria | BE | 3h |
| T-02.1.4 | Criar componente modal/tela de nova proposta com contador de caracteres | FE | 4h |
| T-02.1.5 | Exibir post no feed imediatamente após criação (otimistic UI) | FE | 2h |
| T-02.1.6 | Testar criação com dados válidos, campos faltando e limite de caracteres | QA | 2h |

---

### US-02.2 — Votar em uma proposta

**Como** usuário autenticado,  
**quero** votar em propostas (apoiar ou discordar),  
**para** demonstrar o nível de apoio da comunidade a cada demanda.

**Critérios de Aceite:**
- [ ] Cada usuário pode dar apenas 1 voto por proposta
- [ ] Botão de voto mostra contagem em tempo real
- [ ] É possível remover o voto (toggle)
- [ ] Votos são usados no cálculo do ranking de engajamento (EP-04)

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-02.2.1 | Criar modelo `Vote` com relação usuário ↔ proposta (unique constraint) | BE | 1h |
| T-02.2.2 | Criar endpoint `POST /proposals/:id/vote` e `DELETE /proposals/:id/vote` | BE | 2h |
| T-02.2.3 | Retornar contagem de votos na listagem e detalhe da proposta | BE | 1h |
| T-02.2.4 | Implementar botão de voto com feedback visual e atualização de contagem | FE | 3h |
| T-02.2.5 | Testar: votar, revogar, votar duas vezes, votar sem autenticação | QA | 2h |

---

### US-02.3 — Comentar em uma proposta

**Como** usuário autenticado,  
**quero** comentar em propostas,  
**para** me comunicar com outros membros sobre o problema relatado.

**Critérios de Aceite:**
- [ ] Comentários exibidos em ordem cronológica
- [ ] Contador de comentários visível no card do feed
- [ ] Comentários fazem parte do cálculo de engajamento

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-02.3.1 | Criar modelo `Comment` vinculado a proposta e usuário | BE | 1h |
| T-02.3.2 | Criar endpoints `POST /proposals/:id/comments` e `GET /proposals/:id/comments` | BE | 2h |
| T-02.3.3 | Criar componente de seção de comentários na tela de detalhe da proposta | FE | 4h |
| T-02.3.4 | Exibir contagem de comentários no card do feed | FE | 1h |
| T-02.3.5 | Testar: comentar, listar, comentário vazio, sem autenticação | QA | 2h |

---

### US-02.4 — Indicação de usuários online/offline

**Como** usuário,  
**quero** ver quem está online na plataforma,  
**para** saber se minha proposta está sendo visualizada em tempo real.  
*(Funcionalidade de percepção — requisito do roteiro)*

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-02.4.1 | Implementar presença de usuários via WebSocket ou polling periódico | BE | 4h |
| T-02.4.2 | Exibir indicador de status (ponto verde/cinza) no avatar do usuário | FE | 2h |
| T-02.4.3 | Testar status ao abrir/fechar aba, timeout de inatividade | QA | 2h |

---

## EP-03 — Página de Demandas em Andamento

> **Objetivo:** Criar uma página dedicada para exibir propostas que foram aceitas pela gestão e estão sendo trabalhadas, com indicação de status de progresso.  
> *(Funcionalidade: "Indicação de status das tarefas — pendente, em andamento ou concluída" — requisito do roteiro)*

### US-03.1 — Visualizar demandas em andamento

**Como** membro da comunidade,  
**quero** acessar uma página com todas as propostas que estão sendo resolvidas,  
**para** acompanhar o progresso das demandas e ter transparência sobre as ações da gestão.

**Critérios de Aceite:**
- [ ] Página acessível via menu de navegação principal (ex: aba "Em Andamento")
- [ ] Exibe apenas propostas com status `em_andamento`
- [ ] Cada card mostra: título, descrição resumida, responsável (admin/gestor), data de início, última atualização
- [ ] Badge de status colorido: 🟡 Em andamento / ✅ Concluída
- [ ] Filtro por categoria disponível

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-03.1.1 | Adicionar campo `status` ao modelo `Proposal` com enum: `pendente`, `em_andamento`, `concluida` | BE | 1h |
| T-03.1.2 | Criar endpoint `GET /proposals?status=em_andamento` (ou rota dedicada `/proposals/in-progress`) | BE | 2h |
| T-03.1.3 | Adicionar campo `responsible_note` (texto livre do admin sobre o andamento) | BE | 1h |
| T-03.1.4 | Criar página `/em-andamento` com listagem de cards e filtro por categoria | FE | 5h |
| T-03.1.5 | Criar componente de card de demanda em andamento com badge de status | FE | 3h |
| T-03.1.6 | Adicionar link/aba "Em Andamento" na barra de navegação | FE | 1h |
| T-03.1.7 | Testar: listagem, filtros, página vazia, transição de status | QA | 3h |

---

### US-03.2 — Acompanhar histórico de atualizações de uma demanda

**Como** autor ou apoiador de uma proposta,  
**quero** ver o histórico de atualizações de status de uma demanda,  
**para** entender o que foi feito e quando.  
*(Funcionalidade de Memória — requisito do roteiro)*

**Critérios de Aceite:**
- [ ] Linha do tempo com mudanças de status e notas do responsável
- [ ] Data e autor de cada atualização registrados

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-03.2.1 | Criar modelo `ProposalStatusHistory` registrando cada mudança de status | BE | 2h |
| T-03.2.2 | Criar endpoint `GET /proposals/:id/history` | BE | 2h |
| T-03.2.3 | Criar componente de linha do tempo (timeline) na tela de detalhe da proposta | FE | 4h |
| T-03.2.4 | Testar: múltiplas transições de status, ordenação cronológica | QA | 2h |

---

### US-03.3 — Notificações de atualização de status

**Como** autor ou apoiador de uma proposta,  
**quero** ser notificado quando o status da minha proposta mudar,  
**para** não precisar ficar verificando manualmente.  
*(Alertas de atualização em tempo real — requisito do roteiro)*

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-03.3.1 | Criar sistema de notificações in-app (modelo `Notification` no banco) | BE | 3h |
| T-03.3.2 | Disparar notificação ao author + usuários que votaram na proposta ao mudar status | BE | 2h |
| T-03.3.3 | Criar ícone de sino com badge de contagem de notificações não lidas | FE | 3h |
| T-03.3.4 | Criar dropdown/painel de notificações com link para a proposta | FE | 3h |
| T-03.3.5 | Testar: receber notificação, marcar como lida, sem notificações | QA | 2h |

---

## EP-04 — Ranking de Engajamento

> **Objetivo:** Exibir um ranking das propostas mais engajadas (votos + comentários), para priorizar as demandas com maior apelo da comunidade e dar transparência.  
> *(Transparência — requisito do roteiro: "propostas e resultados com mais engajamento podem ser consultados diretamente")*

### US-04.1 — Visualizar ranking de engajamento

**Como** qualquer usuário,  
**quero** acessar um ranking com as propostas mais votadas e comentadas,  
**para** identificar quais problemas têm maior relevância para a comunidade.

**Critérios de Aceite:**
- [ ] Página/aba "Ranking" acessível pelo menu principal
- [ ] Lista ordenada por score de engajamento (votos × peso_voto + comentários × peso_comentário)
- [ ] Exibe posição (#1, #2…), título, categoria, contagem de votos, contagem de comentários e score
- [ ] Filtro por categoria e por período (última semana, mês, todo período)
- [ ] Indicador visual de tendência (subindo, estável, descendo) baseado em variação recente

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-04.1.1 | Criar endpoint `GET /proposals/ranking` com ordenação por score calculado | BE | 3h |
| T-04.1.2 | Implementar score: `score = (votos * 2) + (comentários * 1)` (pesos configuráveis) | BE | 2h |
| T-04.1.3 | Adicionar filtros de categoria e período ao endpoint de ranking | BE | 2h |
| T-04.1.4 | Calcular variação de posição no ranking em relação ao período anterior | BE | 2h |
| T-04.1.5 | Criar página `/ranking` com tabela/lista ordenada e badges de posição | FE | 5h |
| T-04.1.6 | Implementar filtros de categoria e período no frontend | FE | 3h |
| T-04.1.7 | Adicionar ícones de tendência (↑ ↓ —) nos cards do ranking | FE | 2h |
| T-04.1.8 | Testar: ordenação correta, filtros, empate de score, lista vazia | QA | 3h |

---

### US-04.2 — Destaque de proposta no feed

**Como** usuário navegando pelo feed,  
**quero** ver um destaque visual nas propostas mais engajadas,  
**para** identificar rapidamente os tópicos mais relevantes da comunidade.

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-04.2.1 | Adicionar campo `is_trending` calculado na API (top 3 do ranking da semana) | BE | 2h |
| T-04.2.2 | Exibir badge "🔥 Em alta" nos cards do feed para propostas trending | FE | 2h |
| T-04.2.3 | Testar: badge aparece/desaparece conforme score, no máximo 3 destaques simultâneos | QA | 1h |

---

## EP-05 — Painel Administrativo

> **Objetivo:** Dar à gestão (PROAD) e moderadores uma interface para gerenciar usuários, moderar propostas, atualizar status e configurar a plataforma.

### US-05.1 — Controle de acesso administrativo (Roles)

**Como** administrador do sistema,  
**quero** ter um perfil com permissões elevadas,  
**para** gerenciar a plataforma sem depender de acesso direto ao banco de dados.

**Critérios de Aceite:**
- [ ] Roles disponíveis: `usuario`, `moderador`, `admin`
- [ ] Apenas `admin` pode promover/rebaixar outros usuários
- [ ] Rotas do painel admin bloqueadas para roles sem permissão (HTTP 403)
- [ ] Primeiro admin criado via script de seed ou variável de ambiente

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-05.1.1 | Adicionar campo `role` ao modelo `User` com enum de permissões | BE | 1h |
| T-05.1.2 | Criar middleware `requireRole(['admin', 'moderador'])` para rotas protegidas | BE | 2h |
| T-05.1.3 | Criar endpoint `PATCH /admin/users/:id/role` para alteração de role | BE | 1h |
| T-05.1.4 | Criar script de seed para criação do admin inicial | BE | 1h |
| T-05.1.5 | Criar guard de rota no frontend para redirecionar não-admins | FE | 2h |
| T-05.1.6 | Testar: acesso negado para usuário comum, acesso correto para admin/moderador | QA | 2h |

---

### US-05.2 — Gerenciamento de usuários

**Como** administrador,  
**quero** visualizar, buscar, suspender e excluir usuários,  
**para** manter a integridade da comunidade na plataforma.

**Critérios de Aceite:**
- [ ] Tabela com todos os usuários: nome, e-mail, role, data de cadastro, status (ativo/suspenso)
- [ ] Ações disponíveis: suspender, reativar, excluir, promover a moderador
- [ ] Busca por nome ou e-mail
- [ ] Usuário suspenso não consegue logar (mensagem específica)

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-05.2.1 | Criar endpoints `GET /admin/users`, `PATCH /admin/users/:id` (suspend/activate/delete) | BE | 3h |
| T-05.2.2 | Bloquear login de usuários com status `suspenso` | BE | 1h |
| T-05.2.3 | Criar página `/admin/usuarios` com tabela, busca e ações | FE | 5h |
| T-05.2.4 | Implementar modais de confirmação para ações destrutivas (suspender, excluir) | FE | 2h |
| T-05.2.5 | Testar: suspender usuário logado, reativar, busca, paginação | QA | 3h |

---

### US-05.3 — Moderação de propostas

**Como** moderador ou administrador,  
**quero** revisar propostas enviadas e aprovar, rejeitar ou alterar seu status,  
**para** garantir que apenas conteúdo adequado e organizado apareça na plataforma.

**Critérios de Aceite:**
- [ ] Fila de propostas pendentes de moderação
- [ ] Ações: aprovar (publicar), rejeitar (com motivo), mover para "em andamento", marcar como concluída
- [ ] Autor notificado por e-mail e notificação in-app ao ter proposta aprovada ou rejeitada
- [ ] Histórico de moderação registrado

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-05.3.1 | Criar endpoint `GET /admin/proposals?status=pendente` | BE | 1h |
| T-05.3.2 | Criar endpoint `PATCH /admin/proposals/:id/status` com campo `reason` opcional | BE | 2h |
| T-05.3.3 | Enviar e-mail + notificação in-app ao autor na mudança de status | BE | 2h |
| T-05.3.4 | Criar página `/admin/propostas` com fila de moderação e ações inline | FE | 5h |
| T-05.3.5 | Criar formulário de rejeição com campo de motivo obrigatório | FE | 2h |
| T-05.3.6 | Testar: aprovar, rejeitar sem motivo (deve falhar), transições de status inválidas | QA | 3h |

---

### US-05.4 — Configurações da plataforma

**Como** administrador,  
**quero** configurar domínios de e-mail permitidos e pesos do ranking,  
**para** adaptar a plataforma sem precisar de deploy.

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-05.4.1 | Criar modelo `AppConfig` com chave-valor para configurações dinâmicas | BE | 2h |
| T-05.4.2 | Criar endpoints `GET /admin/config` e `PATCH /admin/config` | BE | 2h |
| T-05.4.3 | Criar página `/admin/configuracoes` com formulário de configurações | FE | 4h |
| T-05.4.4 | Testar: alterar domínio permitido e verificar impacto no cadastro | QA | 2h |

---

## EP-06 — Infraestrutura e CI/CD

> **Responsável principal:** Victor Ryan Vieira (DevOps)

### US-06.1 — Containerização da aplicação

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-06.1.1 | Criar `Dockerfile` para o backend (Node/Express ou framework usado) | OPS | 3h |
| T-06.1.2 | Criar `Dockerfile` para o frontend | OPS | 2h |
| T-06.1.3 | Criar `docker-compose.yml` com backend, frontend e banco de dados | OPS | 3h |
| T-06.1.4 | Configurar variáveis de ambiente via `.env.example` documentado | OPS | 1h |
| T-06.1.5 | Testar build e subida dos containers localmente | QA + OPS | 2h |

---

### US-06.2 — Pipeline de CI/CD

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-06.2.1 | Criar workflow GitHub Actions para rodar testes automatizados em cada PR | OPS | 3h |
| T-06.2.2 | Adicionar step de lint (ESLint/Prettier) no pipeline | OPS | 1h |
| T-06.2.3 | Configurar deploy automático no merge para branch `main` (ex: Railway, Render, VPS) | OPS | 4h |
| T-06.2.4 | Configurar ambiente de staging separado do produção | OPS | 3h |
| T-06.2.5 | Validar pipeline: PR com teste falhando deve bloquear merge | QA | 1h |

---

### US-06.3 — Banco de dados e migrations

| # | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-06.3.1 | Configurar migrations automáticas no startup da aplicação | OPS + BE | 2h |
| T-06.3.2 | Criar seed de dados de desenvolvimento (usuários, propostas de exemplo) | BE | 2h |
| T-06.3.3 | Configurar backup automático do banco em produção | OPS | 2h |

---

## EP-07 — QA e Qualidade

> **Responsável:** Murilo Santiago Escobedo  
> Tasks executadas em paralelo com o desenvolvimento de cada épico.

### US-07.1 — Testes de regressão do fluxo principal

| # | Tarefa | Estimativa |
|---|---|---|
| T-07.1.1 | Mapear fluxo crítico: cadastro → verificação → login → criar proposta → votar → comentar | 2h |
| T-07.1.2 | Criar checklist de smoke test para cada deploy em staging | 2h |
| T-07.1.3 | Executar smoke test após cada release do backend e frontend | Contínuo |

---

### US-07.2 — Testes de segurança e permissões

| # | Tarefa | Estimativa |
|---|---|---|
| T-07.2.1 | Testar acesso a rotas admin com token de usuário comum (deve retornar 403) | 3h |
| T-07.2.2 | Testar cadastro com e-mails de domínios externos (deve ser bloqueado) | 1h |
| T-07.2.3 | Testar injeção de dados nos campos de proposta e comentário | 2h |
| T-07.2.4 | Verificar que tokens JWT expirados não concedem acesso | 1h |

---

### US-07.3 — Testes de usabilidade e responsividade

| # | Tarefa | Estimativa |
|---|---|---|
| T-07.3.1 | Verificar responsividade das páginas principais em mobile (375px) e tablet (768px) | 3h |
| T-07.3.2 | Testar fluxos com conexão lenta (DevTools throttle) — verificar loading states | 2h |
| T-07.3.3 | Revisar mensagens de erro e feedback visual em todos os formulários | 2h |

---

### US-07.4 — Gestão de bugs

| # | Tarefa | Estimativa |
|---|---|---|
| T-07.4.1 | Criar template de bug report no repositório GitHub (`.github/ISSUE_TEMPLATE`) | 1h |
| T-07.4.2 | Catalogar bugs encontrados em issues do GitHub com labels: `bug`, `prioridade-alta`, `prioridade-baixa` | Contínuo |
| T-07.4.3 | Realizar sessão de bug bash ao final de cada sprint | 2h/sprint |

---

## 📊 Resumo de Estimativas por Papel

| Papel | Total Estimado |
|---|---|
| Backend (Gabriel) | ~75h |
| Frontend (Humberto + Pávila) | ~80h |
| DevOps (Victor) | ~25h |
| QA (Murilo) | ~45h |

---

## 🏷️ Definição de Pronto (DoD)

Uma tarefa é considerada **pronta** quando:

1. ✅ Código implementado e funcionando localmente
2. ✅ Pull Request aberto com descrição clara
3. ✅ Revisão de código aprovada por ao menos 1 membro do time
4. ✅ Casos de teste QA executados e aprovados
5. ✅ Pipeline de CI passando (sem erros de lint ou testes)
6. ✅ Funcionalidade verificada em ambiente de staging

---

## 🔀 Sugestão de Fluxo de Branches

```
main              ← produção (protegida, apenas merge via PR)
└── staging       ← ambiente de testes integrado
    ├── feat/EP01-cadastro-email-institucional
    ├── feat/EP03-pagina-demandas-andamento
    ├── feat/EP04-ranking-engajamento
    └── feat/EP05-painel-admin
```

---

*Backlog gerado com base no roteiro da Atividade 02 — Sistema Colaborativo com Apoio à Democracia Eletrônica — UFVJM.*
