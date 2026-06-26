const { query } = require('../database/connection');
const logger = require('../utils/logger');
// const evolutionClient = require('../whatsapp/evolutionClient');
const cron = require('node-cron');
const { getFormattedNow } = require('../utils/dateHelper');

class ReminderService {
  /**
   * Inicializa as rotinas cron para envio de lembretes
   */
  initializeCronJobs() {
    // Roda a cada hora no minuto 0 (Lembrete de 24h)
    cron.schedule('0 * * * *', async () => {
      logger.info('Executando job de lembretes de 24h');
      await this.send24hReminders();
    });

    // Roda a cada 15 minutos (Lembrete de 1h)
    cron.schedule('*/15 * * * *', async () => {
      logger.info('Executando job de lembretes de 1h');
      await this.send1hReminders();
    });
  }

  async send24hReminders() {
    try {
      // Buscar agendamentos do dia seguinte (simplificado)
      const sql = `
        SELECT a.id, a.date, a.start_time, c.phone, c.name, a.service 
        FROM appointments a
        JOIN clients c ON a.client_id = c.id
        WHERE a.date = CURRENT_DATE + INTERVAL '1 day'
        AND a.status = 'agendado'
        AND a.reminder_24h_sent = false
      `;
      const res = await query(sql, []);

      for (const apt of res.rows) {
        const msg = `Olá ${apt.name}! Passando para lembrar do seu agendamento de ${apt.service} amanhã às ${apt.start_time.substring(0, 5)}. Confirma sua presença? 😊`;
        
        // Enviar via whatsapp (mock)
        // await evolutionClient.sendText(apt.phone, msg);
        logger.info(`Lembrete 24h enviado para ${apt.phone}`);

        // Marcar como enviado
        await query('UPDATE appointments SET reminder_24h_sent = true WHERE id = $1', [apt.id]);
      }
    } catch (error) {
      logger.error('Erro no job de lembretes 24h', error);
    }
  }

  async send1hReminders() {
    try {
      // Simplificado: Busca agendamentos de hoje cuja hora de inicio esteja entre agora e +1h15m
      const sql = `
        SELECT a.id, a.date, a.start_time, c.phone, c.name, a.service 
        FROM appointments a
        JOIN clients c ON a.client_id = c.id
        WHERE a.date = CURRENT_DATE
        AND a.status IN ('agendado', 'confirmado')
        AND a.reminder_1h_sent = false
        AND a.start_time > CURRENT_TIME
        AND a.start_time <= CURRENT_TIME + INTERVAL '1 hour 15 minutes'
      `;
      const res = await query(sql, []);

      for (const apt of res.rows) {
        const msg = `Oi ${apt.name}! Seu agendamento de ${apt.service} é daqui a pouco, às ${apt.start_time.substring(0, 5)}. Te esperamos! 🕐`;
        
        // await evolutionClient.sendText(apt.phone, msg);
        logger.info(`Lembrete 1h enviado para ${apt.phone}`);

        await query('UPDATE appointments SET reminder_1h_sent = true WHERE id = $1', [apt.id]);
      }
    } catch (error) {
      logger.error('Erro no job de lembretes 1h', error);
    }
  }
}

module.exports = new ReminderService();
