const Accounts = require('../db/accounts');
const Feeds = require('../db/feeds');
const Articles = require('../db/articles');
const ServerEvents = require('../db/server-events');

const rp = require('request-promise');
const natural = require('natural');
const cheerio = require('cheerio');
const { URL } = require('url');
const { unique } = require('../utils');

async function logStart() {
    await ServerEvents.startCron();
}

async function logEnd() {
    await ServerEvents.stopCron();
}

async function readXml(url) {
    try {     
        return cheerio.load(await rp(url), {xmlMode: true});                
    } catch (error) {
        await ServerEvents.serverError(`Failed to read: ${url}`);
        return null;
    }
}

async function parseRssLink(url, $, item) {
    try {     
        return $(item).find('link').text() || null;
    } catch (error) {
        await ServerEvents.serverError(`Failed to parse RSS link for ${url}`);
        return null;
    }
}

async function parseRssData(link, url, $, item) {
    try {
        // Extract rss data
        const title = $(item).find('title').text() || null;
        const creator = $(item).find('dc\\:creator').text() || null;
        const isoDate = $(item).find('pubDate').text() || null;

        let description = $(item).find('media\\:description').text()
                        || $(item).find('description').text() 
                        || null;
        const $d = cheerio.load(description, {xmlMode: true});
        description = $d('h1').text() || description;

        const image = $(item).find('media\\:thumbnail').attr('url') 
                    || $(item).find('media\\:content').attr('url') 
                    || $d('img').attr('src') 
                    || null;

        if (title == null || description == null) {
            await ServerEvents.serverWarning(`Failed to parse fields for ${url} in ${link}`);
        }
        return { title, description, creator, isoDate, image };
    } catch (error) {
        await ServerEvents.serverError(`Failed to parse RSS data for ${url} in ${link}`);
        return null;
    }
}

async function readArticleTextAndImage(link, selector, imageSelector) {    
    const html = await rp(link);
    const $ = cheerio.load(html);

     // remove line breaks and double spaces
    let text = $(selector).text()
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ +(?= )/g,'')
        .trim();
    if (text.length == 0) {
        await ServerEvents.serverWarning(`Selector ${selector} returned empty string: ${link}`);
        text = null;
    }

    // attempt to load image from article
    let image = null;
    const imageRel = imageSelector != null ? $(imageSelector).attr('src') : null;
    if (imageRel != null && imageRel.length == 0) {
        await ServerEvents.serverWarning(`Image selector ${imageSelector} returned empty string: ${link}`);     
    } 
    image = imageRel != null ? (new URL(imageRel, link)).href : null;

    return {text, image};
}

async function readArticles() {
    let newArticles = [];
    const feeds = await Feeds.all();
    for (const feed of feeds) {
        for (const link of feed.links) {
            const $ = await readXml(link);
            if ($ == null) continue;

            // Run all articles simultaneously
            newArticles = newArticles.concat((await Promise.all($('item').map(async (i, item) => {
                try {
                    const url = await parseRssLink(link, $, item);
                    if (url == null) return null;

                    // filter ignored links                    
                    if (feed.ignore && feed.ignore.includes(url)) 
                        return null;

                    // filter our already read links
                    const found = await Articles.find(url);
                    if (found != null) return null;

                    // Extract rss data
                    const data = await parseRssData(link, url, $, item);
                    if (data == null) return null;
        
                    // Read article content, and image if failed to get from rss data
                    const {text, image} = await readArticleTextAndImage(url, feed.selector, data.image == null ? feed.imageSelector : null);

                    data.image = data.image || image || null;
                    if (data.image == null) {
                        await ServerEvents.serverWarning(`Couldn't read image for ${url} in ${link}`);
                    }

                    // Construct article and save to db
                    const article = Articles.article(url, feed.id, feed.providerID, feed.language, data.title, data.image, data.description, data.creator, data.isoDate, text);
                    article.id = await Articles.add(article);
                    return article;
                } catch (error) {
                    await ServerEvents.serverError(`Server error: ${error}`);
                    return null;                    
                }
            }).get())).filter(n => n));
        }
    }
    return newArticles;
}

function extractKeywords (article) {
    var tfidf = new natural.TfIdf();
    let pattern;
    switch (article.language) {
        case 'he':
            pattern = /[^\u0590-\u05FFA-Za-z0-9_"]+/;
            tfidf.setStopwords(require('./stopwords_he.js').stop_words);         
            break;
        default:
            pattern = /[^A-Za-zА-Яа-я0-9_]+/;
            break;
    }
    tfidf.setTokenizer(new natural.RegexpTokenizer({pattern: pattern}));
    tfidf.addDocument(
        ((article.title || '') + ' ' + (article.description || '') + ' ' + (article.text || '')).toLowerCase()
    );
    const terms = tfidf.listTerms(0).sort((lh, rh) => lh.tfidf - rh.tfidf).filter(x=>x.tfidf);
    const maxtfidf = terms[terms.length - 1].tfidf;
    const keywords = Object.fromEntries(terms.map(x=>[x.term, x.tfidf/maxtfidf]));

    return keywords;
}

async function matchAccounts(newArticles) {
    const accounts = await Accounts.all();
    for (const article of newArticles) {
        const keywords = extractKeywords(article);

        for (const account of accounts) {
            try {
                // filter irrelevant accounts
                if (account.blacklistProviderIDs.includes(article.providerID)) {
                    continue;
                }

                // calculate match and confidence percentage
                let found = [];
                let invConfidence = 1;
                for(const term in keywords) {
                    for(const key of account.keywords) {
                        if(term.includes(key)) {
                            found.push(key);
                            invConfidence *= (1 - keywords[key]);
                        }
                    }
                }
    
                // Add article match to account
                if(found.length > 0 && invConfidence) {
                    const confidence = Math.round((1 - invConfidence) * 10000) / 100;
                    const match = Accounts.accountMatch(article.id, unique(found), confidence);

                    await Accounts.addMatch(account.id, match);

                    // TODO: send notification

                }
            } catch (error) {
                console.log(error.message);                    
            }
        }
    }
}

exports.run = async (context) => {
    // const Provider = require('../db/provider');
    // await Provider.createProviderWithFeeds(
    //     'The New York Times', 
    //     'gs://hano-server.appspot.com/provider-images/nytimes.png', [
    //         { links: [
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Education.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Dealbook.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/US.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/MediaandAdvertising.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/SmallBusiness.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Africa.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/PersonalTech.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Americas.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/YourMoney.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/EnergyEnvironment.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Economy.xml',
    //         ], 
    //         selector: 'section[name="articleBody") .StoryBodyCompanionColumn', 
    //         imageSelector: null,
    //         language: 'en', 
    //         ignore: []
    //     }
    // ]);

    // await Accounts.add({
    //     keywords: ['bitcoin', 'Israel'],
    //     sourceIds: ['13Xkijppo6mY7SOMCx4O', '3fI6qQOr5gRn34YU0mXt']
    // });
    
    await logStart();

    // Read articles
    const newArticles = await readArticles();

    // Process articles and forward
    await matchAccounts(newArticles);

    await logEnd();
    return null;
};