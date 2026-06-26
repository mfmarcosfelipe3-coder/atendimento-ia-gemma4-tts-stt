const fs = require('fs').promises;
const path = require('path');
const config = require('../../config/default');
const logger = require('../utils/logger');
const matter = require('gray-matter');
const obsidianWriter = require('./obsidianWriter');

class LearningEngine {
  /**
   * Salva um aprendizado gerado pela IA no segundo cérebro
   */
  async saveLearning(categoria, descricao, contexto) {
    try {
      let filename = 'regras-negocio';
      if (categoria === 'padrao_atendimento') filename = 'padroes-atendimento';
      if (categoria === 'preferencia_cliente') filename = 'preferencias-clientes';
      if (categoria === 'erro_correcao') filename = 'erros-e-correcoes';

      const fullPath = path.join(config.obsidian.vaultPath, '05-Aprendizados', `${filename}.md`);
      
      let existingContent = '';
      let frontmatter = { tags: ['aprendizado', categoria] };

      // Verifica se o arquivo existe para append
      const stat = await fs.stat(fullPath).catch(() => null);
      if (stat) {
        const fileData = await fs.readFile(fullPath, 'utf-8');
        const parsed = matter(fileData);
        existingContent = parsed.content;
        frontmatter = parsed.data;
      } else {
        existingContent = `# Aprendizados: ${filename.replace(/-/g, ' ')}\n\n`;
      }

      const newEntry = `
## ${new Date().toISOString().split('T')[0]} - Novo Aprendizado
**Descrição**: ${descricao}
**Contexto**: ${contexto || 'N/A'}
---
`;
      
      const newContent = existingContent + newEntry;
      
      await fs.writeFile(fullPath, matter.stringify(newContent, frontmatter), 'utf-8');
      
      logger.info(`Novo aprendizado salvo em ${filename}.md`);
      return { success: true, message: 'Aprendizado registrado.' };
    } catch (error) {
      logger.error('Erro na engine de aprendizado', error);
      throw error;
    }
  }
}

module.exports = new LearningEngine();
