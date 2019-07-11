const { Listener } = require('discord-akairo');

class MessageDeleteListener extends Listener {

    constructor() {
        super('messageDelete', {
            emitter: 'client',
            event: 'messageDelete'
        });
    }

    async exec(message) {
        if (message.mirror) message.mirror.delete();
    }

}

module.exports = MessageDeleteListener;
