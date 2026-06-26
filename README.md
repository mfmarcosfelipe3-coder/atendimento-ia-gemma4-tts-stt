# Secretária Inteligente — Atendimento WhatsApp com IA

Sistema autônomo de atendimento via WhatsApp com IA local (Gemma 4), TTS (Piper), STT (Groq Whisper), agendamento e cobrança.

## Funcionalidades

- **Atendimento WhatsApp** — Responde mensagens de texto e áudio automaticamente via Evolution API
- **IA Local (Gemma 4 E2B)** — Raciocínio e respostas inteligentes via Ollama, sem dados na nuvem
- **STT (Groq Whisper)** — Transcrição de áudios ultra-rápida via Groq API
- **TTS (Piper TTS)** — Geração de áudio local para respostas de voz (privacidade total)
- **Agendamento** — Verificação de disponibilidade e lembretes automáticos
- **Cobrança** — Lembretes inteligentes com escalonamento progressivo
- **Segundo Cérebro (Obsidian)** — Aprendizado contínuo e base de conhecimento

## Arquitetura

```
Cliente WhatsApp → Evolution API → Orquestrador (Node.js)
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
               Gemma 4 E2B        Obsidian Vault     PostgreSQL
              (Ollama local)     (segundo cérebro)   + Redis
                    │
          ┌────────┴────────┐
          ▼                 ▼
      Piper TTS         Groq STT
      (áudio local)    (transcrição)
```

## Stack

| Componente | Tecnologia |
|------------|------------|
| Backend | Node.js + Express |
| IA | Gemma 4 E2B via Ollama + Hermes (function calling) |
| STT | Groq API (Whisper) |
| TTS | Piper TTS (local) |
| WhatsApp | Evolution API |
| Banco de Dados | PostgreSQL |
| Cache/Filas | Redis + Bull |
| Segundo Cérebro | Obsidian Vault |
| Infraestrutura | Docker Compose |

## Pré-requisitos

- Node.js >= 20.0.0
- Docker e Docker Compose
- Ollama instalado com modelo `gemma4:2b`
- Conta Groq (para STT)
- Evolution API rodando

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/mfmarcosfelipe3-coder/atendimento-ia-gemma4-tts-stt.git
cd atendimento-ia-gemma4-tts-stt
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp config/.env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Groq (obter em https://console.groq.com)
GROQ_API_KEY=gsk_seu_token_aqui

# Evolution API
EVOLUTION_API_KEY=sua_chave_secreta
EVOLUTION_INSTANCE_NAME=secretaria
EVOLUTION_API_URL=http://localhost:8080

# Banco de dados
DATABASE_URL=postgresql://secretaria:secretaria123@localhost:5432/secretaria_db

# Redis
REDIS_URL=redis://localhost:6379

# Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=gemma4:2b

# Piper TTS
PIPER_HTTP_URL=http://localhost:5500
PIPER_VOICE=pt_BR-faber-medium
```

### 4. Inicie com Docker

```bash
npm run docker:up
```

Ou manualmente:

```bash
# PostgreSQL e Redis
docker compose -f docker/docker-compose.yml up -d

# Piper TTS
docker build -t piper-tts docker/piper-http-wrapper/
docker run -d -p 5500:5500 piper-tts
```

### 5. Execute o sistema

```bash
# Desenvolvimento (com hot-reload)
npm run dev

# Produção
npm start
```

## Estrutura do Projeto

```
├── config/              # Configurações e variáveis de ambiente
├── docker/              # Dockerfiles e docker-compose
│   └── piper-http-wrapper/  # Wrapper HTTP para Piper TTS
├── docs/                # Documentação
├── models/              # Modelos locais (Piper)
├── prompts/             # Prompts do sistema
├── scripts/             # Scripts auxiliares
├── segundo-cerebro/      # Vault Obsidian (segundo cérebro)
│   ├── 00-Inbox/
│   ├── 01-Clientes/
│   ├── 02-Agendamentos/
│   ├── 03-Cobrancas/
│   ├── 04-Conversas/
│   └── Templates/
├── src/
│   ├── agendamento/     # Módulo de agendamento
│   ├── ai/              # Cliente Ollama, prompts, function calling
│   ├── api/             # Rotas Express
│   ├── cobranca/        # Módulo de cobrança
│   ├── core/            # Orquestrador, event bus, sessões
│   ├── database/        # Conexão PostgreSQL
│   ├── memoria/         # Leitura/escrita Obsidian, indexação
│   ├── stt/             # Speech-to-Text (Groq)
│   ├── tts/             # Text-to-Speech (Piper)
│   ├── utils/           # Utilitários
│   └── whatsapp/        # Evolution API, webhooks
└── tests/               # Testes
```

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor em produção |
| `npm run dev` | Inicia com nodemon (hot-reload) |
| `npm run docker:up` | Sobe serviços via Docker |
| `npm run docker:down` | Para serviços Docker |
| `npm run docker:logs` | Exibe logs dos containers |
| `npm test` | Executa testes com cobertura |
| `npm run lint` | Verifica código com ESLint |

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente | `development` |
| `PORT` | Porta do servidor | `3000` |
| `GROQ_API_KEY` | Chave da API Groq (STT) | — |
| `EVOLUTION_API_KEY` | Chave da Evolution API | — |
| `EVOLUTION_INSTANCE_NAME` | Nome da instância WhatsApp | `secretaria` |
| `DATABASE_URL` | URL de conexão PostgreSQL | — |
| `REDIS_URL` | URL de conexão Redis | — |
| `OLLAMA_URL` | URL do Ollama | `http://localhost:11434` |
| `OLLAMA_MODEL` | Modelo do Ollama | `gemma4:2b` |
| `PIPER_HTTP_URL` | URL do Piper TTS | `http://localhost:5500` |
| `PIPER_VOICE` | Voz do Piper | `pt_BR-faber-medium` |
| `OBSIDIAN_VAULT_PATH` | Caminho do vault Obsidian | `./segundo-cerebro` |

## Licença

MIT — Felipe Lemes
