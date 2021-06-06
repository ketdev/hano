const dynamodb = require('./dynamodb');

const TABLENAME = 'hano_rss';
const PKNAME = 'link';
const PKTYPE = 'S';


exports.all = async () => {
    const result = await dynamodb.scan(TABLENAME);
    if (result.$response.error) {
        console.log(result.$response.error);
        return null;
    }
    return result.Items.map(x => ({
        link: x.link.S,
        selector: x.selector.S,
        language: x.language.S,
    }));
};

exports.add = async (item) => {
    const result = await dynamodb.putItem(TABLENAME, {
        link: { S: item.link.toString() },
        selector: { S: item.selector.toString() },
        language: { S: item.language.toString() }
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