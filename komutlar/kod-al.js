const { RequestManager } = require('@discordjs/rest');
const { Modal, TextInputComponent, showModal } = require('discord-modals')
const db = require("inflames.db")
const ms = require("parse-ms");

module.exports = {
  name: "kod-al",
  description: "Doğrulama kodu alabilirsiniz.",
  options: [],
  async exe(client, interaction) {
    let times = await db.fetch(`beklemesuresi_${interaction.member.id}`);
    let saniye = 1000 * 60 * 60 * 2;
    if (times !== null && saniye - (Date.now() - times) > 0) {
      let time = ms(saniye - (Date.now() - times));
      return await  interaction.reply({ content: `Bu komutu tektar kullanmak için **${time.hours ? time.hours + "saat" : ""} ${time.minutes ? time.minutes + "dakika" : ""} ${time.seconds ? time.seconds + "saniye" : ""} ${time.milliseconds ? time.milliseconds + "salise" : ""}** beklemelisin!`, ephemeral: true });
    }
    if(interaction.member.roles.cache.has("DOĞRULANMIŞ_ROL_ID")) return interaction.reply({ content: "Zaten e-postanızı doğrulamışsınız!", ephemeral: true });
      const modal = new Modal()
      .setCustomId('posta')
      .setTitle('Doğrulama Menüsü')
      .addComponents(
        new TextInputComponent()
        .setCustomId('eposta')
        .setLabel('E-posta adresinizi yazınız...')
        .setStyle('SHORT')
        .setMinLength(10)
        .setMaxLength(40)
        .setPlaceholder('covid-19code@gmail.com')
        .setRequired(true),
      );
      db.yaz(`beklemesuresi_${interaction.member.id}`, Date.now());
      showModal(modal, { client, interaction });
      
  }
}