const config = require('../../config/default');

const MESSAGE_TYPES = {
  TEXT: 'text',
  AUDIO: 'audio',
  IMAGE: 'image',
  DOCUMENT: 'document',
};

const MESSAGE_DIRECTIONS = {
  IN: 'in',
  OUT: 'out',
};

const APPOINTMENT_STATUS = {
  AGENDADO: 'agendado',
  CONFIRMADO: 'confirmado',
  CANCELADO: 'cancelado',
  REALIZADO: 'realizado',
  NO_SHOW: 'no_show',
};

const INVOICE_STATUS = {
  PENDENTE: 'pendente',
  ENVIADA: 'enviada',
  PAGA: 'paga',
  ATRASADA: 'atrasada',
  CANCELADA: 'cancelada',
};

module.exports = {
  MESSAGE_TYPES,
  MESSAGE_DIRECTIONS,
  APPOINTMENT_STATUS,
  INVOICE_STATUS
};
