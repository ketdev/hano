// npm install --save request request-promise cheerio puppeteer
// npm install --save node-telegram-bot-api

const fs = require('fs');
const rp = require('request-promise');
// const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
// http://t.me/TGHanoBot
const TELEGRAM_TOKEN = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const TGHanoBot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// ----------------------------------------------------------------------------
// SETTINGS

const VISITS_DB_FILENAME = 'visits.db';
const CHATID_DB_FILENAME = 'chats.db';

// ----------------------------------------------------------------------------
// CRAWL LOGIC

function unique(list) {
    return [...new Set(list)];
}

async function readPage(uri) {
    try {
        const html = await rp(uri);
        return html;
    } catch (error) {
        console.log(error);
        return null;
    }
}

function htmlSelector(html, selector) {
    const $ = cheerio.load(html);
    const data = $(selector, html);
    let items = [];
    for (const e of data) {
        items.push(e);
    }
    return items;
}

function htmlText(html) {
    const $ = cheerio.load(html);
    return $('html *').contents().map(function () {
        return (this.type === 'text') ? $(this).text() + ' ' : '';
    }).get().join('');
}

function crawl(domain, html) {
    const linkNodes = htmlSelector(html, 'a')
    const links = linkNodes.filter(x => x && x.attribs && x.attribs.href).map(x => x.attribs.href.toLowerCase());
    const withinDomain = unique(links.filter(x => x && (x[0] == '/' || x[0] == '\\' || x.includes(domain))));
    const fullLink = withinDomain.map(x => {
        if (x[0] == '/' || x[0] == '\\') {
            return new URL(x, domain).toString();
        }
        return new URL(x).toString();
    });
    return unique(fullLink);
}

