const dynamodb = require('./dynamodb');

const TABLENAME = 'hano_db';
const PKNAME = 'chatId';

function dynamoToJsUser(dynUser) {
    return {
        chatId: parseInt(dynUser.chatId.N),
        keywords: dynUser.keywords.L.map(x=>x.S),
        websites: dynUser.websites.L.map(x=>x.S)
    };
}
function jsToDynamoUser(jsUser) {
    return {
        chatId: { N: jsUser.chatId.toString() },
        keywords: { L: jsUser.keywords.map(x => {return {S: x}})},
        websites: { L: jsUser.websites.map(x => {return {S: x}})}
    }
}

exports.allUsers = async () => {
    const result = await dynamodb.scan(TABLENAME);
    const items = result.Items.filter(x=>x.chatId.N != 0).map(dynamoToJsUser);
    if (result.$response.error) {
        return null;
    }
    return items;
}

exports.loadUser = async (chatId) => {
    const result = await dynamodb.query(TABLENAME, PKNAME, chatId);
    const items = result.Items
    if (result.$response.error || items.length == 0) {
        return null;
    }
    const item = items[0];
    return dynamoToJsUser(item);
};

exports.loadUserOrCreate = async (chatId) => {
    const load = (await exports.loadUser(chatId));
    if(load == null) {
        return {
            chatId: chatId,
            keywords: [],
            websites: []
        };
    } else {
        return load;
    }
};

exports.storeUser = async (user) => {
    await dynamodb.putItem(TABLENAME, jsToDynamoUser(user));
};

exports.loadVisits = async () => {
    const result = await dynamodb.query(TABLENAME, PKNAME, 0);
    const items = result.Items
    if (result.$response.error || items.length == 0) {
        return [];
    }
    return items[0].visits.L.map(x=>x.S);
}
exports.loadNewWebsites = async () => {
    const result = await dynamodb.query(TABLENAME, PKNAME, 0);
    const items = result.Items
    if (result.$response.error || items.length == 0) {
        return [];
    }
    return items[0].new_websites.L.map(x=>x.S);
}
exports.storeVisits = async (visits, newWebsites) => {
    await dynamodb.putItem(TABLENAME, {
        chatId: { N: '0' },
        visits: { L: visits.map(x => {return {S: x}})},
        new_websites: { L: newWebsites.map(x => {return {S: x}})},
    });
};
