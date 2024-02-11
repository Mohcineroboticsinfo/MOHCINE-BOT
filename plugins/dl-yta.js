import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios'
import {bestFormat, getUrlDl} from '../lib/y2dl.js';

let handler = async (m, { conn, text, args, isPrems, isOwner, usedPrefix, command }) => {
  if (!args || !args[0]) throw `✳️ Example :\n${usedPrefix + command} https://youtu.be/YzkTFFwxtXI`;
  if (!args[0].match(/youtu/gi)) throw `❎ Verify that it is a YouTube link.`;

  m.react(rwait); 

  try {
    let q = '192kbps'; 
    let v = args[0]; 
    const yt = await youtubedl(v).catch(async () => await youtubedlv2(v)); 
    const dl_url = await yt.audio[q].download(); 
    const title = `${yt_1?.title ? yt_1.title : 'Tu_audio_descargado'}`;
    const fileSizeInBytes = buff.byteLength;
    const fileSizeInKB = fileSizeInBytes / 1024;
    const fileSizeInMB = fileSizeInKB / 1024;
    const roundedFileSizeInMB = fileSizeInMB.toFixed(2);
      await conn.sendMessage(m.chat, {document: buff, caption: `*▢ Title:* ${ttl_1}\n*▢ size:* ${roundedFileSizeInMB} MB`, fileName: ttl_1 + '.mp3', mimetype: 'audio/mpeg'}, {quoted: m});

    conn.sendFile(
      m.chat,
      dl_url,
      title + '.mp3',
      null, 
      m,
      false,
      { mimetype: 'audio/mpeg' }
    );

    m.react(xmoji); 
  } catch {
    await m.reply(`❎ Error: Could not download the audio.`)
  }
};

handler.help = ['ytmp3 <url>']
handler.tags = ['downloader']
handler.command = ['ytmp3', 'yta'] 

export default handler
