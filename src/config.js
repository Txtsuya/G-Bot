module.exports = {
    // Channels
    channels: {
        welcome: '1318578934581039165',
        // Add other channel IDs here
        logs: '', // for logging
        general: '', // main chat channel
    },
    
    // Roles
    roles: {
        member: '1314188497053290506', // Default member role
        // Add other role IDs here
        admin: '',
        moderator: '',
    },

    // Bot Configuration
    bot: {
        prefix: '!',
        embedColor: '#be29ec',
    },

    // Custom Messages
    messages: {
        welcome: {
            title: '🎉 Nouveau Gooner!',
            description: (member) => `${member} veut se goon le goonstick avec nous!`,
        },
        errors: {
            roleNotFound: 'Could not find the specified role',
            channelNotFound: 'Could not find the specified channel',
        }
    }
};