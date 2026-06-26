const axios = require('axios');
const config = require('../../config/default');
const logger = require('../utils/logger');

class MediaHandler {
  constructor() {
    this.baseUrl = config.evolution.apiUrl;
    this.apiKey = config.evolution.apiKey;
    this.instance = config.evolution.instanceName;
  }

  /**
   * Baixa uma mídia (áudio, imagem) recebida via Evolution API
   */
  async downloadMedia(messageObj) {
    try {
      const payload = {
        message: messageObj
      };

      // A API da Evolution tem um endpoint para baixar mídia em base64
      const response = await axios.post(
        `${this.baseUrl}/chat/getBase64FromMediaMessage/${this.instance}`,
        payload,
        {
          headers: {
            'apikey': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.base64) {
        const base64Data = response.data.base64;
        // Pega a string em base64 e converte pra Buffer
        // A evolution retorna no formato "data:audio/ogg;base64,..."
        const base64String = base64Data.split(',')[1] || base64Data;
        return Buffer.from(base64String, 'base64');
      }
      
      throw new Error('Formato de mídia não esperado');
    } catch (error) {
      logger.error('Erro ao baixar mídia da Evolution API', error.message);
      throw error;
    }
  }
}

module.exports = new MediaHandler();
