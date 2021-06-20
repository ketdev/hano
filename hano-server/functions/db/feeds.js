const db = require('./_db');

const PATH = `/feeds`;
exports.feed = (providerID, language, selector, links) => ({ 
    providerID, language, selector, links
});

exports.foreach = async (callback) => await db.foreach(PATH, callback);
exports.all = async () => await db.all(PATH);
exports.add = async (provider) => await db.add(PATH, provider);
exports.query = async (id) => await db.query(PATH, id);
exports.delete = async (id) => await db.delete(PATH, id);
