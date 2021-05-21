// npm install --save request request-promise cheerio urijs
const rp = require('request-promise');
const cheerio = require('cheerio');
const { unique } = require('./utils');
const hanodb = require('./hanodb');
var URI = require('urijs');

// USING PUPPETEER
// npm install --save chrome-aws-lambda puppeteer-core
//  https://github.com/shelfio/chrome-aws-lambda-layer
//  https://github.com/alixaxel/chrome-aws-lambda
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core'); // LOCAL ONLY

exports.browser = async (callback) => {
    let browser = null;
    try {
        // Load browser
        // browser = await puppeteer.launch({ 
        //     headless: false,
        //     executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' 
        // });
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        await callback(browser);

    } catch (error) {
        console.log(error);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
};

exports.readPage = async (uri) => {
    try {
        const html = await rp(uri);
        return html;
    } catch (error) {
        console.log(error);
        return null;
    }
};

exports.readBrowserPage = async (browser, uri) => {
    let page = null;
    try {
        page = await browser.newPage();

        // disable images
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (request.resourceType() === 'image'
                || request.resourceType() === 'stylesheet'
                || request.resourceType() === 'font') {
                request.abort();
            }
            else {
                request.continue();
            }
        });

        const response = await page.goto(uri);
        return await response.text();
    } catch (error) {
        console.log(error);
        return null;
    } finally {
        page.close();
    }
};
