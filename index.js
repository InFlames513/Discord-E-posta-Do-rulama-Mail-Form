const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const nodemailer = require("nodemailer")
const db = require("inflames.db")
const { Client, Intents, Collection } = require('discord.js');
const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING,], partials: ["MESSAGE", "CHANNEL", "REACTION"] });
const discordModals = require('discord-modals');
discordModals(client);
client._cmd = new Collection();

const commands = [];
const commandFiles = fs.readdirSync('./komutlar').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./komutlar/${file}`);
	commands.push({
    name: command.name,
    description: command.description,
    options: command.options || [],
    type: 1
  });
  client._cmd.set(command.name, command)
}
const rest = new REST({ version: '9' }).setToken("TOKENİ_GİR");
(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands("botid", "serverid"),
			{ body: commands },
		);
	} catch (error) {
		console.error(error);
	}
})();
client.on('interactionCreate', (interaction) => {
  const cmd = client._cmd.get(interaction.commandName);
  try {
    cmd.exe(client, interaction);
  } catch (e) {
    return;
  }
});

client.on('ready', () => {
  client.user.setPresence("Covid-19 Code <3 InFlames#2005  /kod-al  /doğrula")
})

function sifre(uzunluk, semboller) {
  var maske = '';
  if (semboller.indexOf('s') > -1) maske += '0123456789';
  var sonuc = '';
   
  for (var i = uzunluk; i > 0; --i) { sonuc += maske[Math.floor(Math.random() * maske.length)]; } return sonuc;}


client.on('modalSubmit', async (modal) => {
  if(modal.customId === 'posta') {
    const eposta = modal.getTextInputValue('eposta');
    let s = sifre(6, 's')
    db.yaz(`sifre_${modal.member.id}`, s)
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'doğrulama-kodu-atcak-eposta@gmail.com',
        pass: 'şifre'
      }
    });
    transporter.verify(function (error, success) { if (error) throw error; });
    let bilgiler = {
      from: 'Covid-19 E-posta doğrulama',
      to: eposta,
      subject: 'Doğrulama kodunuz: ' + s,
      text: "/doğrula komutunu kullanarak epostanızı doğrulayabilirsiniz."
    };
    transporter.sendMail(bilgiler, function (error, info) {
      if (error) return modal.reply("Girdiğiniz e-posta hatalı!");

      console.log('Eposta gönderildi ' + info.response);
    });
    modal.reply("**E-posta gönderildi!**\nE-postanıza gelen kodu /doğrula foruma giriniz...")
  } else if(modal.customId === 'verify') {
    const sifre = modal.getTextInputValue('code');
    if(sifre !== db.bul(`sifre_${modal.member.id}`)) return modal.reply("UPS! Girdiğiniz kod **hatalı**!");
    modal.member.roles.add("DOĞRULANMIŞ_ROL_ID");
    db.sil(`sifre_${modal.member.id}`);
    return modal.reply("Girdiğiniz kod **doğru** rolünüz verildi!");
  }
});

client.login("TOKENİ_GİR");  // InFlames#2005 <3 Covid-19 code altyapının paylaşılması yasaktır!
