const firebaseAdmin = require("firebase-admin");

const { firebaseConfig } = require('../key/config');

// Firebase authentication
var serviceAccount = require("../key/" + firebaseConfig.privateKeyFile);
const firebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: firebaseConfig.databaseURL,
    storageBucket: "gs://" + firebaseConfig.storageBucket
});
const firestore = firebaseAdmin.firestore();

module.exports = { firebaseAdmin, firestore, firebaseApp };
