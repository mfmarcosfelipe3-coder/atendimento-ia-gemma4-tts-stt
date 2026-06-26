class MessageFormatter {
  /**
   * Limpa formatações indesejadas do texto gerado pela IA e garante que
   * está em um formato agradável para o WhatsApp (ex: listas, negritos limitados)
   */
  formatForWhatsApp(text) {
    if (!text) return '';

    let formatted = text;

    // 1. A IA pode usar markdown muito intenso, vamos suavizar
    // Transforma títulos Markdown (# Titulo) em Negrito simples com quebra de linha
    formatted = formatted.replace(/^#+\s+(.*?)$/gm, '*$1*\n');

    // 2. Remove mais de duas quebras de linha seguidas
    formatted = formatted.replace(/\n{3,}/g, '\n\n');

    // 3. (Opcional) se a IA exagerar nos emojis, poderiamos ter uma função aqui para limitar.

    return formatted.trim();
  }
}

module.exports = new MessageFormatter();
