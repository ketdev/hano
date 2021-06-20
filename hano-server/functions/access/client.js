
const firebase = require('firebase');
const { firebaseConfig } = require('../key/config');
firebase.initializeApp(firebaseConfig);

exports.firebaseClient = firebase;