/**
 * Limpa e valida um número de telefone para o padrão WhatsApp (DDI + DDD + Número)
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  // Remove tudo que não for número
  const cleaned = phone.replace(/\D/g, '');
  // Adiciona 55 se não tiver
  if (cleaned.length === 10 || cleaned.length === 11) {
    return `55${cleaned}`;
  }
  return cleaned;
};

/**
 * Valida se é um número de telefone plausível
 */
const isValidPhone = (phone) => {
  const cleaned = formatPhoneNumber(phone);
  return cleaned && cleaned.length >= 12 && cleaned.length <= 13;
};

module.exports = {
  formatPhoneNumber,
  isValidPhone
};
