const logger = require('../utils/logger');
// const sessionManager = require('./sessionManager');
// const promptBuilder = require('../ai/promptBuilder');
// const ollamaClient = require('../ai/ollamaClient');
// const evolutionClient = require('../whatsapp/evolutionClient');
// const contextManager = require('../ai/contextManager');

class MessageRouter {
  async routeMessage(messageData) {
    const { from, text, pushName } = messageData;
    logger.info(`Roteando mensagem de ${from}: ${text.substring(0, 50)}...`);

    try {
      // // 1. Registrar mensagem na sessão
      // await sessionManager.addMessageToSession(from, 'user', text);
      
      // // 2. Coletar contexto (Banco de dados + Obsidian)
      // const context = await contextManager.gatherContext(from, pushName);
      
      // // 3. Construir prompt do sistema
      // const systemPrompt = await promptBuilder.buildSystemPrompt(context);
      
      // // 4. Obter histórico da sessão
      // const session = await sessionManager.getSession(from);
      
      // // 5. Montar payload para IA
      // const messages = [
      //   { role: 'system', content: systemPrompt },
      //   ...session.messages.map(m => ({ role: m.role, content: m.content }))
      // ];
      
      // // 6. Enviar para Gemma 4 via Ollama
      // const aiResponse = await ollamaClient.chat(messages);
      
      // // 7. Tratar a resposta (Aqui teremos o Function Calling futuramente)
      // const replyText = aiResponse.content;
      
      // // 8. Enviar resposta para o WhatsApp
      // await evolutionClient.sendText(from, replyText);
      
      // // 9. Adicionar resposta à sessão
      // await sessionManager.addMessageToSession(from, 'assistant', replyText);

      // Log placeholder
      logger.debug('Fluxo de roteamento concluído (mock)');
    } catch (error) {
      logger.error('Erro no roteamento de mensagem', error);
      // await evolutionClient.sendText(from, "Desculpe, tive um problema técnico. Pode repetir?");
    }
  }
}

module.exports = new MessageRouter();
