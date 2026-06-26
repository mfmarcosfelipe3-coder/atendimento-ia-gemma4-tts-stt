-- Criar banco para a Evolution API se não for o banco padrão
CREATE DATABASE evolution_db;

\c secretaria_db;

-- Clientes
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    address TEXT,
    preferred_time VARCHAR(50),
    payment_preference VARCHAR(50),
    notes TEXT,
    obsidian_note_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Agendamentos
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    service VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'agendado',
    price DECIMAL(10,2),
    notes TEXT,
    reminder_24h_sent BOOLEAN DEFAULT false,
    reminder_1h_sent BOOLEAN DEFAULT false,
    obsidian_note_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Cobranças
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    appointment_id INTEGER REFERENCES appointments(id),
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    payment_method VARCHAR(50),
    paid_at TIMESTAMP,
    notes TEXT,
    escalation_level INTEGER DEFAULT 0,
    obsidian_note_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Conversas
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    message_count INTEGER DEFAULT 0,
    summary TEXT,
    sentiment VARCHAR(50),
    actions_taken JSONB DEFAULT '[]',
    obsidian_note_path VARCHAR(500)
);

-- Mensagens individuais
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id),
    direction VARCHAR(10) NOT NULL,  -- 'in' ou 'out'
    type VARCHAR(50) NOT NULL,       -- text, audio, image
    content TEXT,
    audio_transcription TEXT,
    whatsapp_message_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Horários de funcionamento
CREATE TABLE IF NOT EXISTS business_hours (
    id SERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL,
    open_time TIME,
    close_time TIME,
    is_open BOOLEAN DEFAULT true,
    slot_duration INTEGER DEFAULT 60
);

-- Serviços oferecidos
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,  -- minutos
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);

-- Inserir dados padrão (Horários de funcionamento de Seg a Sex 09:00 as 18:00)
INSERT INTO business_hours (day_of_week, open_time, close_time, is_open) VALUES
(0, '00:00', '00:00', false),
(1, '09:00', '18:00', true),
(2, '09:00', '18:00', true),
(3, '09:00', '18:00', true),
(4, '09:00', '18:00', true),
(5, '09:00', '18:00', true),
(6, '00:00', '00:00', false)
ON CONFLICT DO NOTHING;
