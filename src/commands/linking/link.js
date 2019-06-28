const { MessageEmbed } = require('discord.js');
const { Command } = require('discord-akairo');

const { colors, embeds } = require('../../utils');

const MAX_WEBHOOKS_PER_CHANNEL = 10;

class LinkCommand extends Command {

    constructor() {
        super('link', {
            aliases: ['link'],
            description: 'Queues the guild channel for linking.',
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

            return message.util.reply(`this channel is already linked with **#${linkedTo.name}** ` +
                `from guild **${linkedTo.guild.name}**!`);
        }

        const channelWebhooks = await message.channel.fetchWebhooks();

        if (channelWebhooks.size >= MAX_WEBHOOKS_PER_CHANNEL) {
            return message.util.reply('this channel has too many webhooks, I cannot link it.');
        }

        const { queuedChannel } = this.client;

        if (queuedChannel) {
            if (queuedChannel.id === message.channel.id) {
                return message.util.reply('this channel is already queued for linking!');
            }

            if (queuedChannel.guild.id === message.guild.id) {
                return message.util.reply(`channel ${queuedChannel} is already queued for ` +
                    'linking! Only 1 guild channel may be queued for linking at a time.');
            }

            queuedChannel.send(embeds.linkingChannel);
            message.channel.send(embeds.linkingChannel);

            try {
                await this.client.linkManager.linkChannels(queuedChannel, message.channel);
                this.client.queuedChannel = null;

                for (const channel of [queuedChannel, message.channel]) {
                    const { linkedTo } = channel.linkData;

                    const embed = new MessageEmbed()
                        .setColor(colors.green)
                        .setTitle(`This channel has been linked with **#${linkedTo.name}** from ` +
                            `guild **${linkedTo.guild.name}**!`)
                        .setDescription('Say hello to your new friends!');

                    channel.send(embed);
                }
            } catch (err) {
                console.error(err.stack);
                queuedChannel.send(embeds.unexpectedError);
                message.channel.send(embeds.unexpectedError);
            }

            return;
        }

        this.client.queuedChannel = message.channel;

        const embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle('This channel has been added to the link queue!')
            .setDescription(`Type \`${this.handler.prefix}unlink\` to undo.`);

        message.channel.send(embed);
    }

}

module.exports = LinkCommand;
