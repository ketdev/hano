const db = require('./_db');

const PATH = `/articles`;
exports.article = (url, feedID, providerID, language, title, image, description, author, pubDate, text) => ({ 
    url, 
    feedID, 
    providerID, 
    language, 
    title, 
    image,
    description, 
    author, 
    pubDate, 
    text, 
    timestamp: new Date().toISOString()
});

exports.add = async (article) => await db.add(PATH, article);
exports.find = async (url) => await db.first(PATH, 'url', '==', url);
exports.query = async (id) => await db.query(PATH, id);