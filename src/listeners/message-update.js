const { Listener } = require('discord-akairo');
const { embeds } = require('../utils');

class MessageUpdateListener extends Listener {

    constructor() {
        super('messageUpdate', {
            emitter: 'client',
            event: 'messageUpdate'
        });
    }

    async exec(oldMessage, newMessage) {
        if (!oldMessage.mirror) return;
        if (!oldMessage.channel.linkData) {
            try {
                await this.client.linkManager.cacheChannelLinkData(oldMessage.channel);
            } catch (error) {
                console.error(error.stack);
                return oldMessage.channel.send(embeds.unexpectedError);
            }
        }

        const { linkData } = oldMessage.channel;
        if (!linkData.linked) return;

        newMessage.mirror = await linkData.mirrorWebhook.send(newMessage.content, {
            username: `${oldMessage.author.tag} (edited)`,
            avatarURL: oldMessage.author.avatarURL(),
            files: newMessage.attachments.map(attachment => attachment.url)
        });

        oldMessage.mirror.delete();
    }

}

module.exports = MessageUpdateListener;
