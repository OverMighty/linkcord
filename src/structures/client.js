const fs = require('fs');

const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
const { Client } = require('pg');

const LinkManager = require('./link-manager');

class LinkcordClient extends AkairoClient {

    constructor() {
        super({
            disabledEvents: ['TYPING_START'],
            disableEveryone: true
        });

        this.commandHandler = new CommandHandler(this, {
            directory: './src/commands/',
            prefix: process.env.BOT_PREFIX,
            commandUtil: true,
            allowMention: true,
            handleEdits: true
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: './src/listeners/'
        });

        this.db = new Client();
        this.linkManager = new LinkManager(this);
    }

    async login(token) {
        this.loadModules();
        await this.initDB();
        super.login(token);
    }

    loadModules() {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }

    async initDB() {
        try {
            await this.db.connect();
            const initQuery = fs.readFileSync('./src/init.sql', 'utf8');
            await this.db.query(initQuery);
        } catch (err) {
            console.error(err.stack);
            process.exit(1);
        }
    }

}

module.exports = LinkcordClient;
