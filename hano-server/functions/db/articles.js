const db = require('./_db');

const PATH = `/articles`;
exports.article = (url, feedID, providerID, language, title, description, author, pubDate, text) => ({ 
    url, 
    feedID, 
    providerID, 
    language, 
    title, 
    description, 
    author, 
    pubDate, 
    text, 
    timestamp: new Date().toISOString()
});

exports.add = async (article) => await db.add(PATH, article);
exports.find = async (url) => await db.where(PATH, 'url', '==', url);