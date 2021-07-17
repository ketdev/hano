import { post, get, getToken, setToken, delToken } from './_api';

exports.getToken = async () => {
    return await getToken();
};

exports.login = async (email, password) => { 
    const userData = {email, password};
    const response = await post('/api/account/login', userData);
    const token = response.data.token;
    await setToken(token);
    return token;
};

exports.logout = async () => {
    await delToken();
};

exports.getAccount = async () => {
    const response = await get('/api/account', true);
    const account = response.data;
    return account;
};