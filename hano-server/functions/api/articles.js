// client-side app for login proxy
const AccountsDB = require('../db/accounts');
const ArticlesDB = require('../db/articles');
const { asyncmap } = require('../utils');

exports.accountArticles = async (request, response) => {
    try {
        // build structure
        const matches = await AccountsDB.allMatches(request.account.id);        
        const ret = await asyncmap(matches, async match => {
            const article = await ArticlesDB.query(match.articleID);
            return {
                matchID: match.id,
                articleID: match.articleID,
                bookmarked: match.bookmarked,
                seen: match.seen, 
                keywords: match.keywords, 
                confidence: match.confidence, 
                timestamp: match.timestamp,
                url: article.url, 
                language: article.language, 
                title: article.title, 
                description: article.description, 
                author: article.author, 
                pubDate: article.pubDate
            };
        });

        return response.json(ret);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: error.code });
    }
};
