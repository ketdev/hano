
// npm install --save request request-promise

//  TELEGRAM DOCS
//      https://core.telegram.org/bots
//      https://levelup.gitconnected.com/create-your-own-telegram-bot-and-send-and-receive-messages-via-nodejs-c0954928a8c4
//      https://github.com/yagop/node-telegram-bot-api/blob/master/doc/api.md#telegrambotgetchatmemberchatid-userid--promise
//
// Connect webhook:
//      curl --request POST --url https://api.telegram.org/bot1870141167:AAFTIEDYx3wG0YNR_M2zUbm67_k9cqYbzL4/setWebhook --header 'content-type: application/json' --data '{"url": "https://7byjf02ndc.execute-api.us-east-2.amazonaws.com/hanobot"}'

const rp = require('request-promise');

// Create a bot that uses 'polling' to fetch new updates
const TELEGRAM_TOKEN = 'XXXXXXXXXXXXXXXXXXXXXX'; // http://t.me/TGHanoBot

// -- Formatting --
// *bold text*
// _italic text_
// __underline__
// ~strikethrough~
// *bold _italic bold ~italic bold strikethrough~ __underline italic bold___ bold*
// [inline URL](http://www.example.com/)
// [inline mention of a user](tg://user?id=123456789)

exports.sendMessage = async (chatId, text) => {
    const escaped = text.replace(/(\[[^\][]*]\([^()]*\))|[-.+?^!#$[\](){}\\]/g, (x,y) => y ? y : '\\' + x)
    const options = {
        method: 'GET',
        uri: `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        qs: {
            chat_id: chatId,
            text: escaped,
            parse_mode: 'MarkdownV2'
        }
    };

    return rp(options);
};
