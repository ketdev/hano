
import { get } from './_api';

exports.getAccountProviders = async () => { 
    const response = await get('/api/providers',true);
    const providers = response.data;
    return providers;
};
