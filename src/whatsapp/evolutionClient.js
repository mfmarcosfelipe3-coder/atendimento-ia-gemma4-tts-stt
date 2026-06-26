const axios = require('axios');
const config = require('../../config/default');
const logger = require('../utils/logger');

class EvolutionClient {
  constructor() {
    this.baseUrl = config.evolution.apiUrl;
    this.apiKey = config.evolution.apiKey;
    this.instance = config.evolution.instanceName;

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'apikey': this.apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Envia uma mensagem de texto
   */
  async sendText(number, text) {
    try {
      const payload = {
        number: number,
        options: {
          delay: 1200,
          presence: 'composing',
        },
        textMessage: {
          text: text
        }
      };
      
      const response = await this.client.post(`/message/sendText/${this.instance}`, payload);
      logger.debug('Mensagem de texto enviada', { number });
      return response.data;
    } catch (error) {
      logger.error('Erro ao enviar mensagem via Evolution API', error.message);
      throw error;
    }
  }

  /**
   * Envia um áudio (voice note)
   */
  async sendAudio(number, audioBase64) {
    try {
      const payload = {
        number: number,
        options: {
          delay: 1200,
          presence: 'recording',
        },
        audioMessage: {
          audio: audioBase64
        }
      };
      
      const response = await this.client.post(`/message/sendWhatsAppAudio/${this.instance}`, payload);
      logger.debug('Mensagem de áudio enviada', { number });
      return response.data;
    } catch (error) {
      logger.error('Erro ao enviar áudio via Evolution API', error.message);
      throw error;
    }
  }
}

module.exports = new EvolutionClient();
