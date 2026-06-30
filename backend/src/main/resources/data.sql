-- =============================================================
--  SEED — dados de exemplo para o feed público
--  Idempotente: usa ON CONFLICT DO NOTHING.
-- =============================================================

-- ----------------------------- USERS -----------------------------
-- Senha de exemplo: 123 (BCrypt). dtype: USER | STUDENT | UNIVERSITY | ADMIN
INSERT INTO users (id, dtype, username, email, password, avatar_url, bio, student_name, course, university_name, admin_name, last_seen_at) VALUES
(1, 'ADMIN', 'gabriel',      'gabriel@email.com',  '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=gabriel',  'Curtindo a vida e tomando café ☕', NULL, NULL, NULL, NULL, NOW()),
(2, 'USER', 'maria',        'maria@email.com',    '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',    'Fotógrafa amadora • SP', NULL, NULL, NULL, NULL, NOW()),
(3, 'STUDENT', 'joao_fit',  'joao@email.com',     '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',     'Personal trainer 💪 | dieta + treino', 'João Silva', 'Educação Física', NULL, NULL, NOW()),
(4, 'UNIVERSITY', 'lara.viagens', 'lara@email.com', '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lara', '✈️ 23 países e contando', NULL, NULL, 'USP', NULL, NOW()),
(5, 'USER', 'chef_pedro',   'pedro@email.com',    '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',    'Chef de cozinha 🍝 receitas simples', NULL, NULL, NULL, NULL, NOW()),
(6, 'USER', 'ana_arte',     'ana@email.com',      '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',      'Ilustradora • aceito comissões', NULL, NULL, NULL, NULL, NOW()),
(7, 'USER', 'ricardo_dev',  'ricardo@email.com',  '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ricardo',  'Dev fullstack • Java + React', NULL, NULL, NULL, NULL, NOW()),
(8, 'USER', 'julia_pets',   'julia@email.com',    '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=julia',    'Mãe de 3 cachorros 🐶', NULL, NULL, NULL, NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    dtype           = EXCLUDED.dtype,
    username        = EXCLUDED.username,
    password        = EXCLUDED.password,
    avatar_url      = EXCLUDED.avatar_url,
    bio             = EXCLUDED.bio,
    student_name    = EXCLUDED.student_name,
    course          = EXCLUDED.course,
    university_name = EXCLUDED.university_name,
    admin_name      = EXCLUDED.admin_name,
    last_seen_at    = EXCLUDED.last_seen_at;

-- ----------------------------- POSTS -----------------------------
-- Seed idempotente orientado a demandas da universidade.
INSERT INTO posts (id, user_id, description, created_at, status) VALUES
(1,  3, 'Pedimos extensão do horário da biblioteca em semana de provas. Isso faz diferença real.', NOW() - INTERVAL '2 hours', 'CONCLUIDA'),
(2,  4, 'Sugestão para a Univoz: mais vagas no RU e opção de almoço em horários alternativos.', NOW() - INTERVAL '5 hours', 'CONCLUIDA'),
(3,  1, 'Faltam tomadas e internet estável nas salas de estudo. É prioridade para quem vive o campus.', NOW() - INTERVAL '8 hours', 'CONCLUIDA'),
(4,  2, 'Transporte entre o campus e o centro precisa ser mais frequente nos fins de tarde.', NOW() - INTERVAL '12 hours', 'CONCLUIDA'),
(5,  3, 'Solicitação de mais monitores nas disciplinas com maior reprovação ajuda muito na permanência.', NOW() - INTERVAL '14 hours', 'CONCLUIDA'),
(6,  4, 'Acessibilidade também é demanda: mais rampas, sinalização e salas adaptadas.', NOW() - INTERVAL '20 hours', 'CONCLUIDA'),
(7,  1, 'Áreas de convivência com sombra e assentos fazem diferença para estudar e integrar os alunos.', NOW() - INTERVAL '1 day', 'CONCLUIDA'),
(8,  2, 'Queremos canal direto para receber e acompanhar demandas estudantis com transparência.', NOW() - INTERVAL '1 day 4 hours', 'CONCLUIDA'),
(9,  3, 'Mais laboratórios abertos fora do horário de aula seria ótimo para projetos e TCC.', NOW() - INTERVAL '1 day 8 hours', 'CONCLUIDA'),
(10, 4, 'A Univoz existe para dar voz às demandas da universidade e transformar pauta em ação.', NOW() - INTERVAL '1 day 14 hours', 'CONCLUIDA')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------- COMMENTS -----------------------------
INSERT INTO comments (id, user_id, post_id, content, created_at) VALUES
(1,  2, 1, 'Extensão da biblioteca é prioridade total.',                    NOW() - INTERVAL '1 hour'),
(2,  4, 1, 'Apoio. Semana de prova sem horário ampliado é complicado.',     NOW() - INTERVAL '50 minutes'),
(3,  8, 1, 'Perfeito para permanência estudantil.',                         NOW() - INTERVAL '30 minutes'),
(4,  1, 2, 'RU cheio é problema diário, precisamos de resposta.',          NOW() - INTERVAL '4 hours'),
(5,  6, 2, 'Horários alternativos ajudariam muita gente.',                 NOW() - INTERVAL '3 hours'),
(6,  7, 3, 'Internet estável deveria ser básico em toda sala.',            NOW() - INTERVAL '2 hours'),
(7,  5, 3, 'Tomadas também, principalmente nas mesas de estudo.',          NOW() - INTERVAL '1 hour 30 minutes'),
(8,  4, 4, 'Transporte no fim do dia é urgente.',                           NOW() - INTERVAL '7 hours'),
(9,  2, 4, 'Muita gente perde aula por causa do deslocamento.',             NOW() - INTERVAL '6 hours'),
(10, 3, 5, 'Monitoria salva quem está com dificuldade.',                    NOW() - INTERVAL '11 hours'),
(11, 7, 5, 'Quero ver esse pedido chegar à coordenação.',                   NOW() - INTERVAL '10 hours'),
(12, 8, 6, 'Acessibilidade não é detalhe, é estrutura.',                    NOW() - INTERVAL '9 hours'),
(13, 1, 6, 'Precisamos mapear as salas sem adaptação.',                     NOW() - INTERVAL '8 hours'),
(14, 6, 7, 'Área de convivência melhora muito a experiência no campus.',    NOW() - INTERVAL '13 hours'),
(15, 5, 7, 'Sombra e banco parecem simples, mas fazem falta.',             NOW() - INTERVAL '12 hours'),
(16, 3, 8, 'Canal de acompanhamento precisa ser fácil de usar.',            NOW() - INTERVAL '11 hours'),
(17, 4, 8, 'Transparência no retorno das pautas é essencial.',              NOW() - INTERVAL '10 hours'),
(18, 2, 9, 'Laboratório aberto fora do horário seria um avanço enorme.',   NOW() - INTERVAL '19 hours'),
(19, 7, 9, 'Ajuda muito para quem trabalha de dia e estuda à noite.',        NOW() - INTERVAL '18 hours'),
(20, 1, 10, 'Esse é o propósito da Univoz mesmo: dar voz e virar ação.',   NOW() - INTERVAL '17 hours')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------- LIKES -----------------------------
INSERT INTO likes (user_id, post_id, created_at) VALUES
(1, 1, NOW()), (2, 1, NOW()), (4, 1, NOW()), (6, 1, NOW()),
(1, 2, NOW()), (3, 2, NOW()), (5, 2, NOW()), (8, 2, NOW()),
(2, 3, NOW()), (4, 3, NOW()), (7, 3, NOW()),
(1, 4, NOW()), (3, 4, NOW()), (6, 4, NOW()),
(2, 5, NOW()), (4, 5, NOW()), (8, 5, NOW()),
(1, 6, NOW()), (5, 6, NOW()), (7, 6, NOW()),
(2, 7, NOW()), (3, 7, NOW()), (6, 7, NOW()), (8, 7, NOW()),
(1, 8, NOW()), (4, 8, NOW()), (7, 8, NOW()),
(2, 9, NOW()), (5, 9, NOW()), (8, 9, NOW()),
(1, 10, NOW()), (3, 10, NOW()), (6, 10, NOW()), (8, 10, NOW())
ON CONFLICT DO NOTHING;

-- ----------------------------- SEQUENCES -----------------------------
SELECT setval('users_id_seq',     (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('posts_id_seq',     (SELECT COALESCE(MAX(id), 1) FROM posts));
SELECT setval('comments_id_seq',  (SELECT COALESCE(MAX(id), 1) FROM comments));
SELECT setval('likes_id_seq',     (SELECT COALESCE(MAX(id), 1) FROM likes));