function matchKeywords(text, keywords) {
    var regexMetachars = /[(){[*+?.\\^$|]/g;
    for (var i = 0; i < keywords.length; i++) {
        keywords[i] = keywords[i].replace(regexMetachars, "\\$&");
    }
    var regex = new RegExp("\\b(?:" + keywords.join("|") + ")\\b", "gi");
    return text.match(regex) || [];
}

async function scan(pages, keywords, callback){
    const visits = dbLoadVisits();

    for(const page of pages){
        // Re-read the page frequently
        const html = await readPage(page);
        if (html == null) continue;

        // Check for new content links
        const links = crawl(page, html);
        for(const link of links) {
            // Detect new links only
            if (link in visits) continue;
            console.log(link);

            // search for keywords on page data
            const data = await readPage(link);            
            const text = htmlText(data);
            matches = unique(matchKeywords(text, keywords).map(x=>x.toLowerCase()));
            if (matches.length > 0) {
                callback(link, matches);
            }

            // set as visited page for future searches
            dbWriteVisit(link, matches);
        }
    }
}

// ----------------------------------------------------------------------------
// DATABASE
// TODO: these should be thread safe

function dbWriteVisit(uri, matches) {
    const row = { url: uri, matches: matches };
    fs.appendFileSync(VISITS_DB_FILENAME, JSON.stringify(row) + '\n');
}

function dbLoadVisits() {
    try {
        const rawdata = fs.readFileSync(VISITS_DB_FILENAME);
        const lines = rawdata.toString().split(/\r?\n/);
        const arr = lines.map(l => l.length > 0 ? JSON.parse(l) : null).filter(x => x);
        const obj = Object.fromEntries(arr.map(x => [x.url, x.matches]));
        return obj;
    } catch (error) {
        return {};
    }
}

function dbChatIdWrite(chatId) {
    fs.appendFileSync(CHATID_DB_FILENAME, chatId.toString() + '\n');
}

function dbLoadChatIds() {
    try {
        const rawdata = fs.readFileSync(CHATID_DB_FILENAME);
        const lines = rawdata.toString().split(/\r?\n/);
        const arr = lines.map(x => parseInt(x)).filter(x=>x);
        return unique(arr);
    } catch (error) {
        return [];
    }
}

var DBKeywords = [];
var DBWebsites = [];

// Data structure:
//  ChatId -> [Keywords], [Websites], [Visited]
const struct = {
    123456: {
        "Keywords": [],
        "Websites": [],
        "Visited": []
    },
};

function loadUser(chatId) {
    return {
        "Keywords": [],
        "Websites": [],
        "Visited": []
    };
}

function storeUser(chatId, keywords, websites, visited) {

}

// ----------------------------------------------------------------------------
// BOT COMMANDS

function escapeMsg(str) {
    return str.toString()
        .replace(/_/gi, "\\_")
        .replace(/-/gi, "\\-")
        .replace("~", "\\~")
        .replace(/</gi, "\\<")
        .replace(/>/gi, "\\>")
        .replace(/`/gi, "\\`")
        .replace(/=/gi, "\\=")
        .replace(/\./g, "\\.");
}

function onStart(msg) {
    const chatId = msg.chat.id;
    dbChatIdWrite(chatId);

    // automatically call help on start
    onHelp(msg);
}

function onHelp(msg) {
    // *bold text*
    // _italic text_
    // __underline__
    // ~strikethrough~
    // *bold _italic bold ~italic bold strikethrough~ __underline italic bold___ bold*
    // [inline URL](http://www.example.com/)
    // [inline mention of a user](tg://user?id=123456789)
    const chatId = msg.chat.id;
    const helpMessage = `Hi ${escapeMsg(msg.from.first_name)},
This is a list of all the commands this bot supports\\.

/help \\- show this message
/run \\- runs the scan command explicitly

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
    TGHanoBot.sendMessage(chatId, helpMessage, { parse_mode: 'MarkdownV2' });
}

function onRun(msg) {
    const chatId = msg.chat.id;
    scan(DBWebsites, DBKeywords, (url, matches) => {
        const msg = `*Found keywords:*\n\t${escapeMsg(matches.join('\n\t'))}\n\n*In website:*\n\t${escapeMsg(url)}`;
        TGHanoBot.sendMessage(chatId, msg, { parse_mode: 'MarkdownV2' });
    });
}

function onKeywordShow(msg) {
    const chatId = msg.chat.id;
    const showMsg = `*Current keywords:*\n\t${escapeMsg(DBKeywords.join('\n\t'))}`;
    TGHanoBot.sendMessage(chatId, showMsg, { parse_mode: 'MarkdownV2' });
}
function onKeywordAdd(msg, match) {
    const chatId = msg.chat.id;
    const keywords = match[1].split(' ');
    DBKeywords = unique(DBKeywords.concat(keywords));
    TGHanoBot.sendMessage(chatId, `Added keyword${keywords.length > 0 ? 's': ''}\\!`, { parse_mode: 'MarkdownV2' });
}
function onKeywordDel(msg, match) {
    const chatId = msg.chat.id;
    const keywords = match[1].split(' ');
    DBKeywords = DBKeywords.filter(x => !keywords.includes(x));
    TGHanoBot.sendMessage(chatId, `Deleted keyword${keywords.length > 0 ? 's': ''}\\!`, { parse_mode: 'MarkdownV2' });
}

function onWebsiteShow(msg) {
    const chatId = msg.chat.id;
    const showMsg = `*Current websites:*\n\t${escapeMsg(DBWebsites.join('\n\t'))}`;
    TGHanoBot.sendMessage(chatId, showMsg, { parse_mode: 'MarkdownV2' });
}
function onWebsiteAdd(msg, match) {
    const chatId = msg.chat.id;
    const websites = match[1].split(' ');
    DBWebsites = unique(DBWebsites.concat(websites));
    TGHanoBot.sendMessage(chatId, `Added website${websites.length > 0 ? 's': ''}\\!`, { parse_mode: 'MarkdownV2' });
}
function onWebsiteDel(msg, match) {
    const chatId = msg.chat.id;
    const websites = match[1].split(' ');
    DBWebsites = DBWebsites.filter(x => !websites.includes(x));
    TGHanoBot.sendMessage(chatId, `Deleted website${websites.length > 0 ? 's': ''}\\!`, { parse_mode: 'MarkdownV2' });
}

// ----------------------------------------------------------------------------

// TODO:
//  * on add website, store all links as visited at first (only detect new stuff)
//  * hide token from github, put in 1Password
//  * store data per chatid on a database somewhere - threadsafe
//  * loop through url list on a timer schedule - main loop - notify 
//  * remove '/run' command
//  * put code in server

//  TELEGRAM DOCS
//      https://core.telegram.org/bots
//      https://levelup.gitconnected.com/create-your-own-telegram-bot-and-send-and-receive-messages-via-nodejs-c0954928a8c4
//      https://github.com/yagop/node-telegram-bot-api/blob/master/doc/api.md#telegrambotgetchatmemberchatid-userid--promise
//


function setupBot() {
    TGHanoBot.onText(/\/start/, onStart);

    TGHanoBot.onText(/\/help/, onHelp);
    TGHanoBot.onText(/\/run/, onRun);

    // Keyword commands
    TGHanoBot.onText(/\/keyword show/, onKeywordShow);
    TGHanoBot.onText(/\/keyword add (.+)*/, onKeywordAdd);
    TGHanoBot.onText(/\/keyword del (.+)*/, onKeywordDel);

    // Website commands
    TGHanoBot.onText(/\/website show/, onWebsiteShow);
    TGHanoBot.onText(/\/website add (.+)*/, onWebsiteAdd);
    TGHanoBot.onText(/\/website del (.+)*/, onWebsiteDel);
}

async function main() {

    // const pages = ['https://www.jpost.com/coronavirus']; // 'https://www.jpost.com/',
    // const keywords = ['environment',];

    // await scan(pages, keywords, (url, matches) => {
    //     const msg = `Found keywords ${matches} in ${url}`;
    //     console.log(msg);
    // });

    // const visits = await extract(page, keywords);

    setupBot();
    // return visits;
}

main().then(
    text => {
        // console.log(text);
    },
    err => {
        console.log(err.message);
        console.log(err.stack);
    }
);
