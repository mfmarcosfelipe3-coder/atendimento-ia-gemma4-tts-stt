const express = require('express');
const { pool } = require('../../database/connection');
const ollamaClient = require('../../ai/ollamaClient');
// const evolutionClient = require('../../whatsapp/evolutionClient'); // se houvesse endpoint health no Evolution

const router = express.Router();

/**
 * Endpoint de monitoramento de saúde do sistema (Health Check)
 * Útil para saber se o BD, IA e outros serviços estão online.
 */
router.get('/', async (req, res) => {
  const healthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      api: 'up',
      database: 'down',
      ai_model: 'down'
    }
  };

  try {
    // 1. Checa banco de dados
    const dbRes = await pool.query('SELECT 1 as up');
    if (dbRes.rowCount === 1) {
      healthStatus.services.database = 'up';
    }

    // 2. Checa IA (Ollama)
    const isAiUp = await ollamaClient.checkHealth();
    if (isAiUp) {
      healthStatus.services.ai_model = 'up';
    }

    // Verifica status geral
    if (Object.values(healthStatus.services).includes('down')) {
      healthStatus.status = 'degraded';
      res.status(207).json(healthStatus);
    } else {
      res.status(200).json(healthStatus);
    }
    
  } catch (error) {
    healthStatus.status = 'error';
    healthStatus.error = error.message;
    res.status(500).json(healthStatus);
  }
});

module.exports = router;
