import fetch from 'node-fetch'
let handler = async (m, { text, usedPrefix, command }) => {
if (!text) throw `اكتب نصا للتحدث معي\nمثال: ${usedPrefix + command} Hola bot*`
let res = await fetch(`https://simsimi.fun/api/v2/?mode=talk&lang=ar&message=${text}&filter=false`)
let json = await res.json()
let tes = json.success.replace('simsimi', 'simsimi').replace('Simsimi', 'Simsimi').replace('sim simi', 'sim simi')
m.reply(`${tes}`) 
}
handler.help = ['simsimi']
handler.tags = ['General']
handler.command = ['bot', 'simi', 'simsimi'] 
export default handler
