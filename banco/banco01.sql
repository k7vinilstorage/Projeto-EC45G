-- PostgreSQL conversion of MySQL schema 'certificadora'

-- Criação do schema (namespace)
CREATE SCHEMA IF NOT EXISTS certificadora;

-- Trocando de schema para usar "certificadora"
SET search_path TO certificadora;

-- Tabela input_sanitalPad
CREATE TABLE IF NOT EXISTS input_sanitalPad (
  doa_id SERIAL PRIMARY KEY,
  doa_donorName VARCHAR(100),
  doa_mark VARCHAR(100),
  doa_type VARCHAR(100),
  doa_hypoallergenic BOOLEAN,
  doa_flow VARCHAR(100),
  doa_indication VARCHAR(100),
  doa_amount INTEGER,
  doa_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela user
CREATE TABLE IF NOT EXISTS "user" (
  user_username VARCHAR(100) PRIMARY KEY,
  user_password VARCHAR(255),
  user_name VARCHAR(100),
  user_active BOOLEAN,
  user_permision BOOLEAN
);
