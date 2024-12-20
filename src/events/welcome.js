const { Events, EmbedBuilder } = require('discord.js');
const { config } = require('../config.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const channel = member.guild.channels.cache.get(config.channels.welcome);
        if (!channel) {
            console.error('Welcome channel not found');
            return;
        }

            try {
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

                const role = member.guild.roles.cache.get(config.roles.member);

                if (!role) {
                    throw new Error(`Role not found for ID: 1314188497053290506`);
                }


                await member.roles.add(role);
                console.log(`Role successfully added to ${member.user.tag}`);
            } catch (error) {
                console.error(`Failed to add role to ${member.user.tag}:`, error);
            }
        }
};
