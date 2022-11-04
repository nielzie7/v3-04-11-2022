require("../config")
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require("@adiwajshing/baileys")
const fs = require("fs")
const util = require("util")
const chalk = require("chalk")
const { exec, spawn, execSync } = require("child_process")
const { fromBuffer } = require("file-type")
const { performance } = require("perf_hooks")
const axios = require("axios")
const path = require("path")
const os = require("os")
const timeZone = require("moment-timezone")
const speed = require("performance-now")
const xfar = require("xfarr-api")
const mss = require("ms")
const dhn = require("dhn-api")
const { color } = require("../lib/color")
const { smsg, getGroupAdmins, formatp, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, delay, format, logic, generateProfilePicture, parseMention, getRandom } = require("../lib/myfunc")

//
const { Gempa } = require("../lib/scrape/bmkg")
const { wikipedia } = require('../lib/scrape/wiki.js');

module.exports = client = async (client, m, chatUpdate, store) => {
  try {
    var body = (m.mtype === "conversation") ? m.message.conversation : (m.mtype == "imageMessage") ? m.message.imageMessage.caption : (m.mtype == "videoMessage") ? m.message.videoMessage.caption : (m.mtype == "extendedTextMessage") ? m.message.extendedTextMessage.text : (m.mtype == "buttonsResponseMessage") ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == "listResponseMessage") ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == "templateButtonReplyMessage") ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === "messageContextInfo") ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ""
    var budy = (typeof m.text == "string" ? m.text : "")
    var prefix = prefa ? /^[°•π÷×¶∆£¢€¥®â?+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®â?+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : prefa ?? global.prefix
    const isCmd = body.startsWith(prefix)
    const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase()
    const args = body.trim().split(/ +/).slice(1)
    const pushname = m.pushName || "No Name"
    const botNumber = await client.decodeJid(client.user.id)
    const isCreator = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)
    const itsMe = m.sender == botNumber ? true : false
    const text = q = args.join(" ")
    const quoted = m.quoted ? m.quoted : m
    const mime = (quoted.msg || quoted).mimetype || ""
    const isMedia = /image|video|sticker|audio/.test(mime)

    // Group
    const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(e => { }) : ""
    const groupName = m.isGroup ? groupMetadata.subject : ""
    const participants = m.isGroup ? await groupMetadata.participants : ""
    const groupAdmins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ""
    const groupOwner = m.isGroup ? groupMetadata.owner : ""
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
    const isPremium = isCreator || global.owner.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)

    // Limit
    try {
      let isNumber = x => typeof x === 'number' && !isNaN(x)
      let limitUser = isPremium ? global.limitawal.premium : global.limitawal.free
      let user = global.db.data.users[m.sender]
      if (typeof user !== 'object') global.db.data.users[m.sender] = {}

      // Afk
      if (user) {
        if (!isNumber(user.afkTime)) user.afkTime = -1
        if (!('afkReason' in user)) user.afkReason = ''
        if (!isNumber(user.limit)) user.limit = limitUser
      } else global.db.data.users[m.sender] = {
        afkTime: -1,
        afkReason: '',
        limit: limitUser,
      }

      let chats = global.db.data.chats[m.chat]
      if (typeof chats !== 'object') global.db.data.chats[m.chat] = {}
      if (chats) {
        if (!('mute' in chats)) chats.mute = false
        if (!('antilink' in chats)) chats.antilink = true
      } else global.db.data.chats[m.chat] = {
        mute: false,
        antilink: true,
      }

      // Reset Limit
      let cron = require('node-cron')
      cron.schedule('00 12 * * *', () => {
        let user = Object.keys(global.db.data.users)
        let limitUser = isPremium ? global.limitawal.premium : global.limitawal.free
        for (let jid of user) global.db.data.users[jid].limit = limitUser
        console.log('Reseted Limit')
      }, {
        scheduled: true,
        timeZone: "Asia/Jakarta"
      })

      let setting = global.db.data.settings[botNumber]
      if (typeof setting !== 'object') global.db.data.settings[botNumber] = {}
      if (setting) {
        if (!isNumber(setting.status)) setting.status = 0
        if (!('autobio' in setting)) setting.autobio = false
        if (!('templateImage' in setting)) setting.templateImage = true
        if (!('templateVideo' in setting)) setting.templateVideo = false
        if (!('templateGif' in setting)) setting.templateGif = false
        if (!('templateMsg' in setting)) setting.templateMsg = false
        if (!('templateLocation' in setting)) setting.templateLocation = false
      } else global.db.data.settings[botNumber] = {
        status: 0,
        autobio: false,
        templateImage: true,
        templateVideo: false,
        templateGif: false,
        templateMsg: false,
        templateLocation: false,
      }

    } catch (err) {
      console.error(err)
    }

    // Anti Link
    if (db.data.chats[m.chat].antilink) {
      if (budy.match(`chat.whatsapp.com`)) {
        if (!isBotAdmins) return m.reply(`?`)
        let gclink = (`https://chat.whatsapp.com/` + await client.groupInviteCode(m.chat))
        let isLinkThisGc = new RegExp(gclink, 'i')
        let isgclink = isLinkThisGc.test(m.text)
        if (isgclink) return m.reply(`Ngapain Lu Ngirim Link Group Ini?`)
        if (isAdmins) return m.reply(`Admin Mah Bebas Yakan?`)
        if (isOwner) return m.reply(`Owner Bot Mah Bebas Yakan?`)
        m.reply(`[ *ANTI LINK* ]\n\nKamu Terdeteksi Mengirim Link Grup, Kamu Akan Di Kick!!!`)
        client.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      }
    }

    // Sayying time
    const hours = timeZone().tz('Asia/Jakarta').format('HH:mm:ss')
    if (hours < "23:59:00") {
      var sayyingTime = 'Selamat Malam 🌃'
    }
    if (hours < "19:00:00") {
      var sayyingTime = 'Selamat Petang 🌆'
    }
    if (hours < "18:00:00") {
      var sayyingTime = 'Selamat Sore 🌅'
    }
    if (hours < "15:00:00") {
      var sayyingTime = 'Selamat Siang 🏙'
    }
    if (hours < "10:00:00") {
      var sayyingTime = 'Selamat Pagi 🌄'
    }
    if (hours < "05:00:00") {
      var sayyingTime = 'Selamat Subuh 🌉'
    }
    if (hours < "03:00:00") {
      var sayyingTime = 'Selamat Tengah Malam 🌌'
    }
    // auto set bio
    if (db.data.settings[botNumber].autobio) {
      let setting = global.db.data.settings[botNumber]
      if (new Date() * 1 - setting.status > 1000) {
        let uptime = await runtime(process.uptime())
        await client.setStatus(`Runtime : ${runtime(process.uptime())}`)
        setting.status = new Date() * 1
      }
    }

    // Respon Cmd with media
    if (isMedia && m.msg.fileSha256 && (m.msg.fileSha256.toString('base64') in global.db.data.sticker)) {
      let hash = global.db.data.sticker[m.msg.fileSha256.toString('base64')]
      let { text, mentionedJid } = hash
      let messages = await generateWAMessage(m.chat, { text: text, mentions: mentionedJid }, {
        userJid: client.user.id,
        quoted: m.quoted && m.quoted.fakeObj
      })
      messages.key.fromMe = areJidsSameUser(m.sender, client.user.id)
      messages.key.id = m.key.id
      messages.pushName = m.pushName
      if (m.isGroup) messages.participant = m.sender
      let msg = {
        ...chatUpdate,
        messages: [proto.WebMessageInfo.fromObject(messages)],
        type: 'append'
      }
      client.ev.emit('messages.upsert', msg)
    }

    if (!client.public) {
      if (!m.key.fromMe) return
    }

    if (m.message) {
      client.readMessages([m.key])
      console.log(chalk.black(chalk.bgGreen('[ CHAT ]')), chalk.black(chalk.blueBright(new Date)), chalk.black(chalk.greenBright(budy || m.mtype)) + '\n' + chalk.magentaBright('- from'), chalk.blueBright(pushname), chalk.greenBright(m.sender) + '\n' + chalk.blueBright('- in'), chalk.cyanBright(m.isGroup ? pushname : 'Private Chat', m.chat))
    }
    const sendFileFromUrl = async (from, url, caption, msg, men) => {
      let mime = "";
      let res = await axios.head(url)
      mime = res.headers["content-type"]
      if (mime.split("/")[1] === "gif") {
        return client.sendMessage(m.chat, { video: await convertGif(url), caption: caption, gifPlayback: true, mentions: men ? men : [] }, { quoted: m })
      }
      let type = mime.split("/")[0] + "Message"
      if (mime.split("/")[0] === "image") {
        return client.sendMessage(m.chat, { image: await getBuffer(url), caption: caption, mentions: men ? men : [] }, { quoted: m })
      } else if (mime.split("/")[0] === "video") {
        return client.sendMessage(m.chat, { video: await getBuffer(url), caption: caption, mentions: men ? men : [] }, { quoted: m })
      } else if (mime.split("/")[0] === "audio") {
        return client.sendMessage(m.chat, { audio: await getBuffer(url), caption: caption, mentions: men ? men : [], mimetype: "audio/mpeg" }, { quoted: m })
      } else {
        l
        return client.sendMessage(m.chat, { document: await getBuffer(url), mimetype: mime, caption: caption, mentions: men ? men : [] }, { quoted: m })
      }
    }
    switch (command) {
      case "menu": case "help": {
        m.reply(`Premium: ${isPremium ? '✅' : `❌`}
Limit: ${isPremium ? 'Unlimited' : `${db.data.users[m.sender].limit}`}`)
      }
        break;
      case "self": {
        if (!isCreator) return m.reply(mess.owner)
        if (!client.public) return m.reply(mess.now)
        client.public = false
        m.reply("sukses mengubah ke mode self!")
      }
        break
      case "public": {
        if (!isCreator) return m.reply(mess.owner)
        if (client.public) return m.reply(mess.now)
        client.public = true
        m.reply("sukses mengubah ke mode public!")
      }
        break
      case "translate": case "tl": {
        if (!text) return m.reply("Teksnya?\nContoh .translate what are you doing")
        res = await fetchJson(`https://docs-api-zahirrr.herokuapp.com/api/translate?text=${text}`)
        m.reply(`⚙️Translate : ${text}\n🔎Hasil : ${res.text}`)
      }
        break
      case "couple": {
        m.reply(mess.wait)
        let anu = await fetchJson("https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json")
        let random = anu[Math.floor(Math.random() * anu.length)]
        client.sendMessage(m.chat, { image: { url: random.male }, caption: `Couple Male` }, { quoted: m })
        client.sendMessage(m.chat, { image: { url: random.female }, caption: `Couple Female` }, { quoted: m })
      }
        break;
      case "runtime": {
        const formater = (seconds) => {
          const pad = (s) => {
            return (s < 10 ? "0" : "") + s
          }
          const hrs = Math.floor(seconds / (60 * 60))
          const mins = Math.floor(seconds % (60 * 60) / 60)
          const secs = Math.floor(seconds % 60)
          return " " + pad(hrs) + ":" + pad(mins) + ":" + pad(secs)
        }
        const uptime = process.uptime()
        await m.reply(`*── 「 BOT UPTIME 」 ──*\n\n❏${formater(uptime)}`)
      }
        break;
      case "group": case "grup": {
        if (!m.isGroup) throw mess.group
        if (!isBotAdmins) throw mess.botAdmin
        if (!isAdmins) throw mess.admin
        if (args[0] === "close") {
          await client.groupSettingUpdate(m.chat, "announcement").then((res) => m.reply(`Sukses Menutup Group`)).catch((err) => m.reply(jsonformat(err)))
        } else if (args[0] === "open") {
          await client.groupSettingUpdate(m.chat, "not_announcement").then((res) => m.reply(`Sukses Membuka Group`)).catch((err) => m.reply(jsonformat(err)))
        } else {
          let buttons = [{ buttonId: "group open", buttonText: { displayText: "Open" }, type: 1 }, { buttonId: "group close", buttonText: { displayText: "Close" }, type: 1 }]
          await client.sendButtonText(m.chat, buttons, `Mode Group`, client.user.name, m)
        }
      }
        break;
      case "sticker": case "s": case "stickergif": case "sgif": {
        if (!quoted) throw `Balas Video/Image Dengan Caption ${prefix + command}`
        m.reply(mess.wait)
        if (/image/.test(mime)) {
          let media = await quoted.download()
          let encmedia = await client.sendImageAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
          await fs.unlinkSync(encmedia)
        } else if (/video/.test(mime)) {
          if ((quoted.msg || quoted).seconds > 11) return m.reply("Maksimal 10 detik!")
          let media = await quoted.download()
          let encmedia = await client.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
          await fs.unlinkSync(encmedia)
        } else {
          throw `Kirim Gambar/Video Dengan Caption ${prefix + command}\nDurasi Video 1-9 Detik`
        }
      }
        break;
      case 'pinterest': {
        if (!m.isGroup) return m.reply(mess.group)
        m.reply(mess.wait)
        anu = await pinterest(text)
        result = anu[Math.floor(Math.random() * anu.length)]
        client.sendMessage(m.chat, { image: { url: result } }, { quoted: m })
      }

        break
      case "infogempa": {
        Gempa().then(v =>
          client.sendMessage(m.chat, { image: { url: v.map }, caption: `*Info Gempa*\n• Waktu: *${v.waktu}*\n• Lintang: *${v.lintang}*\n• Bujur: *${v.bujur}*\n• Magnitudo: *${v.magnitudo}*\n• Kedalaman: *${v.kedalaman}*\n• Wilayah: *${v.wilayah}*\n` }, { quoted: m }))
      }
        break;
      case "wiki": {
        if (!text) return m.reply("Apa Yang Mau Di Cari/nContoh: .wiki manusia")
        m.reply(mess.wait)
        res = await wikipedia(text).catch(e => {
          return m.reply("_[ ! ] Error Hasil Tidak Ditemukan_")
        })
        hasil = `*Judul:* ${res[0].judul}\n*Wiki :* ${res[0].wiki}`
        client.sendMessage(m.chat, { image: { url: res[0].thumb }, caption: hasil }, { quoted: m })
      }
        break;
      case "darkjokes": {
        m.reply(mess.wait)
        res = await dhn.Darkjokes();
        await sendFileFromUrl(m.chat, res, mess.done, m)
      }
        break
      case "addprem":
        let who
        if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
        else who = m.chat
        let user = db.data.users[who]
        if (!who) return m.reply(`tag atau balas pesan yang mau dijadikan premium!`)
        let txt = text.replace('@' + who.split`@`[0], '').trim()
        if (!txt) return m.reply(`berapa hari?`)
        if (isNaN(txt)) return m.reply(`hanya nomor mamaskuh!\n\ncontoh:\n${prefix + command} @${m.sender.split`@`[0]} 7`)
        var jumlahHari = 86400000 * txt
        var now = new Date() * 1
        if (now < user.premiumTime) user.premiumTime += jumlahHari
        else user.premiumTime = now + jumlahHari
        user.premium = true
        m.reply(`Berhasil!\n*${pushname}* sekarang sudah premium ${txt} hari.\n\ncountdown: ${mss.msToDate(user.premiumTime - now)}`)
        break
      case "prem": {
        if (!ifCreator) return m.reply(mess.owner)
        if (args[0] === "add") {
          let who
          if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
          else who = m.chat
          let user = db.data.users[who]
          if (!who) return m.reply(`tag atau balas pesan yang mau dijadikan premium!`)
          let txt = text.replace('@' + who.split`@`[0], '').trim()
          if (!txt) return m.reply(`berapa hari?`)
          if (isNaN(txt)) return m.reply(`hanya nomor mamaskuh!\n\ncontoh:\n${prefix + command} @${m.sender.split`@`[0]} 7`)
          var jumlahHari = 86400000 * txt
          var now = new Date() * 1
          if (now < user.premiumTime) user.premiumTime += jumlahHari
          else user.premiumTime = now + jumlahHari
          user.premium = true
          m.reply(`Berhasil!\n*${pushname}* sekarang sudah premium ${txt} hari.\n\ncountdown: ${mss.msToDate(user.premiumTime - now)}`)
        } else if (args[0] === "del") {
          let who
          if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false
          else who = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat
          let user = db.data.users[who]
          if (!who) return m.reply(`tag atau balas orangnya mas!\n\ncontoh:\n${prefix + command} @${m.sender.split`@`[0]}`)
          user.premium = false
          user.premiumTime = 0
          m.reply(`berhasil!\n*${pushname}* sekarang bukan premium!`)
        }
      }
        break
      default:
    }
  } catch (err) {
    console.log(color('[ERROR]', 'blue'), err)
  }
}