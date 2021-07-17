const db = require('./_db');

const PATH = `/feeds`;
exports.feed = (providerID, language, selector, imageSelector, links, ignore) => ({ 
    providerID, language, selector, imageSelector, links, ignore
});

exports.foreach = async (callback) => await db.foreach(PATH, callback);
exports.all = async () => await db.all(PATH);
exports.add = async (provider) => await db.add(PATH, provider);
exports.query = async (id) => await db.query(PATH, id);
exports.delete = async (id) => await db.delete(PATH, id);
