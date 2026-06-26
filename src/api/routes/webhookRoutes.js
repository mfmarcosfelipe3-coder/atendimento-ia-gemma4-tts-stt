const express = require('express');
const logger = require('../../utils/logger');
// const webhookHandler = require('../../whatsapp/webhookHandler');

const router = express.Router();

/**
 * Endpoint para receber Webhooks da Evolution API
 * A Evolution API envia POST requests para cá quando eventos ocorrem no WhatsApp (mensagens, status, etc)
 */
router.post('/evolution', async (req, res) => {
  try {
    const payload = req.body;
    
    // A Evolution API envia diferentes tipos de eventos, os mais comuns são "messages.upsert" e "connection.update"
    const event = payload.event;
    
    logger.debug(`Webhook recebido: ${event}`, { instance: payload.instance });

    // Responder rapidamente com 200 para a Evolution API não dar timeout
    res.status(200).json({ status: 'received' });

    // Processar assincronamente (Fire and Forget)
    if (event === 'messages.upsert') {
      // await webhookHandler.handleMessagesUpsert(payload.data);
      logger.info('Nova mensagem recebida processada (placeholder)');
    } else if (event === 'connection.update') {
      // await webhookHandler.handleConnectionUpdate(payload.data);
      logger.info('Status de conexão atualizado (placeholder)');
    }
  } catch (error) {
    logger.error('Erro ao processar webhook', error);
    // Já retornamos 200, então apenas logamos o erro
  }
});

module.exports = router;
