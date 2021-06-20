const natural = require('natural');

const Accounts = require('../db/accounts');
const { asyncmap, unique } = require('./utils');

function extractKeywords (article) {
    var tfidf = new natural.TfIdf();
    let pattern;
    switch (article.language) {
        case 'he':
            pattern = /[^\u0590-\u05FFA-Za-z0-9_"]+/;
            tfidf.setStopwords(require('./stopwords_he.js').stop_words);         
            break;
        default:
            pattern = /[^A-Za-zА-Яа-я0-9_]+/;
            break;
    }
    tfidf.setTokenizer(new natural.RegexpTokenizer({pattern: pattern}));
    tfidf.addDocument(
        article.title.toLowerCase() 
        + ' ' 
        + (article.description ? article.description.toLowerCase() : '') 
        + ' ' 
        + article.text.toLowerCase()
    );
    const terms = tfidf.listTerms(0).sort((lh, rh) => lh.tfidf - rh.tfidf).filter(x=>x.tfidf);
    const maxtfidf = terms[terms.length - 1].tfidf;
    const keywords = Object.fromEntries(terms.map(x=>[x.term, x.tfidf/maxtfidf]));

    return keywords;
}

exports.processArticle = async (accounts, article, callback) => { 
    try {
        console.log(article.url);

        const keywords = extractKeywords(article);

        // Report to relevant accounts
        await asyncmap(accounts, async account => {
            try {
                // filter irrelevant accounts
                if (account.blacklistProviderIDs.includes(article.providerID)){
                    return;
                }

                let found = [];
                let invConfidence = 1;
                for(const term in keywords) {
                    for(const key of account.keywords) {
                        if(term.includes(key)) {
                            found.push(key);
                            invConfidence *= (1 - keywords[key]);
                        }
                    }
                }
    
                // Add article match to account
                if(found.length > 0 && invConfidence) {
                    const confidence = Math.round((1 - invConfidence) * 10000) / 100;
                    const match = Accounts.accountMatch(article.id, unique(found), confidence);

                    await Accounts.addMatch(account.id, match);
                    await callback(account, article, match);
                }
            } catch (error) {
                console.log(error.message);                    
            }
        });

    } catch (error) {
        console.log(error.message);
    }
};
