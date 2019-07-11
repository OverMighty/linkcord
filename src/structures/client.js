const { readFileSync } = require('fs');
const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
const { Client } = require('pg');
const LinkManager = require('./link-manager');

class LinkcordClient extends AkairoClient {

    constructor() {
        super({ ownerID: '<id>' }, {
            disabledEvents: ['TYPING_START'],
            disableEveryone: true
        });

        this.commandHandler = new CommandHandler(this, {
            directory: 'src/commands/',
            prefix: process.env.BOT_PREFIX,
            commandUtil: true,
            allowMention: true,
            handleEdits: true
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: 'src/listeners/'
        });

        this.db = new Client();
        this.linkManager = new LinkManager(this);
    }

    async login(token) {
        try {
            await this.db.connect();
            const initQuery = readFileSync('src/init.sql', 'utf8');
            await this.db.query(initQuery);
        } catch (error) {
            console.error(error.stack);
            process.exit(1);
        }

        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();

        return super.login(token);
    }

}

module.exports = LinkcordClient;
