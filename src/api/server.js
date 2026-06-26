const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('../../config/default');
const logger = require('../utils/logger');

// Rotas
const webhookRoutes = require('./routes/webhookRoutes');
const healthRoutes = require('./routes/healthRoutes');

const createServer = () => {
  const app = express();

  // Segurança básica
  app.use(helmet());
  
  // CORS
  app.use(cors());

  // Rate Limiting para a API pública
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite por IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Muitas requisições, tente novamente mais tarde.' }
  });
  app.use('/api', limiter);

  // Parsing (Para capturar JSON e URL-encoded. Limite aumentado para áudio se vier no body)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Middleware de Log de Requisições
  app.use((req, res, next) => {
    logger.debug(`[HTTP] ${req.method} ${req.url}`);
    next();
  });

  // Rotas
  app.use('/api/webhook', webhookRoutes);
  app.use('/health', healthRoutes);

  // Rota raiz
  app.get('/', (req, res) => {
    res.json({ message: 'Secretária Inteligente API rodando' });
  });

  // Handler de Erros
  app.use((err, req, res, next) => {
    logger.error('Erro não tratado na API', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  });

  return app;
};

module.exports = { createServer };
