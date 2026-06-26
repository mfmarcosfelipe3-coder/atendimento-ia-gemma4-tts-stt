const { query } = require('../database/connection');
const logger = require('../utils/logger');
// const obsidianWriter = require('../memoria/obsidianWriter');
const { getFormattedNow } = require('../utils/dateHelper');

class ReportGenerator {
  /**
   * Gera o relatório diário de cobranças pendentes e atrasadas
   */
  async generateDailyBillingReport() {
    try {
      logger.info('Gerando relatório diário de cobranças');
      
      const sql = `
        SELECT status, COUNT(*) as count, SUM(amount) as total_value
        FROM invoices
        WHERE status IN ('pendente', 'atrasada')
        GROUP BY status
      `;
      const res = await query(sql);

      let reportText = `# Relatório Diário de Cobranças\nData: ${getFormattedNow()}\n\n`;
      let totalEmAberto = 0;

      for (const row of res.rows) {
        reportText += `- **${row.status.toUpperCase()}**: ${row.count} cobranças, totalizando R$${row.total_value}\n`;
        totalEmAberto += parseFloat(row.total_value);
      }

      reportText += `\n**Total Geral em Aberto**: R$${totalEmAberto}\n`;

      // 1. Salvar como artefato/nota no Obsidian
      // await obsidianWriter.saveReport('cobranca', `Relatorio-Cobranca-${Date.now()}`, reportText);

      return reportText;
    } catch (error) {
      logger.error('Erro ao gerar relatório diário de cobrança', error);
      throw error;
    }
  }
}

module.exports = new ReportGenerator();
