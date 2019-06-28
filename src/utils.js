const { MessageEmbed } = require('discord.js');

const colors = {
    red: 0xFF5370,
    green: 0xC3E88D,
    blue: 0x82AAFF
};

const linkingChannel = new MessageEmbed()
    .setColor(colors.blue)
    .setTitle('Other queued channel found. Linking...');

const unlinkingChannel = new MessageEmbed()
    .setColor(colors.blue)
    .setTitle('Unlinking channel...');

const unexpectedError = new MessageEmbed()
    .setColor(colors.red)
    .setTitle('Oops! An unexpected error has occurred.')
    .setDescription('This incident has been reported.');

const embeds = { linkingChannel, unlinkingChannel, unexpectedError };

module.exports = { colors, embeds };
