// https://blog.logrocket.com/natural-language-processing-for-node-js/
// http://naturalnode.github.io/natural/tfidf.html
// npm i -s rss-parser natural
const rp = require('request-promise');
const rssParser = require('rss-parser');
const cheerio = require('cheerio');
const natural = require('natural');
const {asyncfor, unique} = require('./utils');
 
const rssDB = require('./db/db_rssfeed');
const visitDB = require('./db/db_visits');
const hanoDB = require('./db/hanodb');
const telegram = require('./telegram');


async function readFeeds(callback) {
    // Get rss feed sources
    let feeds = await rssDB.all();
    let visits = await visitDB.all();

    let parser = new rssParser();    

    await asyncfor(feeds, async rss => {
        try {
            let feed = await parser.parseURL(rss.link);        
            const newItems = feed.items.filter(x => !visits.includes(x.link));
            await asyncfor(newItems, async item => {
                try {
                    const html = await rp(item.link);
                    const $ = cheerio.load(html);
                    const text = $(rss.selector).text();
                    await visitDB.add(item.link);
                    await callback(rss, feed, item, html, text);                    
                } catch (error) {
                    console.log(error.message);                    
                }
            });            
        } catch (error) {
            console.log(error.message);
        }
    });
}

function makeTfidf(language) {
    var tfidf = new natural.TfIdf();
    let pattern;
    switch (language) {
        case 'he':
            pattern = /[^\u0590-\u05FFA-Za-z0-9_"]+/;
            tfidf.setStopwords(require('./stopwords_he.js').stop_words);         
            break;
        default:
            pattern = /[^A-Za-zА-Яа-я0-9_]+/;
            break;
    }
    tfidf.setTokenizer(new natural.RegexpTokenizer({pattern: pattern}));
    return tfidf;
}

exports.run = async () => {

    // Get all users
    const users = await hanoDB.allUsers();

    // Parse all feeds
    await readFeeds(async (rss, feed, item, html, text) => {
        try {
            var tfidf = makeTfidf(rss.language);
            tfidf.addDocument(item.title.toLowerCase() + ' ' + (item.description ? item.description : '') + ' ' + text.toLowerCase());
            const terms = tfidf.listTerms(0).sort((lh, rh) => lh.tfidf - rh.tfidf).filter(x=>x.tfidf);
            const maxtfidf = terms[terms.length - 1].tfidf;
            const keywords = Object.fromEntries(terms.map(x=>[x.term, x.tfidf/maxtfidf]));
    
            // Report to relevant users
            asyncfor(users, async user => {
                try {
                    let found = [];
                    let invConfidence = 1;
                    for(const term in keywords) {
                        for(const key of user.keywords) {
                            if(term.includes(key)) {
                                found.push(key);
                                invConfidence *= (1 - keywords[key]);
                            }
                        }
                    }
        
                    if(found.length > 0 && invConfidence) {
                        const confidence = Math.round((1 - invConfidence) * 10000) / 100;
                        const msg = `*Found keywords:*\n\t${unique(found).join('\n\t')}\n*Importance:* ${confidence}%\n\n*At website:*\n\t${item.link}`;
                        await telegram.sendMessage(user.chatId, msg);
                    }                    
                } catch (error) {
                    console.log(error.message);                    
                }
            });            
        } catch (error) {
            console.log(error.message);
        }
    });

};
