const LinkcordClient = require('./structures/client');
require('dotenv').config();

const client = new LinkcordClient();

client.on('warn', warn => console.warn('[Client Warn]', warn));
client.on('error', err => console.error('[Client Error]', err.stack));

process.on('unhandledRejection', err => {
    console.error('[Unhandled Rejection]', err.stack);
});

client.login();
