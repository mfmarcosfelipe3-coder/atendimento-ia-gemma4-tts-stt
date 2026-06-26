const logger = require('../utils/logger');
const { eventBus, EVENTS } = require('../core/eventBus');
const mediaHandler = require('./mediaHandler');
const { MESSAGE_TYPES } = require('../utils/constants');

class WebhookHandler {
  
  async handleMessagesUpsert(data) {
    if (!data.messages || data.messages.length === 0) return;

    for (const msg of data.messages) {
      // Ignorar mensagens enviadas pelo próprio bot ou de status
      if (msg.key.fromMe) continue;
      
      const remoteJid = msg.key.remoteJid;
      if (remoteJid === 'status@broadcast' || remoteJid.includes('@g.us')) continue; // Ignora status e grupos por enquanto

      const pushName = msg.pushName || 'Cliente';
      
      try {
        const messageType = Object.keys(msg.message)[0]; // textMessage, audioMessage, imageMessage, etc
        
        let extractedText = '';
        let type = MESSAGE_TYPES.TEXT;
        let audioData = null;

        if (messageType === 'conversation' || messageType === 'extendedTextMessage') {
          // Mensagem de texto normal
          extractedText = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        } 
        else if (messageType === 'audioMessage') {
          // Mensagem de áudio
          type = MESSAGE_TYPES.AUDIO;
          // Precisamos baixar o áudio base64 da Evolution API
          audioData = await mediaHandler.downloadMedia(msg);
        } else {
          logger.info(`Tipo de mensagem não suportado ainda: ${messageType}`);
          continue;
        }

        const payload = {
          from: remoteJid.replace('@s.whatsapp.net', ''),
          pushName,
          text: extractedText,
          type,
          audioData,
          messageId: msg.key.id,
          timestamp: msg.messageTimestamp
        };

        if (type === MESSAGE_TYPES.AUDIO) {
          eventBus.emit(EVENTS.AUDIO_RECEIVED, payload);
        } else {
          eventBus.emit(EVENTS.MESSAGE_RECEIVED, payload);
        }

      } catch (error) {
        logger.error('Erro ao processar mensagem do webhook', error);
      }
    }
  }
}

module.exports = new WebhookHandler();
