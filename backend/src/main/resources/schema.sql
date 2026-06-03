-- Migração idempotente para herança SINGLE_TABLE (banco já existente sem dtype)
ALTER TABLE users ADD COLUMN IF NOT EXISTS dtype VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS student_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS course VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS university_name VARCHAR(255);

UPDATE users SET dtype = 'USER' WHERE dtype IS NULL;

ALTER TABLE users ALTER COLUMN dtype SET NOT NULL;

-- Adiciona coluna status na tabela posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'PENDENTE';

-- Migração para suportar upload de arquivos em multipart/form-data
ALTER TABLE posts DROP COLUMN IF EXISTS image_url;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_data BYTEA;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_file_name VARCHAR(100);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_content_type VARCHAR(50);
