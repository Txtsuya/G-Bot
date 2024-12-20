const { SlashCommandBuilder } = require('discord.js');
const { config } = require('../../config.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ugo')
		.setDescription('le king kebab en personne'),
	async execute(interaction) {
		await interaction.reply('Message est trop gros pour être affiché.');
	},
};
