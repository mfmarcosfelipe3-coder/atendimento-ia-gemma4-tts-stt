const fs = require('fs').promises;
const path = require('path');
const config = require('../../config/default');
const logger = require('../utils/logger');
const matter = require('gray-matter');

class ObsidianReader {
  constructor() {
    this.vaultPath = config.obsidian.vaultPath;
  }

  /**
   * Pega o contexto completo do cliente compilando várias notas
   */
  async getClientContext(phoneNumber) {
    try {
      // No mundo real, usaríamos o searchEngine para encontrar a nota do cliente exata,
      // aqui faremos um fluxo simples.
      let context = {
        summary: '',
        learnings: ''
      };

      const clientsPath = path.join(this.vaultPath, '01-Clientes');
      const files = await fs.readdir(clientsPath).catch(() => []);
      
      for (const file of files) {
        if (!file.endsWith('.md')) continue;
        
        const content = await fs.readFile(path.join(clientsPath, file), 'utf-8');
        const parsed = matter(content);
        
        // Verifica se é a nota do cliente
        if (parsed.data.telefone && parsed.data.telefone.includes(phoneNumber)) {
          context.summary = `
Cliente: ${parsed.data.nome}
Preferência de Horário: ${parsed.data.preferencia_horario || 'Não definida'}
Forma de Pagamento: ${parsed.data.forma_pagamento || 'Não definida'}
Observações: ${parsed.data.observacoes || 'Nenhuma'}
          `.trim();
          break;
        }
      }

      // Buscar aprendizados globais
      const learningsPath = path.join(this.vaultPath, '05-Aprendizados', 'regras-negocio.md');
      const learningsStat = await fs.stat(learningsPath).catch(() => null);
      
      if (learningsStat) {
        const learnContent = await fs.readFile(learningsPath, 'utf-8');
        context.learnings = matter(learnContent).content;
      }

      return context;
    } catch (error) {
      logger.error('Erro ao ler contexto do Obsidian', error);
      return { summary: 'Contexto indisponível no Obsidian', learnings: '' };
    }
  }
}

module.exports = new ObsidianReader();
