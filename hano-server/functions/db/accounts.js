const db = require('./_db');

const ACCOUNTS_PATH = `/accounts`;
exports.account = (email, code, uid, keywords, blacklistProviderIDs) => ({ 
    email,
    code,
    uid,
    keywords, 
    blacklistProviderIDs, 
    admin: false,
    timestamp: new Date().toISOString()
});

exports.all = async () => await db.all(ACCOUNTS_PATH);
exports.find = async (email) => await db.where(ACCOUNTS_PATH, 'email', '==', email);
exports.user = async (uid) => await db.first(ACCOUNTS_PATH, 'uid', '==', uid);
exports.add = async (account) => await db.add(ACCOUNTS_PATH, account);
exports.delete = async (accountID) => await db.delete(ACCOUNTS_PATH, accountID);
exports.updateKeywords = async (accountID, keywords) => await db.update(ACCOUNTS_PATH, accountID, {keywords});
exports.updateBlacklistProviderIDs = async (accountID, blacklistProviderIDs) => await db.update(ACCOUNTS_PATH, accountID, {blacklistProviderIDs});

const ACCOUNT_MATCH_PATH = (accountID) => `${ACCOUNTS_PATH}/${accountID}/matches`;
exports.accountMatch = (articleID, keywords, confidence) => ({ 
    articleID, 
    keywords, 
    confidence,
    seen: false, 
    bookmarked: false, 
    timestamp: new Date().toISOString()
});

exports.allMatches = async (accountID) => await db.all(ACCOUNT_MATCH_PATH(accountID));
exports.addMatch = async (accountID, match) => await db.add(ACCOUNT_MATCH_PATH(accountID), match);