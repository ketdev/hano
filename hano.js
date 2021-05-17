// npm install --save request request-promise cheerio puppeteer
const rp = require('request-promise');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

function unique(list) {
    return [...new Set(list)];
}
async function readPage(url) {
    const html = await rp(url);
    return html;
}
async function htmlSelector(html, selector) {
    const $ = cheerio.load(html);
    const data = $(selector, html);
    var items = [];
    for (const e of data){
        items.push(e);
    }
    return items;
}
async function crawl(url, html) {
    const linkNodes = await htmlSelector(html, 'a')
    const links = linkNodes.filter(x=>x && x.attribs && x.attribs.href).map(x => x.attribs.href.toLowerCase());
    const withinDomain = unique(links.filter(x => x && (x[0] == '/' || x[0] == '\\' || x.includes(url))));
    const fullLink = withinDomain.map(x => {
        if (x[0] == '/' || x[0] == '\\') {
            return url + x;
        }
        return x;
    });
    return fullLink;
}

async function extract(url) {
    const html = await readPage(url);
    const links = await crawl(url, html);
    
    console.log(links);
}

// async function puppet() {
//     const browser = await puppeteer.launch({ headless: false });

//     const page = await browser.newPage();
//     const response = await page.goto(url);
//     const html = await response.text();
//     console.log(html);
// }

async function main() {
    
    const url = 'https://www.jpost.com';

    return extract(url);
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
