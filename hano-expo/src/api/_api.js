import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
const SERVER = 'https://hano-server.firebaseapp.com';

const tokenName = "tknKey";

exports.getToken = async () => await SecureStore.getItemAsync(tokenName);
exports.setToken = async (token) => await SecureStore.setItemAsync(tokenName, token);
exports.delToken = async () => await SecureStore.deleteItemAsync(tokenName);

exports.post = async (relLink, data, auth=false) => {
    if(auth) {
        const authToken = await exports.getToken();
        axios.defaults.headers.common = { Authorization: `Bearer ${authToken}` };
    }
    const response = await axios.post(SERVER + relLink, data);
    return response;
}

exports.get = async (relLink, auth=false) => {
    if(auth) {
        const authToken = await exports.getToken();
        axios.defaults.headers.common = { Authorization: `Bearer ${authToken}` };
    }
    const response = await axios.get(SERVER + relLink);
    return response;
}
