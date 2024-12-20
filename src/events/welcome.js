const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const channel = member.guild.channels.cache.get('1318578934581039165');
        if (!channel)
            return;

        const welcomeEmbed = new EmbedBuilder()
            .setColor('#be29ec')
            .setTitle('🎉 Nouveau Gooner!')
            .setDescription(`${member} veut se goon le goonstick avec nous!`)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: 'Membre n°', value: `${member.guild.memberCount}`},
                { name: 'Rejoins le', value: member.joinedAt.toLocaleDateString() }
            )
            .setImage(member.client.user.displayAvatarURL({
                size: 1024,
                format: 'png',
                dynamic: true
            }))

            await channel.send({ embeds: [welcomeEmbed] });
        }
};
