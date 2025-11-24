const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fortnite-shop')
        .setDescription('Affiche le shop du jour de Fortnite'),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const response = await fetch('https://fortnite-api.com/v2/shop');

            if (!response.ok) {
                return await interaction.editReply(`❌ Erreur API: ${response.status}`);
            }
            const data = await response.json();

            if (!data.data || !data.data.featured) {
                return await interaction.editReply('Impossible de récupérer le shop.');
            }

            const featuredItems = data.data.featured.entries;
            const itemsPerPage = 10;
            const totalPages = Math.ceil(featuredItems.length / itemsPerPage);
            let currentPage = 0;

            const generateEmbed = (page) => {
                const start = page * itemsPerPage;
                const end = start + itemsPerPage;
                const pageItems = featuredItems.slice(start, end);

                const embed = new EmbedBuilder()
                    .setTitle('🛒 Shop Fortnite du jour')
                    .setColor('#7B68EE')
                    .setTimestamp()
                    .setFooter({ text: `Page ${page + 1}/${totalPages} • Total: ${featuredItems.length} items` });

                pageItems.forEach(entry => {
                    const item = entry.items[0];
                    const name = item.name || 'Item inconnu';
                    const price = entry.finalPrice || 'N/A';
                    const rarity = item.rarity?.displayValue || 'Commun';

                    embed.addFields({
                        name: `${name} - ${price} V-Bucks`,
                        value: `Rareté: ${rarity}`,
                        inline: true
                    });
                });

                return embed;
            };

            const generateButtons = (page) => {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('first')
                            .setLabel('⏮️')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(page === 0),
                        new ButtonBuilder()
                            .setCustomId('prev')
                            .setLabel('◀️')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(page === 0),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('▶️')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(page === totalPages - 1),
                        new ButtonBuilder()
                            .setCustomId('last')
                            .setLabel('⏭️')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(page === totalPages - 1)
                    );
                return row;
            };

            const message = await interaction.editReply({
                embeds: [generateEmbed(currentPage)],
                components: totalPages > 1 ? [generateButtons(currentPage)] : []
            });

            if (totalPages > 1) {
                const collector = message.createMessageComponentCollector({
                    time: 300000
                });

                collector.on('collect', async i => {
                    switch (i.customId) {
                        case 'first':
                            currentPage = 0;
                            break;
                        case 'prev':
                            currentPage = Math.max(0, currentPage - 1);
                            break;
                        case 'next':
                            currentPage = Math.min(totalPages - 1, currentPage + 1);
                            break;
                        case 'last':
                            currentPage = totalPages - 1;
                            break;
                    }

                    await i.update({
                        embeds: [generateEmbed(currentPage)],
                        components: [generateButtons(currentPage)]
                    });
                });

                collector.on('end', () => {
                    message.edit({ components: [] }).catch(() => {});
                });
            }

        } catch (error) {
            console.error('Erreur fortnite-shop:', error);
            const errorMessage = `Erreur: ${error.message}`;

            if (interaction.deferred) {
                await interaction.editReply(errorMessage);
            } else {
                await interaction.reply(errorMessage).catch(() => {});
            }
        }
    }
}