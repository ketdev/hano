// npm install --save request request-promise cheerio puppeteer
const fs = require('fs');
const rp = require('request-promise');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const HANO_DB_FILENAME = 'HANO.db';

function unique(list) {
    return [...new Set(list)];
}

async function readPage(url) {
    try {
        const html = await rp(url);
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
    const url = require('url');
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

function dbWriteVisit(url, matches) {
    const row = { url: url, matches: matches };
    fs.appendFileSync(HANO_DB_FILENAME, JSON.stringify(row) + '\n');
}

function dbLoadVisits() {
    try {
        const rawdata = fs.readFileSync(HANO_DB_FILENAME);
        const lines = rawdata.toString().split(/\r?\n/);
        const arr = lines.map(l => l.length > 0 ? JSON.parse(l) : null).filter(x => x);
        const obj = Object.fromEntries(arr.map(x => [x.url, x.matches]));
        return obj;
    } catch (error) {
        return {};
    }
}

async function extract(domain, keywords) {
    let visits = dbLoadVisits();

    // restart from domain
    delete visits[domain];
    let urlStack = [domain,];

    while (urlStack.length > 0) {
        const next = urlStack.pop();
        if (next in visits) continue;

        const html = await readPage(next);
        let matches = null;
        if (html != null) {

            // crawl for more links
            const links = crawl(domain, html);
            const newLinks = links.filter(x => !(x in visits) && !(urlStack.includes(x)));
            urlStack = unique(urlStack.concat(newLinks));

            // search for keywords on page data
            const text = htmlText(html);
            matches = matchKeywords(text, keywords);
            if (matches.length > 0) {
                console.log(`Found keywords ${matches} in ${next}`);
            }
        }
        dbWriteVisit(next, matches);
        visits[next] = matches;
    }

    return visits;
}

// async function puppet() {
//     const browser = await puppeteer.launch({ headless: false });
//
//     const page = await browser.newPage();
//     const response = await page.goto(url);
//     const html = await response.text();
//     console.log(html);
// }


// TODO:
//  1. get links in depth of 1 only
//  2. support a list of initial urls
//  3. loop through url list on a timer schedule
//  4. fix writing to db file, repeating domain
//  5. check if can send telegram messages on find

async function main() {
    const url = 'https://www.jpost.com/';
    const keywords = ['environment',];

    const visits = await extract(url, keywords);

    return visits;
}

main().then(
    text => {
        console.log(text);
    },
    err => {
        console.log(err.message);
        console.log(err.stack);
    }
);
