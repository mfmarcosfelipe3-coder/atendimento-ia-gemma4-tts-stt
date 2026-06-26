const logger = require('../utils/logger');
const calendarService = require('../agendamento/calendarService');
const scheduler = require('../agendamento/scheduler');
const billingService = require('../cobranca/billingService');

/**
 * Mapeamento das ferramentas (tools) para as funções reais do sistema
 */
const toolHandlers = {
  verificar_disponibilidade: async ({ data, hora }) => {
    return await calendarService.checkAvailability(data, hora);
  },
  
  listar_horarios_disponiveis: async ({ data }) => {
    return await calendarService.getAvailableSlots(data);
  },
  
  criar_agendamento: async (params) => {
    return await scheduler.createAppointment(params);
  },
  
  cancelar_agendamento: async ({ agendamento_id, motivo }) => {
    return await scheduler.cancelAppointment(agendamento_id, motivo);
  },
  
  consultar_cobranca: async ({ cliente_telefone }) => {
    return await billingService.getPendingInvoices(cliente_telefone);
  },
  
  registrar_pagamento: async ({ cobranca_id, forma_pagamento }) => {
    return await billingService.registerPayment(cobranca_id, forma_pagamento);
  }
};

class FunctionCaller {
  /**
   * Executa a function call retornada pelo modelo de IA
   * @param {Object} toolCall - Objeto gerado pelo modelo via formatação Hermes
   * @returns {Promise<Object>} - O resultado da execução
   */
  async executeFunctionCall(toolCall) {
    try {
      // Ollama/Hermes podem enviar o objeto com estruturas levemente diferentes dependendo da versão
      const functionObj = toolCall.function || toolCall; 
      const name = functionObj.name;
      
      // Argumentos podem vir como string JSON ou objeto parseado
      let args = functionObj.arguments;
      if (typeof args === 'string') {
        try {
          args = JSON.parse(args);
        } catch (e) {
          logger.warn(`Argumentos não puderam ser parseados: ${args}`);
        }
      }

      logger.info(`Executando Function Call: ${name}`, args);

      const handler = toolHandlers[name];
      if (!handler) {
        throw new Error(`Tool não encontrada no sistema: ${name}`);
      }

      const result = await handler(args);
      logger.debug(`Resultado da Function Call ${name}:`, result);
      
      return {
        success: true,
        result: result
      };

    } catch (error) {
      logger.error('Erro ao executar Function Call', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new FunctionCaller();
