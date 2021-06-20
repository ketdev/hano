const rp = require('request-promise');
const rssParser = require('rss-parser');
const cheerio = require('cheerio');

const Feeds = require('../db/feeds');
const Articles = require('../db/articles');
const { asyncmap, asyncfilter } = require('./utils');

exports.readFeeds = async (callback) => {
    await Feeds.foreach(async (feedID, feed) => {
        try {
            let parser = new rssParser();

            // get urls from feed links
            const items = (await asyncmap(feed.links, async link => {
                const f = await parser.parseURL(link);
                return f.items;
            })).flat();
            
            // filter our already read links
            const newItems = await asyncfilter(items, async x => {
                try {
                    const q = await Articles.find(x.link);
                    return q.length == 0;
                } catch (error) {
                    console.log(error.message);
                    return false;
                }
            });

            // read new articles
            await asyncmap(newItems, async item => {
                try {
                    // Construct article
                    let html = '';
                    try {
                        html = await rp(item.link);
                    } catch (error) {  
                        console.log(`Couldn't read: ${item.link}`);
                        return;
                    }
                    
                    const $ = cheerio.load(html);
                    const text = $(feed.selector).text();
                    if (text.length == 0) {
                        console.log(`Selector returned empty string: ${item.link}`);
                    }

                    const article = Articles.article(
                        item.link, 
                        feedID, 
                        feed.providerID,
                        feed.language, 
                        item.title || null,
                        item.contentSnippet || null,
                        item.creator || null,
                        item.isoDate || null,
                        text
                    );

                    const articleID = await Articles.add(article);
                    article.id = articleID;

                    await callback(article);
                   
                } catch (error) {  
                    console.log(error.message);  
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    });
};
