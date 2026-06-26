const logger = require('../utils/logger');
const { eventBus, EVENTS } = require('./eventBus');
// const messageRouter = require('./messageRouter');
// const scheduler = require('../agendamento/scheduler');
// const billingService = require('../cobranca/billingService');

class Orchestrator {
  constructor() {
    this.initialized = false;
  }

  /**
   * Inicializa o orquestrador e inscreve nos eventos principais
   */
  async initialize() {
    if (this.initialized) return;

    logger.info('Inicializando Orquestrador...');

    this.setupEventListeners();
    
    // Inicializar crons
    // scheduler.initializeCronJobs();
    // billingService.initializeCronJobs();

    this.initialized = true;
    logger.info('Orquestrador inicializado com sucesso.');
  }

  setupEventListeners() {
    eventBus.on(EVENTS.MESSAGE_RECEIVED, async (messageData) => {
      try {
        // await messageRouter.routeMessage(messageData);
        logger.debug('Evento MESSAGE_RECEIVED capturado pelo Orquestrador', { messageData });
      } catch (error) {
        logger.error('Erro ao rotear mensagem', error);
      }
    });

    eventBus.on(EVENTS.AUDIO_RECEIVED, async (audioData) => {
      try {
        logger.debug('Evento AUDIO_RECEIVED capturado pelo Orquestrador');
        // 1. Processa áudio (STT)
        // 2. Converte para texto
        // 3. Emite MESSAGE_RECEIVED simulando que o usuário mandou texto
      } catch (error) {
        logger.error('Erro ao processar áudio', error);
      }
    });

    eventBus.on(EVENTS.SYSTEM_ERROR, (error) => {
      logger.error('Erro crítico capturado pelo EventBus', error);
    });
  }
}

module.exports = new Orchestrator();
