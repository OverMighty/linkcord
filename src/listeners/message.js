const { Listener } = require('discord-akairo');
const { embeds } = require('../utils');

class MessageListener extends Listener {

    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message'
        });
    }

    async exec(message) {
        if (message.author.bot) {
            return;
        }

        if (!message.channel.linkData) {
            try {
                await this.client.linkManager.cacheChannelLinkData(message.channel);
            } catch (error) {
                console.error(error.stack);
                return message.channel.send(embeds.unexpectedError);
            }
        }

        const { linkData } = message.channel;

        if (!linkData.linked) {
            return;
        }

        message.mirror = await linkData.mirrorWebhook.send(message.content, {
            username: message.author.tag,
            avatarURL: message.author.avatarURL(),
            files: message.attachments.map(attachment => attachment.url)
        });
    }

}

module.exports = MessageListener;
