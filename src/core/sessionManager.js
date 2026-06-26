const Redis = require('ioredis');
const config = require('../../config/default');
const logger = require('../utils/logger');

class SessionManager {
  constructor() {
    this.redis = new Redis(config.redis.url);
    this.SESSION_PREFIX = 'session:';
    this.SESSION_TTL = 3600; // Sessão expira em 1 hora de inatividade
  }

  /**
   * Obtém a sessão de um cliente pelo número
   */
  async getSession(phoneNumber) {
    const key = `${this.SESSION_PREFIX}${phoneNumber}`;
    try {
      const data = await this.redis.get(key);
      if (data) {
        // Renova o TTL da sessão ao acessar
        await this.redis.expire(key, this.SESSION_TTL);
        return JSON.parse(data);
      }
      return this.createSession(phoneNumber);
    } catch (error) {
      logger.error(`Erro ao obter sessão para ${phoneNumber}`, error);
      return this.createSession(phoneNumber);
    }
  }

  /**
   * Cria uma nova sessão vazia
   */
  createSession(phoneNumber) {
    return {
      phoneNumber,
      messages: [],
      startTime: new Date().toISOString(),
      metadata: {}
    };
  }

  /**
   * Atualiza a sessão no Redis
   */
  async updateSession(phoneNumber, sessionData) {
    const key = `${this.SESSION_PREFIX}${phoneNumber}`;
    try {
      await this.redis.setex(key, this.SESSION_TTL, JSON.stringify(sessionData));
    } catch (error) {
      logger.error(`Erro ao atualizar sessão para ${phoneNumber}`, error);
    }
  }

  /**
   * Adiciona uma mensagem ao histórico da sessão
   */
  async addMessageToSession(phoneNumber, role, content) {
    const session = await this.getSession(phoneNumber);
    session.messages.push({ role, content, timestamp: new Date().toISOString() });
    
    // Manter no máximo as últimas 20 interações na sessão ativa 
    // (para não estourar contexto, histórico longo vai pro Obsidian)
    if (session.messages.length > 20) {
      session.messages = session.messages.slice(-20);
    }
    
    await this.updateSession(phoneNumber, session);
    return session;
  }

  /**
   * Limpa a sessão
   */
  async clearSession(phoneNumber) {
    const key = `${this.SESSION_PREFIX}${phoneNumber}`;
    await this.redis.del(key);
  }
}

module.exports = new SessionManager();
