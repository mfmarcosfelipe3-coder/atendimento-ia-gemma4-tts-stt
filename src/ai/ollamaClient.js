const axios = require('axios');
const config = require('../../config/default');
const logger = require('../utils/logger');

class OllamaClient {
  constructor() {
    this.baseUrl = config.ollama.url;
    this.model = config.ollama.model;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 60000, // 60 segundos
    });
  }

  /**
   * Envia uma mensagem para o modelo e retorna a resposta
   * @param {Array} messages - Histórico de mensagens no formato [{role: 'user', content: '...'}]
   * @param {Array} tools - (Opcional) Ferramentas para function calling no formato Hermes
   */
  async chat(messages, tools = null) {
    try {
      const payload = {
        model: this.model,
        messages: messages,
        stream: false,
        options: {
          temperature: 0.3, // Temperatura baixa para respostas mais determinísticas (secretária)
          num_ctx: 8192,
        }
      };

      if (tools && tools.length > 0) {
        // Ollama suporta tools nativamente nas versões recentes
        payload.tools = tools;
      }

      logger.debug('Enviando requisição para Ollama', { model: this.model, messageCount: messages.length });
      
      const response = await this.client.post('/api/chat', payload);
      
      return response.data.message;
    } catch (error) {
      logger.error('Erro ao comunicar com Ollama', error.message);
      throw error;
    }
  }

  /**
   * Verifica se o modelo está carregado/disponível
   */
  async checkHealth() {
    try {
      const response = await this.client.get('/api/tags');
      const models = response.data.models || [];
      return models.some(m => m.name === this.model || m.name === `${this.model}:latest`);
    } catch (error) {
      logger.error('Ollama não está acessível', error.message);
      return false;
    }
  }
}

module.exports = new OllamaClient();
