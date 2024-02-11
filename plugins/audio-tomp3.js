
const handler = async (m, {conn, usedPrefix, command}) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q || q.msg).mimetype || q.mediaType || '';
  if (!/video|audio/.test(mime)) throw `*ارسال الامر متبوع بالفيديو او اي ملف صوتي*`;
  const media = await q.download();
  if (!media) throw 'أنا آسف، حدث خطأ أثناء تنزيل الفيديو، يرجى المحاولة مرة أخرى*';
  const audio = await toAudio(media, 'mp4');
  if (!audio.data) throw '*أنا آسف، حدث خطأ أثناء تحويل الملاحظة الصوتية إلى صوت/MP3، يرجى المحاولة مرة أخرى*';
  conn.sendMessage(m.chat, {audio: audio.data, mimetype: 'audio/mpeg'}, {quoted: m});
};
handler.alias = ['tomp3', 'toaudio'];
handler.command = /^to(mp3|audio)$/i;
export default handler;

import {promises} from 'fs';
import {join} from 'path';
import {spawn} from 'child_process';

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    try {
      const tmp = join(global.__dirname(import.meta.url), '../tmp', + new Date + '.' + ext);
      const out = tmp + '.' + ext2;
      await promises.writeFile(tmp, buffer);
      spawn('ffmpeg', [
        '-y',
        '-i', tmp,
        ...args,
        out,
      ])
          .on('error', reject)
          .on('close', async (code) => {
            try {
              await promises.unlink(tmp);
              if (code !== 0) return reject(code);
              resolve({
                data: await promises.readFile(out),
                filename: out,
                delete() {
                  return promises.unlink(out);
                },
              });
            } catch (e) {
              reject(e);
            }
          });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Convert Audio to Playable WhatsApp Audio
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension
 * @return {Promise<{data: Buffer, filename: String, delete: Function}>}
 */
function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
  ], ext, 'ogg');
}

/**
 * Convert Audio to Playable WhatsApp PTT
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension
 * @return {Promise<{data: Buffer, filename: String, delete: Function}>}
 */
function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
    '-compression_level', '10',
  ], ext, 'opus');
}

/**
 * Convert Audio to Playable WhatsApp Video
 * @param {Buffer} buffer Video Buffer
 * @param {String} ext File Extension
 * @return {Promise<{data: Buffer, filename: String, delete: Function}>}
 */
function toVideo(buffer, ext) {
  return ffmpeg(buffer, [
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-ab', '128k',
    '-ar', '44100',
    '-crf', '32',
    '-preset', 'slow',
  ], ext, 'mp4');
}

export {
  toAudio,
  toPTT,
  toVideo,
  ffmpeg,
};
