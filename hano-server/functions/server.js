const functions = require('firebase-functions');
const express = require('express');

// Setup express app
const app = express()

// ----------------------------------------------------------------------------
// REST API
// ----------------------------------------------------------------------------

// Account authentication
const { register, login, auth, getAccount } = require('./api/account');
app.post('/api/account/register', register);
app.post('/api/account/login', login);
app.get('/api/account', auth, getAccount);

// Keywords
const { getKeywords, setKeywords } = require('./api/account');
app.get('/api/keywords', auth, getKeywords);
app.post('/api/keywords', auth, setKeywords);

// -----------
// // Blacklist Provider IDs
// const { getBlacklistProviderIDs, setBlacklistProviderIDs } = require('./api/account');
// app.get('/api/blacklist', auth, getBlacklistProviderIDs);
// app.post('/api/blacklist', auth, setBlacklistProviderIDs);

// Providers
const { accountProviders } = require('./api/providers');
app.get('/api/providers', auth, accountProviders);

// Article Matches
const { accountArticles } = require('./api/articles');
app.get('/api/articles', auth, accountArticles);


// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    // return res.status(404);
    res.send("hano-server");
    // res.sendFile(path.join(__dirname, '../view/build/index.html'));
});

exports.api = functions.https.onRequest(app);

// ----------------------------------------------------------------------------
// SCHEDULED FUNCTION
// ----------------------------------------------------------------------------
const { run } = require('./cron/cron');

const runtimeOpts = {
    timeoutSeconds: 60 * 1, // 1 minute
    memory: '1GB'
  }
exports.scheduledFunction = functions.runWith(runtimeOpts).pubsub.schedule('every 10 minutes').onRun(run);