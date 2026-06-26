const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;
const config = require('../../config/default');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
const piperClient = require('./piperClient');

class AudioGenerator {
  /**
   * Gera o áudio a partir de um texto e converte para o formato OGG OPUS exigido pelo WhatsApp
   * @param {string} text - O texto que a IA gerou
   * @returns {Promise<string>} - O base64 do áudio final em OGG
   */
  async generateWhatsAppAudioBase64(text) {
    const id = uuidv4();
    const tempInputPath = path.join(config.paths.temp, `${id}_tts.wav`);
    const tempOutputPath = path.join(config.paths.temp, `${id}_tts.ogg`);

    try {
      // 1. Sintetizar áudio via Piper (Retorna WAV)
      const wavBuffer = await piperClient.synthesize(text);
      await fs.writeFile(tempInputPath, wavBuffer);

      // 2. Converter WAV para OGG/OPUS
      await new Promise((resolve, reject) => {
        ffmpeg(tempInputPath)
          .audioCodec('libopus')
          .toFormat('ogg')
          .on('error', (err) => reject(err))
          .on('end', () => resolve())
          .save(tempOutputPath);
      });

      // 3. Ler arquivo convertido e passar para Base64
      const oggBuffer = await fs.readFile(tempOutputPath);
      const base64Audio = oggBuffer.toString('base64');

      // 4. Limpeza
      fs.unlink(tempInputPath).catch(e => logger.warn('Erro ao limpar tts input temp', e));
      fs.unlink(tempOutputPath).catch(e => logger.warn('Erro ao limpar tts output temp', e));

      return `data:audio/ogg;base64,${base64Audio}`;
    } catch (error) {
      logger.error('Erro ao gerar áudio TTS para WhatsApp', error);
      throw error;
    }
  }
}

module.exports = new AudioGenerator();
