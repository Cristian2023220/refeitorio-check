-- Refeitório-Check - esquema inicial do banco de dados
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS alunos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matricula VARCHAR(20) UNIQUE NOT NULL,
  nome VARCHAR(150) NOT NULL,
  curso VARCHAR(150),
  telefone VARCHAR(20),
  foto_url TEXT,
  senha_hash TEXT NOT NULL,
  limite_mensal INT NOT NULL DEFAULT 30,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cartoes_rfid (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid VARCHAR(50) UNIQUE NOT NULL,
  aluno_id UUID UNIQUE REFERENCES alunos(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ativo', -- ativo | bloqueado
  vinculado_em TIMESTAMP
);

CREATE TABLE IF NOT EXISTS confirmacoes_presenca (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES alunos(id),
  data DATE NOT NULL,
  refeicao VARCHAR(20) NOT NULL DEFAULT 'almoco',
  confirmado_em TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (aluno_id, data, refeicao)
);

CREATE TABLE IF NOT EXISTS registros_acesso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES alunos(id),
  uid_lido VARCHAR(50) NOT NULL,
  lido_em TIMESTAMP NOT NULL DEFAULT now(),
  resultado VARCHAR(20) NOT NULL, -- liberado | negado
  motivo_negacao VARCHAR(50)      -- sem_confirmacao | sem_saldo | fora_horario | cartao_desconhecido
);

CREATE TABLE IF NOT EXISTS usuarios_admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  papel VARCHAR(20) NOT NULL DEFAULT 'operador' -- operador | gestor
);

CREATE TABLE IF NOT EXISTS configuracoes (
  chave VARCHAR(50) PRIMARY KEY,
  valor VARCHAR(50) NOT NULL
);

-- Índices que sustentam a checagem do totem em menos de 1s
CREATE INDEX IF NOT EXISTS idx_cartoes_uid ON cartoes_rfid (uid);
CREATE INDEX IF NOT EXISTS idx_confirmacoes_aluno_data ON confirmacoes_presenca (aluno_id, data);
CREATE INDEX IF NOT EXISTS idx_registros_aluno_lido_em ON registros_acesso (aluno_id, lido_em);

-- Configurações padrão
INSERT INTO configuracoes (chave, valor) VALUES
  ('hora_inicio_almoco', '11:30'),
  ('hora_fim_almoco', '13:30'),
  ('prazo_confirmacao', '10:00'),
  ('limite_mensal_padrao', '30')
ON CONFLICT (chave) DO NOTHING;
