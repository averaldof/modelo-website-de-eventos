-- Criação do banco de dados
-- CREATE DATABASE eventosuepa;

create schema if not exists eventosuepaS;

-- Tabela do Usuário
CREATE TABLE IF NOT EXISTS tb_inscrito (
    id_inscrito SERIAL PRIMARY KEY,
    nome_inscrito VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    curso VARCHAR(200) NOT NULL,
    num_matricula VARCHAR(11) NOT NULL
);

-- Tabela de Endereço
CREATE TABLE IF NOT EXISTS tb_endereco (
    id_endereco SERIAL PRIMARY KEY,
    rua VARCHAR(150),
    numero VARCHAR(10),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    cep VARCHAR(10),
    -- Define o local exato: um auditório, uma sala, etc.
    tipo_local VARCHAR(50)
);

-- Tabela de Evento
CREATE TABLE IF NOT EXISTS tb_evento (
    id_evento SERIAL PRIMARY KEY, 
    id_inscrito INT NOT NULL,
    nome_evento VARCHAR(200) NOT NULL,
    centro_academico VARCHAR(4) NOT NULL,
    local_campus VARCHAR(100) NOT NULL,
    id_endereco INT NOT NULL,
    
    -- Chaves estrangeiras
    CONSTRAINT fk_endereco FOREIGN KEY (id_endereco) REFERENCES tb_endereco(id_endereco),
    CONSTRAINT fk_inscrito FOREIGN KEY (id_inscrito) REFERENCES tb_inscrito(id_inscrito)
);


--Alterações
-- coluna de data à tabela de eventos
ALTER TABLE tb_evento 
ADD COLUMN data_evento DATE NOT NULL DEFAULT CURRENT_DATE;

--endereço na tabela de inscritos
ALTER TABLE tb_inscrito 
ADD COLUMN id_endereco INT;

ALTER TABLE tb_inscrito 
ADD CONSTRAINT fk_inscrito_endereco 
FOREIGN KEY (id_endereco) REFERENCES tb_endereco(id_endereco);

-- destaques para os 6 eventos mais recentes
-- Esta tabela funciona como uma "view" física ou snapshot
CREATE TABLE IF NOT EXISTS tb_destaques (
    id_destaque SERIAL PRIMARY KEY,
    id_evento INT NOT NULL,
    
    CONSTRAINT fk_evento_destaque FOREIGN KEY (id_evento) REFERENCES tb_evento(id_evento)
);

-- Para inserir os 6 eventos mais recentes nesta tabela:
-- INSERT INTO tb_destaques (id_evento)
-- SELECT id_evento FROM tb_evento ORDER BY data_evento DESC LIMIT 6;