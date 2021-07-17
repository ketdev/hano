// client-side app for login proxy
const { firebaseAdmin } = require('../access/admin');
const { firebaseClient } = require('../access/client');
const AccountsDB = require('../db/accounts');

function isEmpty(string) {
    if (string.trim() === '') return true;
    else return false;
}
function isEmail(email) {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)) return true;
    else return false;
}
function isStringArray(arr) {
    return arr.every(i => (typeof i === "string"));
}

exports.register = async (request, response) => {
    try {
        const email = request.body.email;
        const password = request.body.password;
        const confirmPassword = request.body.confirmPassword;
        const refs = await AccountsDB.find(email);
        const existing = refs.length > 0;

        if (!isEmail(email) || password !== confirmPassword || existing) {
            return response.status(400).json({ error: 'Invalid request' });
        }

        // create with firebase client
        const data = await firebaseClient.auth().createUserWithEmailAndPassword(email, password);
        const uid = data.user.uid;
        const token = await data.user.getIdToken();

        // add account to database
        const account = AccountsDB.account(email, uid, [], []);
        await AccountsDB.add(account);
        return response.json({ token });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Something went wrong, please try again' });
    }
};

exports.login = async (request, response) => {
    try {
        const email = request.body.email;
        const password = request.body.password;
        const existing = (await AccountsDB.find(email)).length > 0;

        if (isEmpty(email) || isEmpty(password) || !existing) {
            return response.status(400).json({ error: 'Invalid request' });
        }

        // login with firebase client
        const data = await firebaseClient.auth().signInWithEmailAndPassword(email, password);
        const token = await data.user.getIdToken();
        return response.status(201).json({ token });
    } catch (error) {
        console.error(error);
        return response.status(403).json({ error: 'Failed to login, please try again' });
    }
};

exports.auth = async(request, response, next) => {
    try {
        let idToken;
        if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
            idToken = request.headers.authorization.split('Bearer ')[1];
        } else {
            console.error('No token found');
            return response.status(403).json({ error: 'Unauthorized' });
        }
        request.decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        request.account = await AccountsDB.user(request.decodedToken.uid);
        return next();  
    } catch (error) {
        if (error.code == "auth/id-token-expired") {
            return response.status(403).json({ error: 'Unauthorized' });
        }
        console.error('Error while verifying token.', error);
        return response.status(500).json(error);
    }  
};

exports.getAccount = async (request, response) => {
    try {
        return response.json(request.account);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: error.code });
    }
};

exports.getKeywords = async (request, response) => {
    try {
        return response.json(request.account.keywords);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: error.code });
    }
};

exports.setKeywords = async (request, response) => {
    try {
        const keywords = request.body;
        // validate input
        if (!isStringArray(keywords)) {
            return response.status(400).json({ error: 'Invalid request' });
        }

        await AccountsDB.updateKeywords(request.account.id, keywords);
        return response.json(keywords);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: error.code });
    }
};

exports.getBlacklistProviderIDs = async (request, response) => {
    try {
        return response.json(request.account.blacklistProviderIDs);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: error.code });
    }
};

exports.setBlacklistProviderIDs = async (request, response) => {
    try {
        const blacklist = request.body;
        // validate input
        if (!isStringArray(blacklist)) {
            return response.status(400).json({ error: 'Invalid request' });
        }
        await AccountsDB.updateBlacklistProviderIDs(request.account.id, blacklist);
        return response.json(blacklist);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: error.code });
    }
};
