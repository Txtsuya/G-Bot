const { SlashCommandBuilder } = require('discord.js');
const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus,
    NoSubscriberBehavior
} = require('@discordjs/voice');
const { join } = require('node:path');
const { existsSync } = require('node:fs');

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

        const audioPath = join(__dirname, '../../sounds/pouetpouet.mp3');
        
        if (!existsSync(audioPath)) {
            console.error(`Audio file not found at: ${audioPath}`);
            return interaction.reply({
                content: 'Error: Audio file not found',
                ephemeral: true
            });
        }

        try {
            await interaction.deferReply();

            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Play
                }
            });

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfDeaf: false,
                selfMute: false
            });

            const resource = createAudioResource(audioPath, {
                inlineVolume: true,
                inputType: 'file'
            });

            if (!resource) {
                console.error('Failed to create audio resource');
                return interaction.editReply('Failed to create audio resource');
            }

            if (resource.volume) {
                resource.volume.setVolume(1.0);
            }

            connection.subscribe(player);


            player.on(AudioPlayerStatus.Playing, () => {
                interaction.editReply('big boy come pickup yo fone').catch(console.error);
            });

            player.on(AudioPlayerStatus.Idle, () => {
                setTimeout(() => {
                    connection.destroy();
                }, 1000);
            });

            player.on('error', error => {
                console.error('Error:', error.message);
                console.error('Error stack:', error.stack);
                connection.destroy();
                interaction.editReply('Error playing audio').catch(console.error);
            });

            setTimeout(() => {
                player.play(resource);
            }, 1000);

        } catch (error) {
            console.error('Command execution error:', error);
            if (error.message) console.error('Error message:', error.message);
            if (error.stack) console.error('Error stack:', error.stack);
        }
    },
};