const fs = require('fs').promises;
const path = require('path');
const config = require('../../config/default');
const { getFormattedNow } = require('../utils/dateHelper');

class PromptBuilder {
  constructor() {
    this.promptsDir = config.paths.prompts;
    this.cache = {};
  }

  async loadTemplate(templateName) {
    if (this.cache[templateName]) {
      return this.cache[templateName];
    }
    
    const filePath = path.join(this.promptsDir, `${templateName}.md`);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      this.cache[templateName] = content;
      return content;
    } catch (error) {
      throw new Error(`Template de prompt não encontrado: ${templateName}`);
    }
  }

  /**
   * Constrói o prompt do sistema com variáveis injetadas
   */
  async buildSystemPrompt(context) {
    let template = await this.loadTemplate('system-prompt');
    
    // Injeção de variáveis base
    template = template.replace('{{business_name}}', config.business.name);
    template = template.replace('{{current_time}}', getFormattedNow());
    template = template.replace('{{client_phone}}', context.phone || 'Desconhecido');
    
    // Injeção de contexto do Obsidian
    const clientInfo = context.clientInfo || 'Cliente novo. Nenhuma informação prévia.';
    template = template.replace('{{client_context}}', clientInfo);
    
    const learnings = context.learnings || 'Nenhum aprendizado específico no momento.';
    template = template.replace('{{learnings}}', learnings);
    
    return template;
  }
}

module.exports = new PromptBuilder();
