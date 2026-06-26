const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;
const config = require('../../config/default');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

class AudioProcessor {
  /**
   * Converte o áudio OGG/OPUS vindo do WhatsApp para formato suportado pelo Groq (MP3 ou WAV)
   * @param {Buffer} audioBuffer - O buffer do áudio original
   * @returns {Promise<{buffer: Buffer, filename: string}>} - Áudio convertido
   */
  async prepareForSTT(audioBuffer) {
    const id = uuidv4();
    const tempInputPath = path.join(config.paths.temp, `${id}.ogg`);
    const tempOutputPath = path.join(config.paths.temp, `${id}.mp3`);

    try {
      // 1. Salvar buffer temporariamente
      await fs.writeFile(tempInputPath, audioBuffer);

      // 2. Converter via ffmpeg
      await new Promise((resolve, reject) => {
        ffmpeg(tempInputPath)
          .toFormat('mp3')
          .on('error', (err) => reject(err))
          .on('end', () => resolve())
          .save(tempOutputPath);
      });

      // 3. Ler arquivo convertido
      const convertedBuffer = await fs.readFile(tempOutputPath);

      // 4. Limpeza assíncrona
      fs.unlink(tempInputPath).catch(e => logger.warn('Erro ao limpar audio input temp', e));
      fs.unlink(tempOutputPath).catch(e => logger.warn('Erro ao limpar audio output temp', e));

      return {
        buffer: convertedBuffer,
        filename: `${id}.mp3`
      };
    } catch (error) {
      logger.error('Erro no processamento de áudio para STT', error);
      throw error;
    }
  }
}

module.exports = new AudioProcessor();
