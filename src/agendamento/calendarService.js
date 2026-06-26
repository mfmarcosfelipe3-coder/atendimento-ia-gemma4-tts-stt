const { query } = require('../database/connection');
const logger = require('../utils/logger');
const { format, parseISO, getDay } = require('date-fns');

class CalendarService {
  /**
   * Verifica se um horário exato está disponível
   */
  async checkAvailability(dateStr, timeStr) {
    try {
      // 1. Verifica horário de funcionamento do dia
      const parsedDate = parseISO(dateStr);
      const dayOfWeek = getDay(parsedDate); // 0=Domingo, 1=Segunda, etc.
      
      const bhRes = await query('SELECT * FROM business_hours WHERE day_of_week = $1', [dayOfWeek]);
      if (bhRes.rowCount === 0 || !bhRes.rows[0].is_open) {
        return { 
          disponivel: false, 
          motivo: 'O estabelecimento está fechado neste dia.' 
        };
      }

      const bh = bhRes.rows[0];
      const timeTime = `${timeStr}:00`;
      
      // Validação básica se está dentro do horário de abertura
      if (timeTime < bh.open_time || timeTime >= bh.close_time) {
        return { 
          disponivel: false, 
          motivo: `Fora do horário de funcionamento (${bh.open_time} às ${bh.close_time}).` 
        };
      }

      // 2. Verifica se já existe agendamento que conflita
      const sql = `
        SELECT id FROM appointments 
        WHERE date = $1 
        AND status IN ('agendado', 'confirmado')
        AND (
          (start_time <= $2 AND end_time > $2)
        )
      `;
      
      const conflictRes = await query(sql, [dateStr, timeTime]);
      
      if (conflictRes.rowCount > 0) {
        return { 
          disponivel: false, 
          motivo: 'Horário já ocupado por outro cliente.' 
        };
      }

      return { disponivel: true, mensagem: 'Horário livre!' };
    } catch (error) {
      logger.error('Erro ao verificar disponibilidade', error);
      throw error;
    }
  }

  /**
   * Retorna os horários livres num dado dia
   */
  async getAvailableSlots(dateStr) {
    try {
      const parsedDate = parseISO(dateStr);
      const dayOfWeek = getDay(parsedDate);
      
      const bhRes = await query('SELECT * FROM business_hours WHERE day_of_week = $1', [dayOfWeek]);
      if (bhRes.rowCount === 0 || !bhRes.rows[0].is_open) {
        return { message: 'Fechado neste dia', slots: [] };
      }

      // Buscar ocupados
      const occRes = await query(
        `SELECT start_time FROM appointments WHERE date = $1 AND status IN ('agendado', 'confirmado')`,
        [dateStr]
      );
      
      const occupiedTimes = occRes.rows.map(r => r.start_time.substring(0, 5)); // "14:00"

      const bh = bhRes.rows[0];
      const startHour = parseInt(bh.open_time.split(':')[0]);
      const endHour = parseInt(bh.close_time.split(':')[0]);
      const slotDuration = bh.slot_duration; // Em minutos, padrao 60
      
      let availableSlots = [];
      
      // Lógica super simples (hora em hora)
      // Pode ser melhorada para suportar durações flexíveis
      for (let h = startHour; h < endHour; h++) {
        const timeStr = `${String(h).padStart(2, '0')}:00`;
        if (!occupiedTimes.includes(timeStr)) {
          availableSlots.push(timeStr);
        }
      }

      return {
        data: dateStr,
        horarios_disponiveis: availableSlots,
        total: availableSlots.length
      };

    } catch (error) {
      logger.error('Erro ao listar horários', error);
      throw error;
    }
  }
}

module.exports = new CalendarService();
