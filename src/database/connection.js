const { Pool } = require('pg');
const config = require('../../config/default');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: config.database.url,
  // Opções para garantir reconexão e limites adequados
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err, client) => {
  logger.error('Erro inesperado no cliente PostgreSQL', err);
});

pool.on('connect', () => {
  logger.debug('Novo cliente conectado ao PostgreSQL');
});

/**
 * Executa uma query no banco de dados
 * @param {string} text - A query SQL
 * @param {Array} params - Parâmetros da query
 * @returns {Promise<any>}
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Query executada', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    logger.error('Erro ao executar query', { text, error: err.message });
    throw err;
  }
};

/**
 * Retorna um cliente do pool (útil para transações)
 */
const getClient = () => {
  return pool.connect();
};

module.exports = {
  query,
  getClient,
  pool
};
