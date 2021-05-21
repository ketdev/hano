// npm install aws-sdk
// -- LOCAL --
// Credentials: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-your-credentials.html
//              https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
//  store in ~/.aws/credentials
//
// -- LAMBDA --
// Credentials: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_lambda-access-dynamodb.html


// https://github.com/aws/aws-sdk-js-v3#getting-started

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });
const db = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const TABLENAME = 'hano_db';

async function query(db, chatId) {
    const params = {
        TableName: TABLENAME,
        ExpressionAttributeValues: {
            ':chatId': { N: chatId.toString() }
        },
        KeyConditionExpression: 'chatId = :chatId'
    };
    return db.query(params).promise();
}

async function putItem(db, item) {
    var params = {
        TableName: TABLENAME,
        Item: item
    };
    return db.putItem(params).promise();
}

async function scan(db) {
    const params = {
        TableName: TABLENAME
    };
    return db.scan(params).promise();
}

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
    const result = await scan(db);
    const items = result.Items.filter(x=>x.chatId.N != 0).map(dynamoToJsUser);
    if (result.$response.error) {
        return null;
    }
    return items;
}

exports.loadUser = async (chatId) => {
    const result = await query(db, chatId);
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
    await putItem(db, jsToDynamoUser(user));
};

exports.loadVisits = async () => {
    const result = await query(db, 0);
    const items = result.Items
    if (result.$response.error || items.length == 0) {
        return [];
    }
    return items[0].visits.L.map(x=>x.S);
}
exports.loadNewWebsites = async () => {
    const result = await query(db, 0);
    const items = result.Items
    if (result.$response.error || items.length == 0) {
        return [];
    }
    return items[0].new_websites.L.map(x=>x.S);
}
exports.storeVisits = async (visits, newWebsites) => {
    await putItem(db, {
        chatId: { N: '0' },
        visits: { L: visits.map(x => {return {S: x}})},
        new_websites: { L: newWebsites.map(x => {return {S: x}})},
    });
};
