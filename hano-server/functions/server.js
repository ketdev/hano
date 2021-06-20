const functions = require('firebase-functions');
const express = require('express');
const path = require('path');

// Setup express app
const app = express()

// NOTE: firebase configured to only route paths starting with 'api', so all must start with it

// ----------------------------------------------------------------------------
// Account Management
// ----------------------------------------------------------------------------

// authentication
const auth = require('./api/access/auth');

// users api
const {
    signUpUser,
    loginUser,
    getUserDetail,
    updateUserDetails,
    uploadProfilePhoto
} = require('./api/access/user');
app.post('/api/user/signup', signUpUser);
app.post('/api/user/login', loginUser);
app.get('/api/user', auth, getUserDetail);
app.post('/api/user', auth, updateUserDetails);
app.post('/api/user/image', auth, uploadProfilePhoto);

// ---
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.send("hano-server");
    // res.sendFile(path.join(__dirname, '../view/build/index.html'));
});

exports.api = functions.https.onRequest(app);

// ---
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const { run } = require('./cron/cron');

exports.scheduledFunction = functions.pubsub.schedule('every 5 minutes').onRun(run);