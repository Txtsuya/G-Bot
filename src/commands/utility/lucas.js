const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { join } = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lucas')
		.setDescription('yo fone lingling'),
	async execute(interaction) {
		const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                content: 'Tu dois être dans un channel vocal bouffon',
                ephemeral: true
            });
        }
        try {
            // Join the voice channel
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            // Create audio player
            const player = createAudioPlayer();
            
            // Create audio resource (replace 'ringtone.mp3' with your audio file path)
            const resource = createAudioResource(join(__dirname, '../../sounds/pouetpouet.mp3'));
            
            // Play the audio
            player.play(resource);
            connection.subscribe(player);

            // Handle the audio player states
            player.on(AudioPlayerStatus.Playing, () => {
                interaction.reply('big boy come pickup yo fone');
            });

            player.on(AudioPlayerStatus.Idle, () => {
                // Disconnect when the audio finishes playing
                connection.destroy();
            });

            player.on('error', error => {
                console.error(`Error: ${error.message}`);
                connection.destroy();
            });

        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: 'Plus jamais les femmes.',
                ephemeral: true
            });
        }
	},
};
