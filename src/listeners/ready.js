const { Listener } = require('discord-akairo');

class ReadyListener extends Listener {

    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        console.info(`Ready! Logged in as ${this.client.user.tag}`);
        this.client.user.setActivity(`for ${this.client.commandHandler.prefix}help`, {
            type: 'WATCHING'
        });
    }

}

module.exports = ReadyListener;
