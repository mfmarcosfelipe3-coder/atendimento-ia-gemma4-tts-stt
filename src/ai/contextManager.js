const logger = require('../utils/logger');
// const obsidianReader = require('../memoria/obsidianReader');
const { query } = require('../database/connection');

class ContextManager {
  /**
   * Agrupa informações de várias fontes para compor o contexto da IA
   */
  async gatherContext(phoneNumber, pushName = null) {
    try {
      const context = {
        phone: phoneNumber,
        name: pushName,
        clientInfo: '',
        learnings: '',
      };

      // 1. Verificar se o cliente existe no banco de dados relacional
      const res = await query('SELECT * FROM clients WHERE phone = $1', [phoneNumber]);
      
      if (res.rowCount > 0) {
        const client = res.rows[0];
        context.name = client.name;
        
        // 2. Buscar contexto rico no Obsidian (2º Cérebro)
        // const vaultContext = await obsidianReader.getClientContext(phoneNumber);
        // context.clientInfo = vaultContext.summary;
        // context.learnings = vaultContext.learnings;
        
        // Placeholder até o ObsidianWriter estar pronto:
        context.clientInfo = `Cliente conhecido: ${client.name}. Preferência de pagamento: ${client.payment_preference || 'Não definida'}`;
      } else {
        // Cliente novo
        context.clientInfo = `Cliente novo. Nome no WhatsApp: ${pushName || 'Desconhecido'}. Obtenha o nome e serviços de interesse.`;
      }

      return context;
    } catch (error) {
      logger.error(`Erro ao obter contexto para ${phoneNumber}`, error);
      return {
        phone: phoneNumber,
        clientInfo: 'Erro ao buscar contexto. Prossiga com atendimento normal.',
        learnings: ''
      };
    }
  }
}

module.exports = new ContextManager();
