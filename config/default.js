require('dotenv').config();
const path = require('path');

module.exports = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    logLevel: process.env.LOG_LEVEL || 'info',
  },
  business: {
    name: process.env.BUSINESS_NAME || 'Secretária Inteligente',
    phone: process.env.BUSINESS_PHONE || '',
    timezone: process.env.TIMEZONE || 'America/Sao_Paulo',
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: 'whisper-large-v3',
  },
  evolution: {
    apiUrl: process.env.EVOLUTION_API_URL || 'http://localhost:8080',
    apiKey: process.env.EVOLUTION_API_KEY,
    instanceName: process.env.EVOLUTION_INSTANCE_NAME || 'secretaria',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  ollama: {
    url: process.env.OLLAMA_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'gemma4:2b',
  },
  piper: {
    httpUrl: process.env.PIPER_HTTP_URL || 'http://localhost:5500',
    voice: process.env.PIPER_VOICE || 'pt_BR-faber-medium',
  },
  obsidian: {
    vaultPath: path.resolve(process.cwd(), process.env.OBSIDIAN_VAULT_PATH || './segundo-cerebro'),
  },
  paths: {
    temp: path.resolve(process.cwd(), 'temp'),
    logs: path.resolve(process.cwd(), 'logs'),
    prompts: path.resolve(process.cwd(), 'prompts'),
  }
};
