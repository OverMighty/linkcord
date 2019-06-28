const { Command } = require('discord-akairo');

class PingCommand extends Command {

    constructor() {
        super('ping', {
            aliases: ['ping'],
            description: 'Just your usual ping command.',
            category: 'util'
        });
    }

    async exec(message) {
        const reply = await message.util.send('Pinging...');
        const ping = (reply.editedAt || reply.createdAt) - (message.editedAt || message.createdAt);

        message.util.send([
            `**Ping:** ${ping}ms`,
            `**API latency:** ${Math.round(this.client.ws.ping)}ms`
        ]);
    }

}

module.exports = PingCommand;
