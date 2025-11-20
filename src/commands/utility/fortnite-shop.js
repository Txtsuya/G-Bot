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
        } catch (error) {
            console.error('error fetch Fortnite shop data:', error);
            return interaction.editReply({
                content: 'shop pas récupéré.',
                ephemeral: true
            });
        }
    }
}