const fs = require('fs').promises;
const path = require('path');
const config = require('../../config/default');
const logger = require('../utils/logger');
const matter = require('gray-matter');

class ObsidianWriter {
  constructor() {
    this.vaultPath = config.obsidian.vaultPath;
  }

  /**
   * Helper genérico para escrever uma nota
   */
  async writeNote(folder, filename, frontmatter, body) {
    try {
      const fullPath = path.join(this.vaultPath, folder, `${filename}.md`);
      const fileContent = matter.stringify(body, frontmatter);
      
      await fs.writeFile(fullPath, fileContent, 'utf-8');
      logger.debug(`Nota criada/atualizada em: ${folder}/${filename}.md`);
      return fullPath;
    } catch (error) {
      logger.error('Erro ao escrever nota no Obsidian', error);
      throw error;
    }
  }

  async createAppointmentNote(appointment) {
    const frontmatter = {
      cliente: appointment.client_name || '',
      data: appointment.date,
      hora: appointment.start_time,
      servico: appointment.service,
      status: appointment.status,
      valor: appointment.price || 0,
      tags: ['agendamento']
    };
    
    const body = `
# Agendamento - ${appointment.id}

## Detalhes
- **Cliente**: [[${appointment.client_name || 'Desconhecido'}]]
- **Data**: ${appointment.date}
- **Hora**: ${appointment.start_time}
- **Serviço**: ${appointment.service}
- **Valor**: R$ ${appointment.price}

## Status
- [ ] Confirmado com cliente
- [ ] Realizado
- [ ] Cobrança gerada
`;

    return await this.writeNote('02-Agendamentos', `Agendamento-${appointment.id}`, frontmatter, body);
  }

  async updateInvoiceNote(invoiceId, status) {
    const filename = `Cobranca-${invoiceId}`;
    const fullPath = path.join(this.vaultPath, '03-Cobrancas', `${filename}.md`);
    
    try {
      // Verifica se a nota existe
      const stat = await fs.stat(fullPath).catch(() => null);
      if (stat) {
        const content = await fs.readFile(fullPath, 'utf-8');
        const parsed = matter(content);
        
        parsed.data.status = status;
        
        if (status === 'paga') {
          parsed.content += `\n\n**Atualização**: Pagamento confirmado em ${new Date().toISOString()}`;
        }
        
        await fs.writeFile(fullPath, matter.stringify(parsed.content, parsed.data), 'utf-8');
      }
    } catch (error) {
      logger.error('Erro ao atualizar nota de cobrança', error);
    }
  }

  async saveConversationLog(conversationData) {
    const frontmatter = {
      cliente: conversationData.clientName,
      data: new Date().toISOString().split('T')[0],
      canal: 'whatsapp',
      sentimento: conversationData.sentiment || 'neutro',
      tags: ['conversa']
    };
    
    const body = `
# Conversa com ${conversationData.clientName}

## Resumo
${conversationData.summary}

## Ações Tomadas
${conversationData.actions.map(a => `- ${a}`).join('\n')}
`;
    
    const filename = `${conversationData.clientName}-${Date.now()}`.replace(/[^a-z0-9]/gi, '_');
    return await this.writeNote('04-Conversas', filename, frontmatter, body);
  }

  async saveReport(type, filename, reportText) {
    const frontmatter = {
      tipo: type,
      data: new Date().toISOString().split('T')[0],
      tags: ['relatorio']
    };
    return await this.writeNote('06-Relatorios', filename, frontmatter, reportText);
  }
}

module.exports = new ObsidianWriter();
