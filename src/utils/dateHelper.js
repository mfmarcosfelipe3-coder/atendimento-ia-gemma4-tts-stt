const { format, parseISO, isValid, addDays, subDays } = require('date-fns');
const { ptBR } = require('date-fns/locale');
const { formatInTimeZone, toZonedTime } = require('date-fns-tz');
const config = require('../../config/default');

const TIMEZONE = config.business.timezone;

/**
 * Retorna a data/hora atual no timezone configurado
 */
const getNow = () => {
  return new Date();
};

/**
 * Retorna a data/hora atual formatada para leitura humana no timezone local
 */
const getFormattedNow = () => {
  return formatInTimeZone(getNow(), TIMEZONE, "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
};

/**
 * Formata uma data para o padrão do banco (YYYY-MM-DD)
 */
const toDbDate = (date) => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Verifica se uma string de data é válida
 */
const isValidDate = (dateString) => {
  const parsed = parseISO(dateString);
  return isValid(parsed);
};

module.exports = {
  getNow,
  getFormattedNow,
  toDbDate,
  isValidDate,
  TIMEZONE
};
