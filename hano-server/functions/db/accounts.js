const db = require('./_db');

const ACCOUNTS_PATH = `/accounts`;
exports.account = (keywords, blacklistProviderIDs) => ({ 
    keywords, 
    blacklistProviderIDs, 
    timestamp: new Date().toISOString()
});

exports.all = async () => await db.all(ACCOUNTS_PATH)
exports.add = async (account) => await db.add(ACCOUNTS_PATH, account);
exports.delete = async (accountID) => await db.delete(ACCOUNTS_PATH, accountID);


const ACCOUNT_MATCH_PATH = (accountID) => `${ACCOUNTS_PATH}/${accountID}/matches`;
exports.accountMatch = (articleID, keywords, confidence) => ({ 
    articleID, 
    keywords, 
    confidence,
    seen: false, 
    bookmarked: false, 
    timestamp: new Date().toISOString()
});

exports.addMatch = async (accountID, match) => await db.add(ACCOUNT_MATCH_PATH(accountID), match);