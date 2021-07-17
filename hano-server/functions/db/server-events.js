// const db = require('./_db');

const db = {
    add: async (path, event) => {
        console.log(`[${event.timestamp}] ${event.type}: ${event.message}`);
    }
}

// TODO: move to use sentry

const PATH = `/serverevent`;
const serverevent = (type, message) => ({ 
    type, message, 
    timestamp: new Date().toISOString()
});

exports.startCron = async () => await db.add(PATH, serverevent('info', 'started cron'));
exports.stopCron = async () => await db.add(PATH, serverevent('info', 'stopped cron'));
exports.serverError = async (error) => await db.add(PATH, serverevent('error', error));
exports.serverWarning = async (warning) => await db.add(PATH, serverevent('warning', warning));