const { query } = require('../database/connection');
const logger = require('../utils/logger');
// const evolutionClient = require('../whatsapp/evolutionClient');
const cron = require('node-cron');

class ReminderEscalation {
  
  initializeCronJobs() {
    // Executar diariamente às 9h da manhã
    cron.schedule('0 9 * * *', async () => {
      logger.info('Executando rotina diária de cobranças');
      await this.processDueToday();
      await this.processOverdue();
    });
  }

  async processDueToday() {
    try {
      const sql = `
        SELECT i.id, i.amount, c.phone, c.name, a.service
        FROM invoices i
        JOIN clients c ON i.client_id = c.id
        LEFT JOIN appointments a ON i.appointment_id = a.id
        WHERE i.due_date = CURRENT_DATE AND i.status = 'pendente'
      `;
      const res = await query(sql);

      for (const inv of res.rows) {
        const msg = `Olá ${inv.name}! Lembrando que o pagamento de R$${inv.amount} referente a ${inv.service || 'serviços'} vence hoje. Precisa de algo? 😊`;
        
        // await evolutionClient.sendText(inv.phone, msg);
        logger.info(`Lembrete de vencimento hoje enviado para ${inv.phone}`);
      }
    } catch (error) {
      logger.error('Erro ao processar cobranças que vencem hoje', error);
    }
  }

  async processOverdue() {
    try {
      // 3 Dias após vencimento - Nível 1
      await this.escalateLevel(3, 1, (inv) => 
        `Oi ${inv.name}, tudo bem? Notei que o pagamento de R$${inv.amount} ainda está em aberto. Posso te ajudar com alguma forma de pagamento? 🙏`
      );

      // 7 Dias após vencimento - Nível 2
      await this.escalateLevel(7, 2, (inv) => 
        `${inv.name}, o pagamento de R$${inv.amount} está pendente. Gostaria de verificar se houve algum problema e como podemos resolver isso de forma amigável.`
      );

      // 15 Dias após - Nível 3 (Alerta severo)
      await this.escalateLevel(15, 3, (inv) => 
        `Olá ${inv.name}. Este é um aviso importante sobre o débito de R$${inv.amount} em aberto. Precisamos regularizar esta situação o quanto antes.`
      );
    } catch (error) {
      logger.error('Erro na rotina de escalonamento de atrasos', error);
    }
  }

  async escalateLevel(daysOverdue, targetLevel, messageGenerator) {
    const sql = `
      SELECT i.id, i.amount, c.phone, c.name
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      WHERE i.due_date = CURRENT_DATE - INTERVAL '${daysOverdue} days'
      AND i.status = 'pendente'
      AND i.escalation_level < $1
    `;
    const res = await query(sql, [targetLevel]);

    for (const inv of res.rows) {
      const msg = messageGenerator(inv);
      // await evolutionClient.sendText(inv.phone, msg);
      
      await query('UPDATE invoices SET escalation_level = $1, status = $2 WHERE id = $3', [targetLevel, 'atrasada', inv.id]);
      
      // Registrar log de escalonamento na tabela de lembretes (opicional na estrutura atual)
      logger.info(`Escalonamento Nível ${targetLevel} enviado para ${inv.phone}`);
    }
  }
}

module.exports = new ReminderEscalation();
