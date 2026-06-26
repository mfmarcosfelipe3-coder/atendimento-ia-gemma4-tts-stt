const axios = require('axios');
const config = require('../../config/default');
const logger = require('../utils/logger');

class PiperClient {
  constructor() {
    this.apiUrl = config.piper.httpUrl;
    this.voice = config.piper.voice;
  }

  /**
   * Sintetiza texto para áudio usando a API HTTP do Piper TTS
   * @param {string} text - Texto para falar
   * @returns {Promise<Buffer>} - Buffer do arquivo WAV resultante
   */
  async synthesize(text) {
    try {
      logger.debug(`Gerando áudio para texto: ${text.substring(0, 30)}...`);
      
      const response = await axios.post(`${this.apiUrl}/synthesize`, {
        text: text,
        voice: this.voice
      }, {
        responseType: 'arraybuffer' // Precisamos receber o binário do áudio
      });

      return Buffer.from(response.data);
    } catch (error) {
      logger.error('Erro ao gerar áudio no Piper TTS', error.message);
      throw error;
    }
  }
}

module.exports = new PiperClient();
