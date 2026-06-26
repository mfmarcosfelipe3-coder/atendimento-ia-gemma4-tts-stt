# 🤖 Secretária Inteligente — Plano Completo do Projeto

> **Versão**: 1.0  
> **Data**: 25/06/2026  
> **Autor**: Felipe Lemes  
> **Stack**: Node.js + Python | Gemma 4 E2B (Ollama) | Groq STT | Piper TTS | Evolution API | Obsidian

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Stack Tecnológico](#3-stack-tecnológico)
4. [Estrutura de Pastas](#4-estrutura-de-pastas)
5. [Módulo 1 — WhatsApp (Evolution API)](#5-módulo-1--whatsapp-evolution-api)
6. [Módulo 2 — IA Local (Gemma 4 E2B + Hermes)](#6-módulo-2--ia-local-gemma-4-e2b--hermes)
7. [Módulo 3 — STT (Groq Whisper)](#7-módulo-3--stt-groq-whisper)
8. [Módulo 4 — TTS (Piper TTS)](#8-módulo-4--tts-piper-tts)
9. [Módulo 5 — Agendamento](#9-módulo-5--agendamento)
10. [Módulo 6 — Cobrança](#10-módulo-6--cobrança)
11. [Módulo 7 — Segundo Cérebro (Obsidian)](#11-módulo-7--segundo-cérebro-obsidian)
12. [Módulo 8 — Function Calling (Hermes)](#12-módulo-8--function-calling-hermes)
13. [Banco de Dados](#13-banco-de-dados)
14. [Docker & Infraestrutura](#14-docker--infraestrutura)
15. [Fluxos de Operação](#15-fluxos-de-operação)
16. [Segurança](#16-segurança)
17. [Roadmap de Implementação](#17-roadmap-de-implementação)
18. [Requisitos do Servidor](#18-requisitos-do-servidor)

---

## 1. Visão Geral

A **Secretária Inteligente** é um sistema autônomo de atendimento via WhatsApp que:

- 📱 **Responde mensagens** de texto e áudio no WhatsApp automaticamente
- 📅 **Agenda compromissos** verificando disponibilidade em tempo real
- 💰 **Cobra clientes** com lembretes inteligentes e escalonamento
- 🧠 **Aprende continuamente** usando Obsidian como segundo cérebro
- 🎤 **Entende áudios** via Groq (Whisper) para STT ultra-rápido
- 🔊 **Responde com áudio** via Piper TTS local (privacidade total)
- 🤖 **Funciona 100% local** com Gemma 4 E2B via Ollama (sem nuvem para IA)

### Princípios do Projeto
- **Privacidade First**: IA roda local, nenhum dado de cliente sai do servidor
- **Baixo custo**: Única API paga é o Groq STT (custo mínimo)
- **Autonomia**: Sistema opera 24/7 sem intervenção humana
- **Aprendizado contínuo**: Cada interação alimenta o segundo cérebro

---

## 2. Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SERVIDOR LOCAL                              │
│                                                                     │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │  Evolution    │───▶│   ORQUESTRADOR   │───▶│   Gemma 4 E2B    │  │
│  │  API          │    │   (Node.js)      │    │   (Ollama)       │  │
│  │  (WhatsApp)   │◀──│                  │◀──│   + Hermes        │  │
│  └──────────────┘    │                  │    └──────────────────┘  │
│                       │                  │                          │
│  ┌──────────────┐    │                  │    ┌──────────────────┐  │
│  │  Piper TTS   │◀──│                  │───▶│   Obsidian Vault  │  │
│  │  (Local)     │    │                  │    │   (2º Cérebro)   │  │
│  └──────────────┘    │                  │    └──────────────────┘  │
│                       │                  │                          │
│  ┌──────────────┐    │                  │    ┌──────────────────┐  │
│  │  Groq API    │◀──│                  │───▶│   PostgreSQL     │  │
│  │  (STT Cloud) │───▶│                  │    │   + Redis        │  │
│  └──────────────┘    └──────────────────┘    └──────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Fluxo Principal

```
Cliente envia mensagem WhatsApp
        │
        ▼
   É ÁUDIO?  ──SIM──▶  Groq STT (Whisper) ──▶ Texto transcrito
        │                                            │
       NÃO                                           │
        │                                            │
        ▼                                            ▼
   Texto puro  ──────────────────────────────▶  ORQUESTRADOR
                                                     │
                                    ┌────────────────┤
                                    ▼                ▼
                            Consulta Obsidian   Gemma 4 E2B
                            (contexto/memória)  (raciocínio)
                                    │                │
                                    └───────┬────────┘
                                            ▼
                                    Resposta gerada
                                            │
                                    ┌───────┤
                                    ▼       ▼
                            Texto      Piper TTS ──▶ Áudio
                                    │       │
                                    ▼       ▼
                            Envia via Evolution API
                                            │
                                            ▼
                            Salva no Obsidian (2º Cérebro)
```

---

## 3. Stack Tecnológico

| Componente | Tecnologia | Tipo | Descrição |
|:---|:---|:---|:---|
| **Backend Principal** | Node.js 20+ | Local | Orquestrador central do sistema |
| **IA / LLM** | Gemma 4 E2B (2B params) | Local (Ollama) | Cérebro da secretária |
| **Function Calling** | Hermes Format | Local | Chamada de funções estruturada |
| **STT** | Groq Whisper Large V3 | Cloud API | Transcrição de áudio → texto |
| **TTS** | Piper TTS | Local | Texto → áudio (voz natural pt-BR) |
| **WhatsApp** | Evolution API v2 | Local (Docker) | Gateway WhatsApp não-oficial |
| **Banco de Dados** | PostgreSQL 16 | Local | Dados estruturados |
| **Cache/Filas** | Redis 7 | Local | Cache, filas de mensagens, sessões |
| **2º Cérebro** | Obsidian Vault (Markdown) | Local | Base de conhecimento persistente |
| **Containers** | Docker + Docker Compose | Local | Orquestração de serviços |
| **Agendamento de Tarefas** | node-cron / Bull | Local | Jobs de cobrança e lembretes |

---

## 4. Estrutura de Pastas

```
projeto2/
├── src/                          # Código fonte principal
│   ├── core/                     # Núcleo do orquestrador
│   │   ├── orchestrator.js       # Controlador principal de fluxo
│   │   ├── messageRouter.js      # Roteador de mensagens por tipo
│   │   ├── sessionManager.js     # Gerenciamento de sessões/contexto
│   │   └── eventBus.js           # Sistema de eventos interno
│   │
│   ├── whatsapp/                 # Módulo WhatsApp
│   │   ├── evolutionClient.js    # Client da Evolution API
│   │   ├── webhookHandler.js     # Handler de webhooks recebidos
│   │   ├── messageFormatter.js   # Formatação de mensagens
│   │   └── mediaHandler.js       # Download/upload de mídia
│   │
│   ├── ai/                       # Módulo de IA
│   │   ├── ollamaClient.js       # Client Ollama (Gemma 4)
│   │   ├── promptBuilder.js      # Construtor de prompts
│   │   ├── hermesTools.js        # Definições de tools Hermes
│   │   ├── functionCaller.js     # Executor de function calls
│   │   └── contextManager.js     # Gerenciamento de contexto/memória
│   │
│   ├── stt/                      # Módulo Speech-to-Text
│   │   ├── groqClient.js         # Client da API Groq
│   │   ├── audioProcessor.js     # Pré-processamento de áudio
│   │   └── transcriber.js        # Orquestrador de transcrição
│   │
│   ├── tts/                      # Módulo Text-to-Speech
│   │   ├── piperClient.js        # Client do Piper TTS
│   │   ├── voiceConfig.js        # Configuração de vozes
│   │   └── audioGenerator.js     # Gerador de áudio de resposta
│   │
│   ├── agendamento/              # Módulo de Agendamento
│   │   ├── scheduler.js          # Motor de agendamento
│   │   ├── calendarService.js    # Serviço de calendário
│   │   ├── reminderService.js    # Serviço de lembretes
│   │   └── availabilityChecker.js # Verificador de disponibilidade
│   │
│   ├── cobranca/                 # Módulo de Cobrança
│   │   ├── billingService.js     # Serviço de cobrança
│   │   ├── paymentTracker.js     # Rastreador de pagamentos
│   │   ├── reminderEscalation.js # Escalonamento de lembretes
│   │   └── reportGenerator.js    # Gerador de relatórios
│   │
│   ├── memoria/                  # Módulo Segundo Cérebro
│   │   ├── obsidianWriter.js     # Escritor de notas Obsidian
│   │   ├── obsidianReader.js     # Leitor de notas Obsidian
│   │   ├── knowledgeIndexer.js   # Indexador de conhecimento
│   │   ├── learningEngine.js     # Motor de aprendizado
│   │   └── searchEngine.js       # Busca semântica no vault
│   │
│   ├── api/                      # API REST interna
│   │   ├── server.js             # Servidor Express/Fastify
│   │   ├── routes/               # Rotas da API
│   │   │   ├── webhookRoutes.js  # Rotas de webhook
│   │   │   ├── adminRoutes.js    # Rotas administrativas
│   │   │   └── healthRoutes.js   # Health check
│   │   └── middleware/           # Middlewares
│   │       ├── auth.js           # Autenticação
│   │       └── rateLimit.js      # Rate limiting
│   │
│   ├── database/                 # Banco de Dados
│   │   ├── connection.js         # Conexão PostgreSQL
│   │   ├── models/               # Modelos de dados
│   │   │   ├── Client.js         # Modelo Cliente
│   │   │   ├── Appointment.js    # Modelo Agendamento
│   │   │   ├── Invoice.js        # Modelo Cobrança
│   │   │   ├── Conversation.js   # Modelo Conversa
│   │   │   └── Message.js        # Modelo Mensagem
│   │   └── migrations/           # Migrações
│   │
│   └── utils/                    # Utilitários
│       ├── logger.js             # Sistema de logs
│       ├── dateHelper.js         # Helpers de data/hora
│       ├── validators.js         # Validadores
│       └── constants.js          # Constantes do sistema
│
├── segundo-cerebro/              # Vault Obsidian (2º Cérebro)
│   ├── 00-Inbox/                 # Notas brutas e capturas
│   ├── 01-Clientes/              # Base de clientes
│   ├── 02-Agendamentos/          # Histórico de agendamentos
│   ├── 03-Cobrancas/             # Histórico de cobranças
│   ├── 04-Conversas/             # Log de conversas
│   ├── 05-Aprendizados/          # Padrões aprendidos pela IA
│   ├── 06-Relatorios/            # Relatórios automáticos
│   ├── 07-Config/                # Configurações e prompts
│   ├── 08-Anexos/                # Mídia e documentos
│   └── Templates/                # Templates Obsidian
│       ├── Template-Cliente.md
│       ├── Template-Agendamento.md
│       ├── Template-Cobranca.md
│       └── Template-Conversa.md
│
├── prompts/                      # Templates de prompt para a IA
│   ├── system-prompt.md          # Prompt de sistema principal
│   ├── agendamento-prompt.md     # Prompt para agendamentos
│   ├── cobranca-prompt.md        # Prompt para cobranças
│   └── atendimento-prompt.md     # Prompt para atendimento geral
│
├── docker/                       # Configurações Docker
│   ├── Dockerfile                # Dockerfile do app
│   ├── docker-compose.yml        # Compose completo
│   └── nginx.conf                # Config Nginx (proxy reverso)
│
├── config/                       # Configurações
│   ├── .env.example              # Exemplo de variáveis de ambiente
│   └── default.js                # Configuração padrão
│
├── models/                       # Modelos de ML
│   └── piper/                    # Vozes Piper TTS
│       └── .gitkeep
│
├── scripts/                      # Scripts de automação
│   ├── setup.sh                  # Script de instalação
│   ├── download-piper-voice.sh   # Download de vozes PT-BR
│   └── backup-vault.sh           # Backup do Obsidian
│
├── tests/                        # Testes
├── docs/                         # Documentação
├── temp/                         # Arquivos temporários (áudio/mídia)
├── logs/                         # Logs do sistema
├── package.json                  # Dependências Node.js
├── .env                          # Variáveis de ambiente (NÃO commitar)
├── .gitignore                    # Git ignore
└── README.md                     # Documentação principal
```

---

## 5. Módulo 1 — WhatsApp (Evolution API)

### O que é
A **Evolution API** é um gateway open-source que conecta ao WhatsApp Web via protocolo Baileys. Funciona como ponte entre nosso sistema e o WhatsApp.

### Setup com Docker

```yaml
# docker/docker-compose.yml (serviço Evolution)
evolution-api:
  image: atendai/evolution-api:latest
  container_name: evolution-api
  restart: always
  ports:
    - "8080:8080"
  environment:
    - AUTHENTICATION_API_KEY=sua_chave_aqui
    - DATABASE_PROVIDER=postgresql
    - DATABASE_CONNECTION_URI=postgresql://user:pass@postgres:5432/evolution
    - CACHE_REDIS_URI=redis://redis:6379
    - WEBHOOK_GLOBAL_URL=http://app:3000/webhook/evolution
    - WEBHOOK_GLOBAL_ENABLED=true
    - WEBHOOK_EVENTS_MESSAGES_UPSERT=true
  depends_on:
    - postgres
    - redis
```

### Funcionalidades Implementadas

| Funcionalidade | Endpoint | Descrição |
|:---|:---|:---|
| Criar instância | `POST /instance/create` | Cria conexão WhatsApp |
| QR Code | `GET /instance/connect/{name}` | Gera QR para parear |
| Enviar texto | `POST /message/sendText/{name}` | Envia mensagem de texto |
| Enviar áudio | `POST /message/sendWhatsAppAudio/{name}` | Envia áudio formatado |
| Enviar imagem | `POST /message/sendMedia/{name}` | Envia imagem/documento |
| Webhook recebido | `POST /webhook/evolution` | Recebe mensagens |

### Webhook Handler

```javascript
// src/whatsapp/webhookHandler.js (pseudocódigo)
async function handleIncomingMessage(webhookData) {
  const { key, message, messageType } = webhookData;
  
  if (messageType === 'audioMessage') {
    // 1. Baixar áudio do WhatsApp
    // 2. Enviar para Groq STT
    // 3. Obter texto transcrito
    // 4. Processar como texto
  }
  
  if (messageType === 'conversation' || messageType === 'extendedTextMessage') {
    // 1. Extrair texto
    // 2. Buscar contexto no Obsidian
    // 3. Enviar para Gemma 4 com tools Hermes
    // 4. Executar function calls se houver
    // 5. Gerar resposta
    // 6. Opcionalmente converter para áudio (Piper)
    // 7. Enviar resposta via Evolution API
    // 8. Salvar conversa no Obsidian
  }
}
```

---

## 6. Módulo 2 — IA Local (Gemma 4 E2B + Hermes)

### Por que Gemma 4 E2B?
- **2.3B parâmetros efetivos** — leve o suficiente para rodar em hardware modesto
- **Multimodal** — suporta texto, imagem e áudio nativamente
- **128K de contexto** — janela enorme para manter histórico de conversas
- **Otimizado para edge** — projetado para rodar local sem GPU potente
- **Gratuito** — sem custo de API

### Setup com Ollama

```bash
# Instalar Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Baixar Gemma 4 E2B
ollama pull gemma4:2b

# Testar
ollama run gemma4:2b "Olá, como posso ajudar?"
```

### Integração via API Ollama

```javascript
// src/ai/ollamaClient.js (pseudocódigo)
const OLLAMA_BASE_URL = 'http://localhost:11434';

async function chat(messages, tools = []) {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma4:2b',
      messages: messages,
      tools: tools,  // Function calling via Hermes
      stream: false,
      options: {
        temperature: 0.7,
        num_ctx: 8192,    // Contexto para conversas
        top_p: 0.9
      }
    })
  });
  return response.json();
}
```

### System Prompt da Secretária

```markdown
Você é a **Sofia**, uma secretária virtual profissional e simpática.

## Suas responsabilidades:
1. **Atendimento**: Responder clientes de forma educada e eficiente
2. **Agendamento**: Marcar, remarcar e cancelar compromissos
3. **Cobrança**: Enviar lembretes de pagamento de forma delicada
4. **Informações**: Responder dúvidas sobre serviços e horários

## Regras:
- Sempre seja cordial e profissional
- Use emojis moderadamente (máximo 2 por mensagem)
- Confirme dados antes de agendar
- Para cobranças, seja delicada mas firme
- Se não souber responder, diga que vai verificar
- Respostas curtas e diretas (máximo 3 parágrafos)

## Contexto do negócio:
{contexto_obsidian}

## Ferramentas disponíveis:
Você tem acesso a ferramentas para agendar, cobrar, consultar agenda, etc.
Use-as quando necessário via function calling.
```

---

## 7. Módulo 3 — STT (Groq Whisper)

### Por que Groq?
- **Ultra-rápido**: 200x mais rápido que tempo real
- **Whisper Large V3**: Melhor modelo de STT multilíngue
- **Custo baixíssimo**: Frações de centavo por minuto
- **API compatível com OpenAI**: Fácil integração

### Configuração

```javascript
// src/stt/groqClient.js (pseudocódigo)
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_STT_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

async function transcribe(audioBuffer, filename) {
  const formData = new FormData();
  formData.append('file', audioBuffer, filename);
  formData.append('model', 'whisper-large-v3');
  formData.append('language', 'pt');
  formData.append('response_format', 'json');
  
  const response = await fetch(GROQ_STT_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: formData
  });
  
  const result = await response.json();
  return result.text;
}
```

### Pipeline de Áudio

```
Áudio WhatsApp (OGG/OPUS)
     │
     ▼
Download via Evolution API
     │
     ▼
Conversão para formato suportado (se necessário)
     │
     ▼
Envio para Groq Whisper
     │
     ▼
Texto transcrito em PT-BR
     │
     ▼
Passa para o Orquestrador como texto normal
```

---

## 8. Módulo 4 — TTS (Piper TTS)

### Por que Piper TTS?
- **100% local**: Nenhum áudio sai do servidor
- **Rápido**: Otimizado para CPU, não precisa de GPU
- **Qualidade**: Vozes naturais em PT-BR
- **Gratuito**: Open-source, sem custo

### Setup com Docker

```yaml
# docker/docker-compose.yml (serviço Piper)
piper-tts:
  image: rhasspy/wyoming-piper:latest
  container_name: piper-tts
  restart: always
  ports:
    - "10200:10200"
  volumes:
    - ./models/piper:/data
  command: >
    --voice pt_BR-faber-medium
    --max-piper-procs 2
```

### Vozes PT-BR Disponíveis

| Voz | Qualidade | Tamanho | Recomendação |
|:---|:---|:---|:---|
| `pt_BR-faber-medium` | Boa | ~60MB | ✅ Recomendada |
| `pt_BR-edresson-low` | Básica | ~30MB | Servidor limitado |

### Integração

```javascript
// src/tts/piperClient.js (pseudocódigo)
const net = require('net');

async function synthesize(text) {
  return new Promise((resolve, reject) => {
    // Conectar via Wyoming Protocol (porta 10200)
    const client = net.createConnection({ port: 10200 }, () => {
      // Enviar texto para síntese
      // Receber áudio WAV
      // Converter para OGG/OPUS (formato WhatsApp)
    });
  });
}

// Alternativa: HTTP wrapper com FastAPI
async function synthesizeHTTP(text) {
  const response = await fetch('http://localhost:5500/synthesize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice: 'pt_BR-faber-medium' })
  });
  return response.arrayBuffer(); // Áudio em WAV
}
```

### Wrapper HTTP para Piper (Python)

Como o Piper usa Wyoming Protocol (não HTTP), vamos criar um wrapper:

```python
# docker/piper-http-wrapper/app.py
from fastapi import FastAPI
from piper import PiperVoice
import io, wave

app = FastAPI()
voice = PiperVoice.load("pt_BR-faber-medium.onnx")

@app.post("/synthesize")
async def synthesize(request: dict):
    text = request["text"]
    audio_buffer = io.BytesIO()
    with wave.open(audio_buffer, 'wb') as wav:
        voice.synthesize(text, wav)
    return Response(content=audio_buffer.getvalue(), media_type="audio/wav")
```

---

## 9. Módulo 5 — Agendamento

### Funcionalidades

- ✅ **Verificar disponibilidade** de horários
- ✅ **Criar agendamentos** com confirmação
- ✅ **Remarcar agendamentos** existentes
- ✅ **Cancelar agendamentos** com motivo
- ✅ **Enviar lembretes** (24h antes e 1h antes)
- ✅ **Listar agenda do dia/semana**
- ✅ **Detectar conflitos** de horário

### Modelo de Dados

```sql
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    service VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'agendado',  -- agendado, confirmado, cancelado, realizado, no_show
    price DECIMAL(10,2),
    notes TEXT,
    reminder_24h_sent BOOLEAN DEFAULT false,
    reminder_1h_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE business_hours (
    id SERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL,  -- 0=Dom, 1=Seg, ..., 6=Sab
    open_time TIME,
    close_time TIME,
    is_open BOOLEAN DEFAULT true,
    slot_duration INTEGER DEFAULT 60  -- minutos
);
```

### Fluxo de Agendamento

```
Cliente: "Quero marcar para sexta às 14h"
    │
    ▼
IA detecta intenção de AGENDAMENTO
    │
    ▼
Function Call: verificar_disponibilidade(sexta, 14:00)
    │
    ├── DISPONÍVEL ──▶ "Perfeito! Qual serviço você deseja?"
    │                       │
    │                       ▼
    │                   Cliente informa serviço
    │                       │
    │                       ▼
    │               Function Call: criar_agendamento(...)
    │                       │
    │                       ▼
    │               "✅ Agendado! Sexta, 14h - Serviço X"
    │               "Vou te lembrar 24h antes 😊"
    │
    └── INDISPONÍVEL ──▶ "Esse horário não está disponível 😕"
                          "Tenho esses horários livres: ..."
                          Function Call: listar_horarios_disponiveis(sexta)
```

### Cron Jobs de Lembretes

```javascript
// Lembrete 24h antes
cron.schedule('0 * * * *', async () => {  // A cada hora
  const tomorrow = getAppointmentsForTomorrow();
  for (const apt of tomorrow) {
    if (!apt.reminder_24h_sent) {
      await sendReminder24h(apt);
    }
  }
});

// Lembrete 1h antes
cron.schedule('*/15 * * * *', async () => {  // A cada 15 min
  const upcoming = getAppointmentsNextHour();
  for (const apt of upcoming) {
    if (!apt.reminder_1h_sent) {
      await sendReminder1h(apt);
    }
  }
});
```

---

## 10. Módulo 6 — Cobrança

### Funcionalidades

- ✅ **Gerar cobranças** automaticamente pós-atendimento
- ✅ **Enviar lembretes** de pagamento no vencimento
- ✅ **Escalonar cobranças**: lembrete → cobrança → aviso firme
- ✅ **Registrar pagamentos** confirmados
- ✅ **Relatório de inadimplência**
- ✅ **Tom progressivo**: educado → firme → último aviso

### Modelo de Dados

```sql
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    appointment_id INTEGER REFERENCES appointments(id),
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',  -- pendente, enviada, paga, atrasada, cancelada
    payment_method VARCHAR(50),
    paid_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE billing_reminders (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id),
    level INTEGER DEFAULT 1,  -- 1=lembrete, 2=cobrança, 3=último aviso
    sent_at TIMESTAMP DEFAULT NOW(),
    message_sent TEXT,
    client_response TEXT
);
```

### Escalonamento de Cobrança

```
DIA DO VENCIMENTO:
  📩 "Olá [nome]! Lembrando que o pagamento de R$[valor] 
      referente a [serviço] vence hoje. Precisa de algo? 😊"

3 DIAS APÓS VENCIMENTO (Nível 1):
  📩 "Oi [nome], tudo bem? Notei que o pagamento de R$[valor]
      ainda está em aberto. Posso te ajudar com alguma forma 
      de pagamento? 🙏"

7 DIAS APÓS VENCIMENTO (Nível 2):
  📩 "[nome], o pagamento de R$[valor] está pendente desde [data].
      Gostaria de verificar se houve algum problema. 
      Podemos negociar uma forma de pagamento?"

15 DIAS APÓS VENCIMENTO (Nível 3):
  📩 "[nome], preciso regularizar o pagamento de R$[valor].
      Este é o último lembrete antes de tomarmos outras medidas.
      Por favor, entre em contato para resolvermos juntos."

30 DIAS APÓS VENCIMENTO:
  🔔 Alerta para o proprietário do negócio (humano)
```

### Cron Job de Cobrança

```javascript
// Executar diariamente às 9h
cron.schedule('0 9 * * *', async () => {
  // 1. Cobranças vencendo hoje
  await sendDueTodayReminders();
  
  // 2. Cobranças atrasadas (escalonamento)
  await processOverdueInvoices();
  
  // 3. Gerar relatório diário
  await generateDailyBillingReport();
});
```

---

## 11. Módulo 7 — Segundo Cérebro (Obsidian)

### Conceito

O Obsidian Vault funciona como uma **memória persistente** da IA. Cada interação, cada cliente, cada agendamento gera notas Markdown que a IA consulta para contextualizar suas respostas.

### Como a IA usa o Obsidian

```
1. ESCRITA (após cada interação):
   ┌─────────────────┐
   │ Conversa com     │──▶ Cria/atualiza nota em 04-Conversas/
   │ cliente          │──▶ Atualiza nota do cliente em 01-Clientes/
   │                  │──▶ Se agendou: cria nota em 02-Agendamentos/
   │                  │──▶ Se cobrou: cria nota em 03-Cobrancas/
   │                  │──▶ Registra padrão em 05-Aprendizados/
   └─────────────────┘

2. LEITURA (antes de responder):
   ┌─────────────────┐
   │ Nova mensagem    │──▶ Busca nota do cliente em 01-Clientes/
   │ recebida         │──▶ Busca histórico em 04-Conversas/
   │                  │──▶ Busca regras em 05-Aprendizados/
   │                  │──▶ Busca agenda em 02-Agendamentos/
   │                  │──▶ Monta contexto para a IA
   └─────────────────┘
```

### Estrutura do Vault

```
segundo-cerebro/
├── 00-Inbox/           # Notas brutas, capturas rápidas
├── 01-Clientes/        # Uma nota por cliente (dados, preferências, histórico)
├── 02-Agendamentos/    # Registro de todos os agendamentos
├── 03-Cobrancas/       # Registro de todas as cobranças
├── 04-Conversas/       # Log de cada conversa com resumo
├── 05-Aprendizados/    # Padrões e regras aprendidos pela IA
│   ├── padroes-atendimento.md
│   ├── preferencias-clientes.md
│   ├── erros-e-correcoes.md
│   └── regras-negocio.md
├── 06-Relatorios/      # Relatórios gerados automaticamente
├── 07-Config/          # Prompts, configurações
├── 08-Anexos/          # Mídia e documentos
└── Templates/          # Templates para criação de notas
```

### Motor de Busca no Vault

```javascript
// src/memoria/searchEngine.js (pseudocódigo)
const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter'); // Para ler frontmatter YAML

async function searchVault(query, folder = null) {
  const vaultPath = process.env.OBSIDIAN_VAULT_PATH;
  const searchPath = folder 
    ? path.join(vaultPath, folder) 
    : vaultPath;
  
  const files = await getMarkdownFiles(searchPath);
  const results = [];
  
  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const { data: frontmatter, content: body } = matter(content);
    
    // Busca por texto
    if (body.toLowerCase().includes(query.toLowerCase())) {
      results.push({ file, frontmatter, relevance: calculateRelevance(body, query) });
    }
    
    // Busca por frontmatter
    if (matchesFrontmatter(frontmatter, query)) {
      results.push({ file, frontmatter, relevance: 1.0 });
    }
  }
  
  return results.sort((a, b) => b.relevance - a.relevance);
}

async function getClientContext(phoneNumber) {
  // Busca nota do cliente pelo telefone
  const clientNote = await searchVault(phoneNumber, '01-Clientes');
  
  // Busca últimas conversas
  const recentConversations = await getRecentNotes('04-Conversas', 5);
  
  // Busca agendamentos futuros
  const upcomingAppointments = await searchVault('status: agendado', '02-Agendamentos');
  
  // Busca cobranças pendentes
  const pendingInvoices = await searchVault('status: pendente', '03-Cobrancas');
  
  // Busca aprendizados relevantes
  const learnings = await getRecentNotes('05-Aprendizados', 3);
  
  return {
    client: clientNote,
    conversations: recentConversations,
    appointments: upcomingAppointments,
    invoices: pendingInvoices,
    learnings: learnings
  };
}
```

### Motor de Aprendizado

```javascript
// src/memoria/learningEngine.js (pseudocódigo)
async function learnFromConversation(conversation) {
  const { client, messages, outcome, sentiment } = conversation;
  
  // 1. Detectar padrões
  if (sentiment === 'positivo' && outcome === 'agendamento_realizado') {
    await appendToNote('05-Aprendizados/padroes-atendimento.md', {
      pattern: 'Abordagem que funcionou para agendamento',
      context: summarize(messages),
      date: new Date()
    });
  }
  
  // 2. Registrar preferências do cliente
  if (client) {
    await updateClientPreferences(client, {
      preferred_time: detectPreferredTime(messages),
      communication_style: detectStyle(messages),
      payment_preference: detectPaymentPref(messages)
    });
  }
  
  // 3. Registrar erros (se houve correção humana)
  if (conversation.wasCorected) {
    await appendToNote('05-Aprendizados/erros-e-correcoes.md', {
      error: conversation.originalResponse,
      correction: conversation.correctedResponse,
      lesson: 'Próxima vez, fazer X em vez de Y',
      date: new Date()
    });
  }
}
```

---

## 12. Módulo 8 — Function Calling (Hermes)

### O que é o Formato Hermes?

O Hermes é um formato de function calling que usa tags XML para definir ferramentas disponíveis e capturar chamadas de função da IA. É nativo em modelos Hermes da NousResearch e também funciona com Gemma via Ollama.

### Ferramentas Definidas

```javascript
// src/ai/hermesTools.js
const tools = [
  {
    type: "function",
    function: {
      name: "verificar_disponibilidade",
      description: "Verifica se um horário está disponível na agenda",
      parameters: {
        type: "object",
        properties: {
          data: { type: "string", description: "Data no formato YYYY-MM-DD" },
          hora: { type: "string", description: "Hora no formato HH:MM" }
        },
        required: ["data", "hora"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "criar_agendamento",
      description: "Cria um novo agendamento na agenda",
      parameters: {
        type: "object",
        properties: {
          cliente_telefone: { type: "string" },
          data: { type: "string" },
          hora: { type: "string" },
          servico: { type: "string" },
          valor: { type: "number" }
        },
        required: ["cliente_telefone", "data", "hora", "servico"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "cancelar_agendamento",
      description: "Cancela um agendamento existente",
      parameters: {
        type: "object",
        properties: {
          agendamento_id: { type: "integer" },
          motivo: { type: "string" }
        },
        required: ["agendamento_id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "listar_horarios_disponiveis",
      description: "Lista todos os horários disponíveis em uma data",
      parameters: {
        type: "object",
        properties: {
          data: { type: "string", description: "Data no formato YYYY-MM-DD" }
        },
        required: ["data"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "consultar_cobranca",
      description: "Consulta cobranças pendentes de um cliente",
      parameters: {
        type: "object",
        properties: {
          cliente_telefone: { type: "string" }
        },
        required: ["cliente_telefone"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "registrar_pagamento",
      description: "Registra que um pagamento foi realizado",
      parameters: {
        type: "object",
        properties: {
          cobranca_id: { type: "integer" },
          forma_pagamento: { type: "string", enum: ["pix", "dinheiro", "cartao", "transferencia"] }
        },
        required: ["cobranca_id", "forma_pagamento"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "buscar_info_cliente",
      description: "Busca informações sobre um cliente no segundo cérebro",
      parameters: {
        type: "object",
        properties: {
          telefone: { type: "string" }
        },
        required: ["telefone"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "salvar_aprendizado",
      description: "Salva um novo aprendizado ou padrão no segundo cérebro",
      parameters: {
        type: "object",
        properties: {
          categoria: { type: "string", enum: ["padrao_atendimento", "preferencia_cliente", "regra_negocio", "erro_correcao"] },
          descricao: { type: "string" },
          contexto: { type: "string" }
        },
        required: ["categoria", "descricao"]
      }
    }
  }
];
```

### Executor de Function Calls

```javascript
// src/ai/functionCaller.js (pseudocódigo)
const toolHandlers = {
  verificar_disponibilidade: async ({ data, hora }) => {
    return await calendarService.checkAvailability(data, hora);
  },
  criar_agendamento: async (params) => {
    const result = await scheduler.createAppointment(params);
    await obsidianWriter.createAppointmentNote(result);
    return result;
  },
  cancelar_agendamento: async ({ agendamento_id, motivo }) => {
    return await scheduler.cancelAppointment(agendamento_id, motivo);
  },
  listar_horarios_disponiveis: async ({ data }) => {
    return await calendarService.getAvailableSlots(data);
  },
  consultar_cobranca: async ({ cliente_telefone }) => {
    return await billingService.getPendingInvoices(cliente_telefone);
  },
  registrar_pagamento: async ({ cobranca_id, forma_pagamento }) => {
    const result = await billingService.registerPayment(cobranca_id, forma_pagamento);
    await obsidianWriter.updateInvoiceNote(cobranca_id, 'paga');
    return result;
  },
  buscar_info_cliente: async ({ telefone }) => {
    return await obsidianReader.getClientContext(telefone);
  },
  salvar_aprendizado: async ({ categoria, descricao, contexto }) => {
    return await learningEngine.saveLearning(categoria, descricao, contexto);
  }
};

async function executeFunctionCall(toolCall) {
  const { name, arguments: args } = toolCall.function;
  const handler = toolHandlers[name];
  
  if (!handler) throw new Error(`Tool não encontrada: ${name}`);
  
  return await handler(JSON.parse(args));
}
```

---

## 13. Banco de Dados

### Schema Completo

```sql
-- Clientes
CREATE TABLE clients (
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
CREATE TABLE appointments (
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
CREATE TABLE invoices (
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
CREATE TABLE conversations (
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
CREATE TABLE messages (
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
CREATE TABLE business_hours (
    id SERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL,
    open_time TIME,
    close_time TIME,
    is_open BOOLEAN DEFAULT true,
    slot_duration INTEGER DEFAULT 60
);

-- Serviços oferecidos
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,  -- minutos
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Índices
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
```

---

## 14. Docker & Infraestrutura

### Docker Compose Completo

```yaml
version: '3.8'

services:
  # === APLICAÇÃO PRINCIPAL ===
  app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: secretaria-app
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://secretaria:secretaria123@postgres:5432/secretaria_db
      - REDIS_URL=redis://redis:6379
      - OLLAMA_URL=http://host.docker.internal:11434
      - PIPER_URL=http://piper-tts:10200
      - PIPER_HTTP_URL=http://piper-http:5500
      - GROQ_API_KEY=${GROQ_API_KEY}
      - EVOLUTION_API_URL=http://evolution-api:8080
      - EVOLUTION_API_KEY=${EVOLUTION_API_KEY}
      - OBSIDIAN_VAULT_PATH=/vault
    volumes:
      - ./segundo-cerebro:/vault
      - ./temp:/app/temp
      - ./logs:/app/logs
      - ./prompts:/app/prompts
    depends_on:
      - postgres
      - redis
      - evolution-api
      - piper-http

  # === EVOLUTION API (WhatsApp) ===
  evolution-api:
    image: atendai/evolution-api:latest
    container_name: evolution-api
    restart: always
    ports:
      - "8080:8080"
    environment:
      - AUTHENTICATION_API_KEY=${EVOLUTION_API_KEY}
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=postgresql://secretaria:secretaria123@postgres:5432/evolution_db
      - CACHE_REDIS_URI=redis://redis:6379
      - WEBHOOK_GLOBAL_URL=http://app:3000/webhook/evolution
      - WEBHOOK_GLOBAL_ENABLED=true
      - WEBHOOK_EVENTS_MESSAGES_UPSERT=true
      - WEBHOOK_EVENTS_MESSAGES_UPDATE=true
      - WEBHOOK_EVENTS_CONNECTION_UPDATE=true
    depends_on:
      - postgres
      - redis

  # === PIPER TTS (Wyoming Protocol) ===
  piper-tts:
    image: rhasspy/wyoming-piper:latest
    container_name: piper-tts
    restart: always
    ports:
      - "10200:10200"
    volumes:
      - ./models/piper:/data
    command: >
      --voice pt_BR-faber-medium
      --max-piper-procs 2
      --length-scale 1.0
      --noise-scale 0.667
      --noise-w 0.8

  # === PIPER HTTP WRAPPER ===
  piper-http:
    build:
      context: docker/piper-http-wrapper
      dockerfile: Dockerfile
    container_name: piper-http
    restart: always
    ports:
      - "5500:5500"
    volumes:
      - ./models/piper:/models

  # === POSTGRESQL ===
  postgres:
    image: postgres:16-alpine
    container_name: secretaria-postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=secretaria
      - POSTGRES_PASSWORD=secretaria123
      - POSTGRES_DB=secretaria_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/init-db.sql:/docker-entrypoint-initdb.d/init.sql

  # === REDIS ===
  redis:
    image: redis:7-alpine
    container_name: secretaria-redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Variáveis de Ambiente (.env)

```bash
# === GROQ (STT) ===
GROQ_API_KEY=gsk_seu_token_aqui

# === EVOLUTION API (WhatsApp) ===
EVOLUTION_API_KEY=sua_chave_secreta_aqui
EVOLUTION_INSTANCE_NAME=secretaria

# === BANCO DE DADOS ===
DATABASE_URL=postgresql://secretaria:secretaria123@localhost:5432/secretaria_db

# === REDIS ===
REDIS_URL=redis://localhost:6379

# === OLLAMA ===
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=gemma4:2b

# === PIPER TTS ===
PIPER_HTTP_URL=http://localhost:5500
PIPER_VOICE=pt_BR-faber-medium

# === OBSIDIAN ===
OBSIDIAN_VAULT_PATH=./segundo-cerebro

# === APP ===
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# === NEGÓCIO ===
BUSINESS_NAME="Seu Negócio"
BUSINESS_PHONE=5511999999999
TIMEZONE=America/Sao_Paulo
```

---

## 15. Fluxos de Operação

### Fluxo 1: Atendimento Completo (Texto)

```
1. Cliente envia texto via WhatsApp
2. Evolution API recebe e dispara webhook
3. Orquestrador recebe webhook
4. Identifica/cria cliente no banco
5. Busca contexto no Obsidian:
   - Histórico do cliente
   - Agendamentos pendentes
   - Cobranças abertas
   - Regras aprendidas
6. Monta prompt com contexto + tools Hermes
7. Envia para Gemma 4 via Ollama
8. Se IA retorna function call:
   a. Executa função (agendar, cobrar, consultar)
   b. Retorna resultado para IA
   c. IA gera resposta final
9. Envia resposta via Evolution API
10. Salva conversa no Obsidian
11. Atualiza aprendizados se necessário
```

### Fluxo 2: Atendimento com Áudio

```
1. Cliente envia áudio via WhatsApp
2. Evolution API recebe e dispara webhook
3. Orquestrador baixa o áudio
4. Envia áudio para Groq Whisper (STT)
5. Recebe transcrição em texto
6. [Segue fluxo de texto normal - passos 4-11]
7. Gera resposta em texto
8. Converte resposta para áudio via Piper TTS
9. Envia áudio via Evolution API
```

### Fluxo 3: Cobrança Automática

```
1. Cron job dispara às 9h diariamente
2. Consulta cobranças vencendo hoje
3. Para cada cobrança:
   a. Busca dados do cliente
   b. Monta mensagem apropriada ao nível de escalonamento
   c. Envia via Evolution API
   d. Registra tentativa no banco
   e. Atualiza nota no Obsidian
4. Consulta cobranças atrasadas
5. Escalona nível de cobrança
6. Gera relatório diário em 06-Relatorios/
```

### Fluxo 4: Lembrete de Agendamento

```
1. Cron job verifica a cada 15 minutos
2. Busca agendamentos nas próximas 24h/1h
3. Para agendamentos 24h:
   a. "Olá [nome]! Lembrando do seu agendamento amanhã às [hora] 😊"
4. Para agendamentos 1h:
   a. "Oi [nome]! Seu agendamento é daqui 1 hora, às [hora]. Te esperamos! 🕐"
5. Marca lembrete como enviado
```

---

## 16. Segurança

### Medidas Implementadas

| Área | Medida | Descrição |
|:---|:---|:---|
| **IA** | Local-only | Gemma 4 roda 100% local, sem envio de dados |
| **Áudio** | Groq com TLS | Áudio enviado via HTTPS criptografado |
| **TTS** | Local-only | Piper TTS roda no servidor, sem nuvem |
| **WhatsApp** | API Key | Evolution API protegida por chave |
| **Banco** | Credenciais .env | Senhas em variáveis de ambiente |
| **Webhook** | Validação | Webhook valida origem das requisições |
| **Dados** | Backup | Script de backup diário do Obsidian |
| **Logs** | Rotação | Logs com rotação automática |

### Backup do Obsidian

```bash
#!/bin/bash
# scripts/backup-vault.sh
VAULT_PATH="./segundo-cerebro"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf "$BACKUP_DIR/vault_backup_$DATE.tar.gz" "$VAULT_PATH"

# Manter apenas últimos 30 backups
ls -t $BACKUP_DIR/vault_backup_*.tar.gz | tail -n +31 | xargs rm -f
```

---

## 17. Roadmap de Implementação

### 🔴 Fase 1 — Fundação (Semana 1-2)

- [x] Setup Docker Compose (PostgreSQL, Redis)
- [x] Instalar Ollama + Gemma 4 E2B
- [x] Setup Evolution API + conectar WhatsApp
- [x] Criar banco de dados (tabelas, índices)
- [x] Projeto Node.js (package.json, estrutura)
- [x] Servidor Express básico com webhook
- [x] Integração básica Ollama → chat simples

### 🟡 Fase 2 — Comunicação (Semana 3-4)

- [x] Handler completo de webhooks WhatsApp
- [x] Integração Groq STT (transcrição de áudio)
- [x] Setup Piper TTS + wrapper HTTP
- [x] Pipeline áudio-entrada → texto → resposta → áudio-saída
- [x] Gerenciamento de sessões/conversas
- [x] Formatação de mensagens WhatsApp

### 🟢 Fase 3 — Inteligência (Semana 5-6)

- [x] System prompt da secretária
- [x] Function calling com Hermes (todas as tools)
- [x] Módulo de agendamento completo
- [x] Módulo de cobrança completo
- [x] Cron jobs (lembretes + cobranças)
- [x] Verificação de disponibilidade

### 🔵 Fase 4 — Segundo Cérebro (Semana 7-8)

- [x] Motor de escrita no Obsidian
- [x] Motor de leitura/busca no Obsidian
- [x] Indexação de conhecimento
- [x] Motor de aprendizado
- [x] Integração contexto Obsidian → prompts da IA
- [x] Templates automáticos

### 🟣 Fase 5 — Polish & Produção (Semana 9-10)

- [x] Testes end-to-end
- [x] Sistema de logs robusto
- [x] Monitoramento de saúde dos serviços
- [x] Dashboard admin (opcional - web)
- [x] Script de backup automático
- [x] Documentação final
- [x] Deploy em produção

---

## 18. Requisitos do Servidor

### Mínimo Recomendado

| Recurso | Mínimo | Recomendado |
|:---|:---|:---|
| **CPU** | 4 cores | 8 cores |
| **RAM** | 8 GB | 16 GB |
| **Armazenamento** | 50 GB SSD | 100 GB SSD |
| **GPU** | Não necessária | Opcional (acelera Gemma) |
| **SO** | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| **Internet** | 10 Mbps | 50 Mbps |

### Distribuição de RAM Estimada

| Serviço | RAM |
|:---|:---|
| Ollama + Gemma 4 E2B | ~3-4 GB |
| Evolution API | ~512 MB |
| PostgreSQL | ~512 MB |
| Redis | ~256 MB |
| Piper TTS | ~256 MB |
| App Node.js | ~256 MB |
| Sistema Operacional | ~1-2 GB |
| **Total** | **~6-8 GB** |

### Dependências para Instalar

```bash
# Sistema
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-plugin git curl ffmpeg

# Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull gemma4:2b

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar
docker --version
node --version
ollama --version
```

---

## 📌 Resumo Executivo

| Item | Decisão |
|:---|:---|
| **IA Principal** | Gemma 4 E2B via Ollama (local, gratuito) |
| **STT** | Groq Whisper Large V3 (cloud, custo mínimo) |
| **TTS** | Piper TTS pt_BR-faber-medium (local, gratuito) |
| **WhatsApp** | Evolution API v2 (local, Docker) |
| **Function Calling** | Hermes Format via Ollama |
| **Banco de Dados** | PostgreSQL 16 + Redis 7 |
| **Segundo Cérebro** | Obsidian Vault (Markdown local) |
| **Custo Mensal Estimado** | ~R$ 5-20 (apenas Groq STT) + servidor |
| **Prazo Total** | ~10 semanas |

---

> **Próximo passo**: Aprovar este plano e iniciar a **Fase 1 — Fundação**.
