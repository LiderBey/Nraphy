const fetch = require('node-fetch');

module.exports = {
  interaction: {
    name: "trump",
    description: "Donald Trump'a bir tweet attırırsınız.",
    options: [
      {
        name: "yazı",
        description: "Trump'a söyletmek istediklerini yaz.",
        type: 3,
        required: true
      }
    ]
  },
  aliases: ["trumpet"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    const text = interaction.type === 2 ? interaction.options.getString("yazı") : args.join(" ");

    const { messageChecker } = require("../../modules/Functions");
    if (!await messageChecker(interaction, text, "trump KuRşUn İkİ bUçUk MiLyOn!")) return;

    if (interaction.type === 2) await interaction.deferReply();

    const response = await fetch(`https://nekobot.xyz/api/imagegen?type=trumptweet&text=${encodeURI(text).replaceAll('#', '%23')}`);
    const responseData = await response.json();

    if (!responseData.success) {
      client.logger.error("TRUMP komutunda bir sorun oluştu kardeeş.");
      client.logger.log(responseData);

      let messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Hata Oluştu!',
            description: `**•** Hatanın sebebini bilmiyorum.`
          }
        ]
      };
      if (interaction.type === 2)
        return interaction.editReply(messageContent);
      else return interaction.reply(messageContent);
    }

    let messageContent = {
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${client.user.username} • Trump`,
            icon_url: client.settings.icon,
          },
          image: {
            url: responseData.message,
          }
        }
      ]
    };
    if (interaction.type === 2)
      return interaction.editReply(messageContent);
    else return interaction.reply(messageContent);

  }
};