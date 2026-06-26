const axios = require('axios');
const FormData = require('form-data');
const config = require('../../config/default');
const logger = require('../utils/logger');

class GroqClient {
  constructor() {
    this.apiKey = config.groq.apiKey;
    this.model = config.groq.model;
    this.apiUrl = 'https://api.groq.com/openai/v1/audio/transcriptions';
  }

  /**
   * Envia um arquivo de áudio para a API do Groq e retorna o texto transcrito
   * @param {Buffer} audioBuffer - Buffer do áudio
   * @param {string} filename - Nome original do arquivo com extensão
   */
  async transcribe(audioBuffer, filename) {
    try {
      logger.debug(`Iniciando transcrição de áudio: ${filename}`);
      
      const formData = new FormData();
      formData.append('file', audioBuffer, filename);
      formData.append('model', this.model);
      formData.append('language', 'pt'); // Força português
      formData.append('response_format', 'json');

      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          ...formData.getHeaders()
        }
      });

      logger.debug('Transcrição concluída', { textPreview: response.data.text.substring(0, 50) });
      return response.data.text;
    } catch (error) {
      logger.error('Erro na transcrição de áudio via Groq', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new GroqClient();
