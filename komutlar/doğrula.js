const { Modal, TextInputComponent, showModal } = require('discord-modals')
const db = require("inflames.db")
const ms = require("parse-ms");

module.exports = {
  name: "doğrula",
  description: "Aldığınız kodu gireceğiniz alan.",
  options: [],
  async exe(client, interaction) {    
  let times = await db.fetch(`dbeklemesuresi_${interaction.member.id}`);
  let saniye = 1000 * 60 * 5;
  if (times !== null && saniye - (Date.now() - times) > 0) {
    let time = ms(saniye - (Date.now() - times));
    return await  interaction.reply({ content: `Bu komutu tektar kullanmak için **${time.hours ? time.hours + "saat" : ""} ${time.minutes ? time.minutes + "dakika" : ""} ${time.seconds ? time.seconds + "saniye" : ""} ${time.milliseconds ? time.milliseconds + "salise" : ""}** beklemelisin!`, ephemeral: true });
  }
    if(!db.has(`sifre_${interaction.member.id}`)) return interaction.reply({ content: "Lütfen önce kod alın!", ephemeral: true });
      const modal = new Modal()
      .setCustomId('verify')
      .setTitle('Doğrulama Menüsü.')
      .addComponents(
        new TextInputComponent()
        .setCustomId('code')
        .setLabel('Doğrulama Kodunu giriniz...')
        .setStyle('SHORT')
        .setMinLength(6)
        .setMaxLength(6)
        .setPlaceholder('Kodu yazınız.')
        .setRequired(true),
      );
      db.yaz(`dbeklemesuresi_${interaction.member.id}`, Date.now());
      showModal(modal, { client, interaction });
  }
}