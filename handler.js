'use strict';
// https://iamondemand.com/blog/building-your-first-serverless-telegram-bot/
// npm install -g serverless
// serverless deploy

const bot = require('./src/bot');
const crawl = require('./src/crawl');

// Called from telegram webhook
exports.hanobot = async event => {
  try {
    console.log('Received message:', JSON.stringify(event, null, 2));
    const body = JSON.parse(event.body);
    if (body.message) {
      const { chat, text } = body.message;
      await bot.handleCommand(chat, text);
    }
  } catch (error) {
    console.log(error);
  }
  return { statusCode: 200 };
};

// Called from CloudWatch scheduled event
exports.hanocron = (event, context, callback) => {
  try {
    console.log('Received event:', JSON.stringify(event, null, 2));
    crawl.run(event).finally(() => {
      callback(null, 'Finished');
    });
  } catch (error) {
    console.log(error);
    callback(null, 'Finished');
  }
};