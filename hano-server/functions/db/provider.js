const db = require('./_db');

const PATH = `/provider`;
exports.provider = (name, imageUrl, feedIDs) => ({ 
    name, 
    imageUrl, 
    feedIDs 
});

exports.foreach = async (callback) => await db.foreach(PATH, callback);
exports.all = async () => await db.all(PATH);
exports.add = async (provider) => await db.add(PATH, provider);
exports.query = async (id) => await db.query(PATH, id);
exports.find = async (name) => await db.where(PATH, 'name', '==', name);
exports.delete = async (id) => await db.delete(PATH, id);

exports.addFeed = async (id, feedIDs) => {
    const doc = await db.query(PATH, id);
    const combined = [...doc.feedIDs, ...feedIDs];
    await db.update(PATH, id, {feedIDs: combined});
};


exports.createProviderWithFeeds = async (name, image, feeds) => {
    const Feeds = require('./feeds');
    const pId = await exports.add(exports.provider(name, image, []));
    const feedIds = await Promise.all(feeds.map(async f => await Feeds.add(Feeds.feed(pId, f.language, f.selector, f.links))));
    await exports.addFeed(pId, feedIds);
};