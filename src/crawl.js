// npm install --save request request-promise cheerio urijs
var URI = require('urijs');
const cheerio = require('cheerio');
const { unique } = require('./utils');
const hanodb = require('./hanodb');
const puppet = require('./puppet');
const telegram = require('./telegram');

function htmlSelector(html, selector) {
    const $ = cheerio.load(html);
    const data = $(selector, html);
    let items = [];
    for (const e of data) {
        items.push(e);
    }
    return items;
}

function crawl(url, html) {
    const domain = new URI(url).domain();
    const linkNodes = htmlSelector(html, 'a')
    const links = linkNodes.filter(x => x && x.attribs && x.attribs.href).map(x => x.attribs.href.toLowerCase());
    const withinDomain = unique(links.filter(x => x && (x[0] == '/' || x[0] == '\\' || x.includes(domain))));
    const fullLink = withinDomain.map(x => {
        if (x[0] == '/' || x[0] == '\\') {
            return new URL(x, url).toString();
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
    var regex = new RegExp("(?:" + keywords.join("|") + ")", "gi");
    return text.match(regex) || [];
}

exports.run = async (event) => {
    await puppet.browser(async browser => {

        // Get all users
        const users = await hanodb.allUsers();
        const websites = unique(users.flatMap(x => x.websites));
        const keywords = unique(users.flatMap(x => x.keywords));

        // Get visits
        let visits = await hanodb.loadVisits();
        let newWebsites = await hanodb.loadNewWebsites();
        
        // Update visited by new websites
        for (const website of newWebsites) {
            const html = await puppet.readBrowserPage(browser, website);
            const links = crawl(website, html);
            visits = unique(visits.concat(links));
        }

        // Read all websites
        let websiteData = {};
        for (const website of websites) {
            websiteData[website] = await puppet.readBrowserPage(browser, website);
        }

        // Check new links for matches
        let found = [];
        for (const website in websiteData) {
            const html = websiteData[website];
            const newLinks = crawl(website, html).filter(x => !visits.includes(x));

            for (const link of newLinks) {
                const data = await puppet.readBrowserPage(browser, link);
                if (data == null) {
                    console.log(`Failed to read link: ${link}`);
                    continue;
                }
                const match = unique(matchKeywords(data, keywords).map(x => x.toLowerCase()));
                if (match.length > 0) {
                    found.push({
                        website: website,
                        link: link,
                        match: match
                    });
                }
            }

            // update visits
            visits = unique(visits.concat(newLinks));
        }

        // update visits for next run
        await hanodb.storeVisits(visits, []);

        // Report to relevant users
        for (const find of found) {
            for (const u of users) {
                const filteredKeywords = u.keywords.filter(x => find.match.includes(x));
                if (u.websites.includes(find.website) && filteredKeywords.length > 0) {
                    const msg = `*Found keywords:*\n\t${filteredKeywords.join('\n\t')}\n\n*At website:*\n\t${find.link}`;
                    await telegram.sendMessage(u.chatId, msg);
                }
            }
        }
    });
};
