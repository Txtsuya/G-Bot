const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { data } = require('./aryan');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fortnite-shop')
        .setDescription('Affiche le shop du jour de Fortnite'),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await fetch('https://fortnite-api.com/v2/shop/', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const shopData = await response.json();

            if (!shopData || !shopData.data || !shopData.data.daily) {
                throw new Error('Invalid data structure from API');
            }

            const featuredItems = shopData.data.featured.entries.slice(0, 10);
            const dailyItems = shopData.data.daily.entries.slice(0, 10);
            const embed = new EmbedBuilder()
                .setTitle('Fortnite Shop du Jour')
                .setColor(0x00AE86)
                .setTimestamp();
            
            if (featuredItems.length > 0) {
                const featuredContent = featuredItems.map(item => {
                    const itemName = item.items[0]?.name || 'Unknown Item';
                    const price = item.finalPrice || 'N/A';
                    return `**${itemName}** - ${price} V-Bucks`;
                }).join('\n');

                embed.addFields({ name: 'Featured Items', value: featuredContent });
            }

            if (dailyItems.length > 0) {
                const dailyContent = dailyItems.map(item => {
                    const itemName = item.items[0]?.name || 'Unknown Item';
                    const price = item.finalPrice || 'N/A';
                    return `**${itemName}** - ${price} V-Bucks`;
                }).join('\n');

                embed.addFields({ name: 'Daily Items', value: dailyContent });
            }

            if (featuredItems.length === 0 && dailyItems.length === 0) {
                embed.setImage(featuredItems[0].items[0].images.featured);
            }

        } catch (error) {
            console.error('error fetch Fortnite shop data:', error);
            return interaction.editReply({
                content: 'shop pas récupéré.',
                ephemeral: true
            });
        }
    }
}