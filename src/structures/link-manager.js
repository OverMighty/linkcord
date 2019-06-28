class LinkManager {

    constructor(client) {
        this.client = client;
    }

    async cacheChannelLinkData(channel) {
        const query = {
            name: 'cache-channel-link-data',
            text: 'SELECT linked_to, mirror_webhook FROM linked_channels WHERE id = $1',
            rowMode: 'array',
            values: [channel.id]
        };

        const result = await this.client.db.query(query);

        if (result.rows.length) {
            const linkedTo = this.client.channels.get(result.rows[0][0]);
            const mirrorWebhook = await this.client.fetchWebhook(result.rows[0][1]);
            channel.linkData = { linked: true, linkedTo, mirrorWebhook };
        } else {
            channel.linkData = { linked: false };
        }
    }

    createMirrorWebhook(channel) {
        return channel.createWebhook(`Linkcord Webhook for #${channel.name}`, {
            reason: `Linkcord: link channel #${channel.name}`
        });
    }

    async linkChannels(channel1, channel2) {
        const webhook1 = await this.createMirrorWebhook(channel2);
        const webhook2 = await this.createMirrorWebhook(channel1);

        const query = {
            name: 'link-channels',
            text: 'INSERT INTO linked_channels VALUES ($1, $2, $3), ($2, $1, $4)',
            values: [channel1.id, channel2.id, webhook1.id, webhook2.id]
        };

        await this.client.db.query(query);
        channel1.linkData = { linked: true, linkedTo: channel2, mirrorWebhook: webhook1 };
        channel2.linkData = { linked: true, linkedTo: channel1, mirrorWebhook: webhook2 };
    }

    async unlinkChannels(channel1, channel2) {
        for (const channel of [channel1, channel2]) {
            channel.linkData.mirrorWebhook.delete('Linkcord: unlinked channel');
            channel.linkData = { linked: false };
        }

        const query = {
            name: 'unlink-channels',
            text: 'DELETE FROM linked_channels WHERE id = $1 OR id = $2',
            values: [channel1.id, channel2.id]
        };

        await this.client.db.query(query);
    }

}

module.exports = LinkManager;
