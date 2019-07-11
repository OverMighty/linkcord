const LinkcordClient = require('./structures/client');

new LinkcordClient()
    .on('warn', warn => console.warn('[Client Warn]', warn))
    .on('error', error => console.error('[Client Error]', error.stack))
    .login();

process.on('unhandledRejection', err => {
    console.error('[Unhandled Rejection]', err.stack);
});
