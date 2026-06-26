const { createServer } = require('./api/server');
const config = require('../config/default');
const logger = require('./utils/logger');
// const orchestrator = require('./core/orchestrator');

async function bootstrap() {
  try {
    logger.info(`Iniciando Secretária Inteligente - Ambiente: ${config.app.env}`);

    // Inicializar servidor HTTP
    const app = createServer();
    
    app.listen(config.app.port, () => {
      logger.info(`Servidor HTTP escutando na porta ${config.app.port}`);
    });

    // Inicializar o Orquestrador
    // await orchestrator.initialize();
    
    logger.info('Sistema inicializado com sucesso.');
  } catch (error) {
    logger.error('Falha fatal na inicialização do sistema:', error);
    process.exit(1);
  }
}

// Lidar com exceções não tratadas
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

bootstrap();
