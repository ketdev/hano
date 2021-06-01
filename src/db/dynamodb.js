// https://github.com/aws/aws-sdk-js-v3#getting-started
// npm install aws-sdk
// -- LOCAL --
// Credentials: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-your-credentials.html
//              https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
//  store in ~/.aws/credentials
//
// -- LAMBDA --
// Credentials: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_lambda-access-dynamodb.html


const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });
const db = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

exports.query = async (tablename, pkName, pk) => {
    const params = {
        TableName: tablename,
        ExpressionAttributeValues: { ':pk': { N: pk.toString() } },
        KeyConditionExpression: `${pkName} = :pk`
    };
    return db.query(params).promise();
};

exports.putItem = async (tablename, item) => {
    var params = {
        TableName: tablename,
        Item: item
    };
    return db.putItem(params).promise();
};

exports.scan = async (tablename) => {
    const params = {
        TableName: tablename
    };
    return db.scan(params).promise();
};

exports.deleteItem = async (tablename, pkName, dynType, pk) => {
    const params = {
        TableName: tablename,
        Key: Object.fromEntries([
            [pkName, Object.fromEntries([
                [dynType, pk]
            ])]
        ])
    };
    return db.deleteItem(params).promise();
}
