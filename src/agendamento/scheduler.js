const { query } = require('../database/connection');
const logger = require('../utils/logger');
// const obsidianWriter = require('../memoria/obsidianWriter');
const { eventBus, EVENTS } = require('../core/eventBus');

class Scheduler {
  /**
   * Cria um agendamento no banco de dados e sincroniza com o Obsidian
   */
  async createAppointment({ cliente_telefone, data, hora, servico, valor }) {
    logger.info(`Tentando criar agendamento para ${cliente_telefone} no dia ${data} às ${hora}`);
    try {
      // 1. Busca cliente (ou cria se não existir)
      let clientRes = await query('SELECT id FROM clients WHERE phone = $1', [cliente_telefone]);
      let clientId;
      
      if (clientRes.rowCount === 0) {
        logger.debug('Cliente não existe, criando um novo registro preliminar.');
        const insertClient = await query(
          'INSERT INTO clients (name, phone) VALUES ($1, $2) RETURNING id', 
          ['Novo Cliente', cliente_telefone]
        );
        clientId = insertClient.rows[0].id;
      } else {
        clientId = clientRes.rows[0].id;
      }

      // 2. Definir hora final estimada (default 60 min se não houver lógica complexa)
      const startTimeParts = hora.split(':');
      const endDate = new Date(0,0,0, parseInt(startTimeParts[0]) + 1, parseInt(startTimeParts[1]));
      const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}:00`;

      // 3. Inserir no banco
      const sql = `
        INSERT INTO appointments (client_id, service, date, start_time, end_time, price, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const values = [clientId, servico, data, `${hora}:00`, endTime, valor || 0, 'agendado'];
      
      const aptRes = await query(sql, values);
      const appointment = aptRes.rows[0];

      // 4. Salvar no Obsidian (Será implementado na Fase 4)
      // await obsidianWriter.createAppointmentNote(appointment);

      // Emitir evento
      eventBus.emit(EVENTS.APPOINTMENT_CREATED, appointment);

      return {
        message: 'Agendamento criado com sucesso',
        appointment_id: appointment.id,
        status: appointment.status
      };
    } catch (error) {
      logger.error('Erro ao criar agendamento', error);
      throw error;
    }
  }

  /**
   * Cancela um agendamento
   */
  async cancelAppointment(appointmentId, motivo) {
    logger.info(`Cancelando agendamento ${appointmentId}. Motivo: ${motivo}`);
    try {
      const sql = `
        UPDATE appointments 
        SET status = 'cancelado', notes = COALESCE(notes, '') || '\nCancelado: ' || $1 
        WHERE id = $2 
        RETURNING *
      `;
      const res = await query(sql, [motivo, appointmentId]);
      
      if (res.rowCount === 0) {
        return { message: 'Agendamento não encontrado' };
      }

      const appointment = res.rows[0];
      
      // Emitir evento
      eventBus.emit(EVENTS.APPOINTMENT_CANCELLED, appointment);
      
      return {
        message: 'Agendamento cancelado com sucesso',
        status: 'cancelado'
      };
    } catch (error) {
      logger.error('Erro ao cancelar agendamento', error);
      throw error;
    }
  }
}

module.exports = new Scheduler();
