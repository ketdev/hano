import * as api from './_api';

exports.getAccount = async () => {
    const response = await api.get('/api/account', true);
    const account = response.data;
    return account;
};

exports.renewToken = async () => {
    return await api.get('/api/account', true)
        .then(_ => true)
        .catch(async err => {
            if (err.response.status === 403) { // Unauthorized
                await api.delToken();
                const email = await api.getEmail();
                const code = await api.getCode();
                return exports.emailAccess(email, code);
            }
            throw err;
        });
};

exports.emailAccess = async (email, code) => {
    const userData = { email, code };
    return await api.post('/api/account', userData)
        .then(async response => {
            if (response.status == 200 && response.data.token === undefined) {
                // need to send code
                return false
            } 
            await api.setEmail(email);
            await api.setCode(code || response.data.code);
            await api.setToken(response.data.token);
            return true;
        })
        .catch(async err => {
            if (err.response.status === 400) { // Invalid
                await api.delEmail();
                await api.delCode();
                return false;
            }
            throw err;
        });
};

exports.logout = async () => {
    await api.delEmail();
    await api.delCode();
    await api.delToken();
};