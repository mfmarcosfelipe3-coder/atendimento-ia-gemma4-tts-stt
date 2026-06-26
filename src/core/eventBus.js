const EventEmitter = require('events');

class EventBus extends EventEmitter {}

// Singleton para o barramento de eventos
const eventBus = new EventBus();

// Definindo constantes de eventos
const EVENTS = {
  MESSAGE_RECEIVED: 'MESSAGE_RECEIVED',
  MESSAGE_SENT: 'MESSAGE_SENT',
  AUDIO_RECEIVED: 'AUDIO_RECEIVED',
  APPOINTMENT_CREATED: 'APPOINTMENT_CREATED',
  APPOINTMENT_CANCELLED: 'APPOINTMENT_CANCELLED',
  INVOICE_GENERATED: 'INVOICE_GENERATED',
  PAYMENT_CONFIRMED: 'PAYMENT_CONFIRMED',
  SYSTEM_ERROR: 'SYSTEM_ERROR',
};

module.exports = {
  eventBus,
  EVENTS
};
