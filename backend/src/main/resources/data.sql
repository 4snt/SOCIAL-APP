-- =============================================================
--  SEED — dados de exemplo para o feed público
--  Idempotente: usa ON CONFLICT DO NOTHING.
-- =============================================================

-- ----------------------------- USERS -----------------------------
-- Senha de exemplo: 123 (BCrypt). dtype: USER | STUDENT | UNIVERSITY | ADMIN
INSERT INTO users (id, dtype, username, email, password, avatar_url, bio, student_name, course, university_name, admin_name) VALUES
(1, 'USER', 'gabriel',      'gabriel@email.com',  '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=gabriel',  'Curtindo a vida e tomando café ☕', NULL, NULL, NULL, NULL),
(2, 'USER', 'maria',        'maria@email.com',    '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',    'Fotógrafa amadora • SP', NULL, NULL, NULL, NULL),
(3, 'STUDENT', 'joao_fit',  'joao@email.com',     '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',     'Personal trainer 💪 | dieta + treino', 'João Silva', 'Educação Física', NULL, NULL),
(4, 'UNIVERSITY', 'lara.viagens', 'lara@email.com', '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lara', '✈️ 23 países e contando', NULL, NULL, 'USP', NULL),
(5, 'USER', 'chef_pedro',   'pedro@email.com',    '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',    'Chef de cozinha 🍝 receitas simples', NULL, NULL, NULL, NULL),
(6, 'USER', 'ana_arte',     'ana@email.com',      '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',      'Ilustradora • aceito comissões', NULL, NULL, NULL, NULL),
(7, 'USER', 'ricardo_dev',  'ricardo@email.com',  '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ricardo',  'Dev fullstack • Java + React', NULL, NULL, NULL, NULL),
(8, 'USER', 'julia_pets',   'julia@email.com',    '$2a$10$o2432sPXEdwNyDgoc7TxLeiXPuD.5J81aqgYsUAZOLbwWdcUdtAcu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=julia',    'Mãe de 3 cachorros 🐶', NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
    dtype           = EXCLUDED.dtype,
    username        = EXCLUDED.username,
    password        = EXCLUDED.password,
    avatar_url      = EXCLUDED.avatar_url,
    bio             = EXCLUDED.bio,
    student_name    = EXCLUDED.student_name,
    course          = EXCLUDED.course,
    university_name = EXCLUDED.university_name,
    admin_name      = EXCLUDED.admin_name;

-- ----------------------------- POSTS -----------------------------
INSERT INTO posts (id, user_id, image_url, description, created_at) VALUES
(1,  4, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', 'Praia perfeita pra começar o dia 🌊', NOW() - INTERVAL '2 hours'),
(2,  5, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', 'Pizza de massa fina, do jeito que a vovó fazia 🍕', NOW() - INTERVAL '5 hours'),
(3,  3, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', 'Treino de pernas finalizado! Vamos com tudo essa semana 💪', NOW() - INTERVAL '8 hours'),
(4,  6, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80', 'Trabalho novo saindo do forno! O que acharam?', NOW() - INTERVAL '12 hours'),
(5,  2, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80', 'Pôr do sol ontem na rooftop ✨', NOW() - INTERVAL '14 hours'),
(6,  7, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', 'Setup novo pronto pra produzir 💻', NOW() - INTERVAL '20 hours'),
(7,  8, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80', 'Apresento o Thor, mais novo da casa 🐕', NOW() - INTERVAL '1 day'),
(8,  4, 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80', 'Próxima parada: Tóquio 🇯🇵 alguma recomendação?', NOW() - INTERVAL '1 day 4 hours'),
(9,  1, 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80', 'Café da manhã preguiçoso de domingo ☕', NOW() - INTERVAL '1 day 8 hours'),
(10, 5, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', 'Bowl colorido e nutritivo pra fechar a semana 🥗', NOW() - INTERVAL '1 day 14 hours'),
(11, 6, 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&w=800&q=80', 'Estudo de cores que virou quadro 🎨', NOW() - INTERVAL '2 days'),
(12, 3, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', 'Corrida de 10k antes do trabalho 🏃‍♂️', NOW() - INTERVAL '2 days 6 hours'),
(13, 7, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80', 'Aprendendo Spring Boot do zero — qualquer dica é bem-vinda!', NOW() - INTERVAL '2 days 10 hours'),
(14, 8, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80', 'A Mel dormindo, momento mais fofo do dia 💕', NOW() - INTERVAL '2 days 15 hours'),
(15, 2, 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80', 'Trilha hoje rendeu essa foto aqui', NOW() - INTERVAL '3 days'),
(16, 4, 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80', 'Mochilão pelo sul do Chile 🏔️', NOW() - INTERVAL '3 days 5 hours'),
(17, 1, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', 'Domingão de série e pipoca 🍿', NOW() - INTERVAL '3 days 12 hours'),
(18, 5, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80', 'Brigadeiro caseiro, receita da minha mãe', NOW() - INTERVAL '4 days'),
(19, 6, 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=800&q=80', 'Sketch da semana — practice makes perfect ✏️', NOW() - INTERVAL '4 days 8 hours'),
(20, 7, 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80', 'Refatorando código antigo, sensação ótima ✨', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------- COMMENTS -----------------------------
INSERT INTO comments (id, user_id, post_id, content, created_at) VALUES
(1,  2, 1, 'Que vista incrível! 😍',                                NOW() - INTERVAL '1 hour'),
(2,  5, 1, 'Quero ir tbm!!',                                        NOW() - INTERVAL '50 minutes'),
(3,  3, 1, 'Onde fica essa praia?',                                 NOW() - INTERVAL '30 minutes'),
(4,  1, 2, 'Tô com fome só de ver',                                 NOW() - INTERVAL '4 hours'),
(5,  6, 2, 'Receita?? 🙏',                                          NOW() - INTERVAL '3 hours'),
(6,  8, 2, 'Massa parece perfeita!',                                NOW() - INTERVAL '2 hours'),
(7,  3, 2, 'Tem versão fit dessa? hahaha',                          NOW() - INTERVAL '1 hour 30 minutes'),
(8,  4, 3, 'Inspiração! Voltei a treinar essa semana 🔥',           NOW() - INTERVAL '7 hours'),
(9,  7, 3, 'Quantos kg de leg press?',                              NOW() - INTERVAL '6 hours'),
(10, 1, 4, 'O traço tá lindo',                                      NOW() - INTERVAL '11 hours'),
(11, 5, 4, 'Vendi minha vovó pra comprar isso',                     NOW() - INTERVAL '10 hours'),
(12, 8, 4, 'Aceita encomenda?',                                     NOW() - INTERVAL '9 hours'),
(13, 4, 5, 'Que céu lindo ✨',                                      NOW() - INTERVAL '13 hours'),
(14, 6, 5, 'Foto digna de papel de parede',                         NOW() - INTERVAL '12 hours'),
(15, 1, 5, 'Onde foi isso?',                                        NOW() - INTERVAL '11 hours'),
(16, 8, 6, 'Setup limpinho! Qual monitor?',                         NOW() - INTERVAL '19 hours'),
(17, 2, 6, 'Adorei a iluminação',                                   NOW() - INTERVAL '18 hours'),
(18, 3, 7, 'AAAAA que fofo!!!',                                     NOW() - INTERVAL '23 hours'),
(19, 5, 7, 'Quero pegar no colo 🥺',                                NOW() - INTERVAL '22 hours'),
(20, 6, 7, 'Olhinhos derretendo',                                   NOW() - INTERVAL '20 hours'),
(21, 1, 7, 'Que raça?',                                             NOW() - INTERVAL '19 hours'),
(22, 5, 8, 'Shibuya é obrigatório!',                                NOW() - INTERVAL '1 day 3 hours'),
(23, 7, 8, 'Tem que ir no Akihabara',                               NOW() - INTERVAL '1 day 2 hours'),
(24, 2, 8, 'Inveja boa 😄',                                         NOW() - INTERVAL '1 day 1 hour'),
(25, 4, 9, 'Esse pão tá clamando por mim',                          NOW() - INTERVAL '1 day 7 hours'),
(26, 6, 9, 'Domingo é pra isso',                                    NOW() - INTERVAL '1 day 6 hours'),
(27, 3, 10, 'Tô precisando dessa pegada saudável',                  NOW() - INTERVAL '1 day 13 hours'),
(28, 8, 10, 'Bowl lindão demais',                                   NOW() - INTERVAL '1 day 12 hours'),
(29, 7, 11, 'Combinação de cores top',                              NOW() - INTERVAL '1 day 22 hours'),
(30, 1, 11, 'Vende esse quadro?',                                   NOW() - INTERVAL '1 day 20 hours'),
(31, 4, 11, 'Lindíssimo',                                           NOW() - INTERVAL '1 day 18 hours'),
(32, 5, 12, 'Disposição inspiradora!',                              NOW() - INTERVAL '2 days 5 hours'),
(33, 8, 12, 'Eu mal levanto da cama 😅',                            NOW() - INTERVAL '2 days 4 hours'),
(34, 1, 13, 'Spring é tranquilo, segue a docs oficial',             NOW() - INTERVAL '2 days 9 hours'),
(35, 3, 13, 'Tenho uns vídeos pra te indicar',                      NOW() - INTERVAL '2 days 8 hours'),
(36, 6, 13, 'Boa! Tô estudando junto',                              NOW() - INTERVAL '2 days 7 hours'),
(37, 4, 14, 'Que sonequinha 💕',                                    NOW() - INTERVAL '2 days 14 hours'),
(38, 5, 14, 'Eu não aguento, é fofura demais',                      NOW() - INTERVAL '2 days 13 hours'),
(39, 7, 15, 'Foto top',                                             NOW() - INTERVAL '2 days 22 hours'),
(40, 3, 15, 'Qual trilha?',                                         NOW() - INTERVAL '2 days 21 hours'),
(41, 1, 15, 'Lugar lindo',                                          NOW() - INTERVAL '2 days 20 hours'),
(42, 6, 16, 'Sonho de viagem',                                      NOW() - INTERVAL '3 days 4 hours'),
(43, 8, 16, 'Conta tudo depois',                                    NOW() - INTERVAL '3 days 3 hours'),
(44, 2, 17, 'Qual a série?',                                        NOW() - INTERVAL '3 days 11 hours'),
(45, 3, 17, 'Domingão perfeito',                                    NOW() - INTERVAL '3 days 10 hours'),
(46, 1, 18, 'Brigadeiro de mãe é o melhor',                         NOW() - INTERVAL '3 days 23 hours'),
(47, 4, 18, 'Quero a receita!!',                                    NOW() - INTERVAL '3 days 22 hours'),
(48, 8, 18, 'Tô babando aqui',                                      NOW() - INTERVAL '3 days 20 hours'),
(49, 2, 19, 'Cada vez melhor',                                      NOW() - INTERVAL '4 days 7 hours'),
(50, 7, 19, 'Traço evoluindo bastante',                             NOW() - INTERVAL '4 days 6 hours'),
(51, 1, 20, 'Sensação de código limpo não tem preço',               NOW() - INTERVAL '4 days 23 hours'),
(52, 3, 20, 'Concordo demais 😄',                                   NOW() - INTERVAL '4 days 22 hours'),
(53, 6, 20, 'Refatorar é terapia',                                  NOW() - INTERVAL '4 days 20 hours'),
(54, 4, 1, 'Saudade do mar...',                                     NOW() - INTERVAL '20 minutes'),
(55, 7, 2, 'Massa fina é sempre top',                               NOW() - INTERVAL '50 minutes'),
(56, 2, 3, 'Bora junto na próxima',                                 NOW() - INTERVAL '5 hours'),
(57, 5, 6, 'Combina muito com você',                                NOW() - INTERVAL '17 hours'),
(58, 4, 7, 'Apaixonada 🥺',                                         NOW() - INTERVAL '18 hours'),
(59, 8, 13, 'Dica: comece pelo Maven mesmo',                        NOW() - INTERVAL '2 days 6 hours'),
(60, 6, 17, 'Recomendo Severance',                                  NOW() - INTERVAL '3 days 9 hours')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------- LIKES -----------------------------
INSERT INTO likes (user_id, post_id, created_at) VALUES
-- post 1 (praia) — viral
(1, 1, NOW()), (2, 1, NOW()), (3, 1, NOW()), (5, 1, NOW()), (6, 1, NOW()), (7, 1, NOW()), (8, 1, NOW()),
-- post 2 (pizza)
(1, 2, NOW()), (3, 2, NOW()), (4, 2, NOW()), (6, 2, NOW()), (7, 2, NOW()), (8, 2, NOW()),
-- post 3 (treino)
(1, 3, NOW()), (2, 3, NOW()), (4, 3, NOW()), (5, 3, NOW()), (7, 3, NOW()),
-- post 4 (arte) — viral
(1, 4, NOW()), (2, 4, NOW()), (3, 4, NOW()), (4, 4, NOW()), (5, 4, NOW()), (7, 4, NOW()), (8, 4, NOW()),
-- post 5 (pôr do sol)
(1, 5, NOW()), (3, 5, NOW()), (4, 5, NOW()), (6, 5, NOW()), (8, 5, NOW()),
-- post 6 (setup)
(2, 6, NOW()), (3, 6, NOW()), (4, 6, NOW()), (8, 6, NOW()),
-- post 7 (cachorro) — viral
(1, 7, NOW()), (2, 7, NOW()), (3, 7, NOW()), (4, 7, NOW()), (5, 7, NOW()), (6, 7, NOW()), (7, 7, NOW()),
-- post 8 (Tóquio)
(1, 8, NOW()), (2, 8, NOW()), (5, 8, NOW()), (7, 8, NOW()),
-- post 9 (café da manhã)
(2, 9, NOW()), (4, 9, NOW()), (6, 9, NOW()), (8, 9, NOW()),
-- post 10 (bowl)
(2, 10, NOW()), (3, 10, NOW()), (8, 10, NOW()),
-- post 11 (cores)
(1, 11, NOW()), (4, 11, NOW()), (5, 11, NOW()), (7, 11, NOW()), (8, 11, NOW()),
-- post 12 (corrida)
(1, 12, NOW()), (4, 12, NOW()), (5, 12, NOW()),
-- post 13 (spring)
(1, 13, NOW()), (3, 13, NOW()), (6, 13, NOW()), (8, 13, NOW()),
-- post 14 (cachorra fofa) — viral
(1, 14, NOW()), (2, 14, NOW()), (3, 14, NOW()), (4, 14, NOW()), (5, 14, NOW()), (6, 14, NOW()), (7, 14, NOW()),
-- post 15 (trilha)
(1, 15, NOW()), (3, 15, NOW()), (4, 15, NOW()), (7, 15, NOW()),
-- post 16 (mochilão)
(1, 16, NOW()), (2, 16, NOW()), (6, 16, NOW()), (8, 16, NOW()),
-- post 17 (série)
(2, 17, NOW()), (3, 17, NOW()), (6, 17, NOW()),
-- post 18 (brigadeiro)
(1, 18, NOW()), (2, 18, NOW()), (3, 18, NOW()), (4, 18, NOW()), (8, 18, NOW()),
-- post 19 (sketch)
(2, 19, NOW()), (4, 19, NOW()), (7, 19, NOW()),
-- post 20 (refactor)
(1, 20, NOW()), (3, 20, NOW()), (6, 20, NOW())
ON CONFLICT DO NOTHING;

-- ----------------------------- SEQUENCES -----------------------------
SELECT setval('users_id_seq',     (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('posts_id_seq',     (SELECT COALESCE(MAX(id), 1) FROM posts));
SELECT setval('comments_id_seq',  (SELECT COALESCE(MAX(id), 1) FROM comments));
SELECT setval('likes_id_seq',     (SELECT COALESCE(MAX(id), 1) FROM likes));
