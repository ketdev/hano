
import { get } from './_api';

exports.getAccountArticles = async () => { 
    const response = await get('/api/articles',true);
    const articles = response.data;
    return articles;
};
