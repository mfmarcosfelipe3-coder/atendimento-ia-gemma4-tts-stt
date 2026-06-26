const { query } = require('../database/connection');
const logger = require('../utils/logger');
// const evolutionClient = require('../whatsapp/evolutionClient');

class BillingService {
  /**
   * Consulta cobranças pendentes de um cliente via telefone
   */
  async getPendingInvoices(phone) {
    try {
      const sql = `
        SELECT i.id, i.amount, i.due_date, i.status, s.name as service_name
        FROM invoices i
        JOIN clients c ON i.client_id = c.id
        LEFT JOIN appointments a ON i.appointment_id = a.id
        LEFT JOIN services s ON a.service = s.name
        WHERE c.phone = $1 AND i.status IN ('pendente', 'atrasada')
        ORDER BY i.due_date ASC
      `;
      
      const res = await query(sql, [phone]);
      
      return {
        total_pendente: res.rowCount,
        cobrancas: res.rows
      };
    } catch (error) {
      logger.error('Erro ao consultar cobranças', error);
      throw error;
    }
  }

  /**
   * Marca uma cobrança como paga
   */
  async registerPayment(invoiceId, paymentMethod) {
    try {
      const sql = `
        UPDATE invoices 
        SET status = 'paga', payment_method = $1, paid_at = NOW()
        WHERE id = $2 
        RETURNING *
      `;
      
      const res = await query(sql, [paymentMethod, invoiceId]);
      
      if (res.rowCount === 0) {
        return { success: false, message: 'Cobrança não encontrada.' };
      }

      // Aqui poderíamos emitir evento EVENTS.PAYMENT_CONFIRMED para salvar no Obsidian
      
      return {
        success: true,
        message: 'Pagamento registrado com sucesso.',
        invoice: res.rows[0]
      };
    } catch (error) {
      logger.error('Erro ao registrar pagamento', error);
      throw error;
    }
  }
}

module.exports = new BillingService();
