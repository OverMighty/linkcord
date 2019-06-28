const { MessageEmbed } = require('discord.js');
const { Command } = require('discord-akairo');

const { colors, embeds } = require('../../utils');

class UnlinkCommand extends Command {

    constructor() {
        super('unlink', {
            aliases: ['unlink'],
            description: 'Unlinks the guild channel if it is linked or removes it from the link ' +
                ' queue if it is queued for linking.',
            category: 'linking',
            userPermissions: 'MANAGE_GUILD',
            clientPermissions: 'MANAGE_WEBHOOKS'
        });
    }

    async exec(message) {
        if (!message.channel.linkData) {
            try {
                await this.client.linkManager.cacheChannelLinkData(message.channel);
            } catch (err) {
                console.error(err.stack);
                return message.channel.send(embeds.unexpectedError);
            }
        }

        if (message.channel.linkData.linked) {
            const { linkedTo } = message.channel.linkData;
            message.channel.send(embeds.unlinkingChannel);
            linkedTo.send(embeds.unlinkingChannel);

            try {
                if (!linkedTo.linkData) {
                    await this.client.linkManager.cacheChannelLinkData(linkedTo);
                }

                await this.client.linkManager.unlinkChannels(message.channel, linkedTo);

                for (const channel of [message.channel, linkedTo]) {
                    const embed = new MessageEmbed()
                        .setColor(colors.green)
                        .setTitle('This channel has been unlinked.')
                        .setDescription('How sad. :(');

                    channel.send(embed);
                }
            } catch (err) {
                console.error(err.stack);
                message.channel.send(embeds.unexpectedError);
                linkedTo.send(embeds.unexpectedError);
            }

            return;
        }

        const { queuedChannel } = this.client;

        if (!queuedChannel || queuedChannel.id !== message.channel.id) {
            return message.util.reply('this channel is neither linked or queued for linking.');
        }

        this.client.queuedChannel = null;

        const embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle('This channel has been removed from the link queue!')
            .setDescription(`Type \`${this.handler.prefix}link\` to add it back.`);

        message.channel.send(embed);
    }

}

module.exports = UnlinkCommand;
