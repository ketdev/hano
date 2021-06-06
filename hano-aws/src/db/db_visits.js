const dynamodb = require('./dynamodb');

const TABLENAME = 'hano_visits';
const PKNAME = 'link';
const PKTYPE = 'S';


exports.all = async () => {
    const result = await dynamodb.scan(TABLENAME);
    if (result.$response.error) {
        console.log(result.$response.error);
        return null;
    }
    return result.Items.map(x => x.link.S);
};

exports.add = async (link) => {
    const result = await dynamodb.putItem(TABLENAME, {
        link: { S: link.toString() }
    });
    if (result.$response.error) {
        console.log(result.$response.error);
    }
};

exports.delete = async (link) => {
    const result = await dynamodb.deleteItem(TABLENAME, PKNAME, PKTYPE, link);
    if (result.$response.error) {
        console.log(result.$response.error);
    }
};