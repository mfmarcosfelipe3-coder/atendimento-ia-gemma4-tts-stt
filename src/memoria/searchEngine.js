const fs = require('fs').promises;
const path = require('path');
const config = require('../../config/default');
const logger = require('../utils/logger');

class SearchEngine {
  /**
   * Busca simples de texto nos arquivos do Obsidian (Pode ser evoluído para Embeddings/VectorDB depois)
   */
  async search(queryText, specificFolder = null) {
    try {
      const searchDir = specificFolder 
        ? path.join(config.obsidian.vaultPath, specificFolder) 
        : config.obsidian.vaultPath;
        
      const results = [];
      await this._searchRecursive(searchDir, queryText.toLowerCase(), results);
      
      return results;
    } catch (error) {
      logger.error('Erro na busca do Obsidian', error);
      return [];
    }
  }

  async _searchRecursive(currentPath, queryLower, results) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      // Ignorar pastas ocultas (como .obsidian)
      if (entry.name.startsWith('.')) continue;
      
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        await this._searchRecursive(fullPath, queryLower, results);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const content = await fs.readFile(fullPath, 'utf-8');
        if (content.toLowerCase().includes(queryLower)) {
          results.push({
            file: entry.name,
            path: fullPath,
            // Trecho para contexto rápido
            snippet: content.substring(0, 200) + '...'
          });
        }
      }
    }
  }
}

module.exports = new SearchEngine();
