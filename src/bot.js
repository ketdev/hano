const telegram = require('./telegram');
const { unique } = require('./utils');
const hanodb = require('./hanodb');
const crawl = require('./crawl');

async function onHelp(chat) {
    const helpMessage = `Hello ${chat.first_name}
This is a list of all the commands this bot supports.

/help - show this message
/run - runs the scan command explicitly

*Keyword commands*
/keyword show
/keyword add _keywords_
/keyword del _keywords_

*Website commands*
/website show
/website add _websites_
/website del _websites_

*_Note:_* for multiple _keywords_ or _websites_ separate them by spaces
`
    await telegram.sendMessage(chat.id, helpMessage);
}
async function onEcho(chat, match) {
    const line = match[1].toString();
    await telegram.sendMessage(chat.id, line);
}

async function onKeywordShow(chat) {
    const user = await hanodb.loadUserOrCreate(chat.id);
    const showMsg = `*Current keywords:*\n\t${user.keywords.join('\n\t')}`;
    await telegram.sendMessage(chat.id, showMsg);
}
async function onKeywordAdd(chat, match) {
    const keywords = match[1].split(' ');
    const user = await hanodb.loadUserOrCreate(chat.id);
    user.keywords = unique(user.keywords.concat(keywords));
    await hanodb.storeUser(user);
    await telegram.sendMessage(chat.id, `Added keyword${keywords.length > 0 ? 's' : ''}!`);
}
async function onKeywordDel(chat, match) {
    const keywords = match[1].split(' ');
    const user = await hanodb.loadUserOrCreate(chat.id);
    user.keywords = user.keywords.filter(x => !keywords.includes(x));
    await hanodb.storeUser(user);
    await telegram.sendMessage(chat.id, `Deleted keyword${keywords.length > 0 ? 's' : ''}!`);
}

async function onWebsiteShow(chat) {
    const user = await hanodb.loadUserOrCreate(chat.id);
    const showMsg = `*Current websites:*\n\t${user.websites.join('\n\t')}`;
    await telegram.sendMessage(chat.id, showMsg);
}
async function onWebsiteAdd(chat, match) {
    const websites = match[1].split(' ');
    const user = await hanodb.loadUserOrCreate(chat.id);
    user.websites = unique(user.websites.concat(websites));

    // store as new website
    const visits = await hanodb.loadVisits();
    const newWebsites = await hanodb.loadNewWebsites();
    await hanodb.storeVisits(visits, newWebsites.concat(websites.filter(x=>!visits.includes(x))));

    await hanodb.storeUser(user);
    await telegram.sendMessage(chat.id, `Added website${websites.length > 0 ? 's' : ''}!`);
}
async function onWebsiteDel(chat, match) {
    const websites = match[1].split(' ');
    const user = await hanodb.loadUserOrCreate(chat.id);
    user.websites = user.websites.filter(x => !websites.includes(x));
    await hanodb.storeUser(user);
    await telegram.sendMessage(chat.id, `Deleted website${websites.length > 0 ? 's' : ''}!`, { parse_mode: 'MarkdownV2' });
}

exports.handleCommand = async (chat, text) => {
    try {
        const route = async (regex, func) => {
            const match = text.match(regex);
            if (match) {
                await func(chat, match);
            }
        };

        await route(/^\/start/g, onHelp);
        await route(/^\/help/g, onHelp);
        await route(/^\/echo (.+)*/, onEcho);

        // Keyword commands
        await route(/^\/keyword show/, onKeywordShow);
        await route(/^\/keyword add (.+)*/, onKeywordAdd);
        await route(/^\/keyword del (.+)*/, onKeywordDel);

        // Website commands
        await route(/^\/website show/, onWebsiteShow);
        await route(/^\/website add (.+)*/, onWebsiteAdd);
        await route(/^\/website del (.+)*/, onWebsiteDel);

    } catch (error) {
        console.log(error);
        const message = `*Input:* ${text}, \n*Error:* ${error.message}`;
        await telegram.sendMessage(chat.id, message, { parse_mode: 'MarkdownV2' });
    }
};