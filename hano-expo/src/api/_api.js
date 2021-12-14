import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
const SERVER = 'https://hano-server.firebaseapp.com';

const tokenName = "tknKey";
const emailName = "emailKey";
const codeName = "codeKey";

exports.getToken = async () => await SecureStore.getItemAsync(tokenName);
exports.setToken = async (token) => await SecureStore.setItemAsync(tokenName, token);
exports.delToken = async () => await SecureStore.deleteItemAsync(tokenName);

exports.getEmail = async () => await SecureStore.getItemAsync(emailName);
exports.setEmail = async (email) => await SecureStore.setItemAsync(emailName, email);
exports.delEmail = async () => await SecureStore.deleteItemAsync(emailName);

exports.getCode = async () => await SecureStore.getItemAsync(codeName);
exports.setCode = async (code) => await SecureStore.setItemAsync(codeName, code);
exports.delCode = async () => await SecureStore.deleteItemAsync(codeName);

exports.post = async (relLink, data, auth=false) => {
    if(auth) {
        const authToken = await exports.getToken();
        if (authToken) {
            axios.defaults.headers.common = { Authorization: `Bearer ${authToken}` };
        } else {
            axios.defaults.headers.common = {};
        }
    }
    const response = await axios.post(SERVER + relLink, data);
    return response;
}

exports.get = async (relLink, auth=false) => {
    if(auth) {
        const authToken = await exports.getToken();
        if (authToken) {
            axios.defaults.headers.common = { Authorization: `Bearer ${authToken}` };
        } else {
            axios.defaults.headers.common = {};
        }
    }
    const response = await axios.get(SERVER + relLink);
    return response;
}
