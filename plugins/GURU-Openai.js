import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command, match, args }) => {
   let q = m.quoted ? m.quoted : m;
  if (!args[0]) throw ' question ❓'
    await m.reply('جاري الاجابة...')
    let res = await fetch(`https://vihangayt.me/tools/chatgpt?q=${q.text.replace(usedPrefix + command, "")}`)
    let open = await res.json()
    let ai = await open.data
    await m.reply(ai)
  }
handler.command = ["gpt", "ai"]
export default handler
