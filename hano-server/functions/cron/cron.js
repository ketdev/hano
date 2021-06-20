const Accounts = require('../db/accounts');
const {asyncmap: asyncfor, unique} = require('./utils');

const {readFeeds} = require('./read-feeds');
const {processArticle} = require('./process-article');

exports.run = async (context) => {
    console.log('This will be run every 10 minutes!');

    // const Provider = require('../db/provider');
    // await Provider.createProviderWithFeeds(
    //     'The New York Times', 
    //     'gs://hano-server.appspot.com/provider-images/nytimes.png', [
    //         { links: [
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Education.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Dealbook.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/US.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/MediaandAdvertising.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/SmallBusiness.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Africa.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/PersonalTech.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Americas.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/YourMoney.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/EnergyEnvironment.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    //             'https://rss.nytimes.com/services/xml/rss/nyt/Economy.xml',
    //         ], 
    //         selector: 'section[name="articleBody") .StoryBodyCompanionColumn', language: 'en' 
    //     }
    // ]);

    // await Accounts.add({
    //     keywords: ['bitcoin', 'Israel'],
    //     sourceIds: ['13Xkijppo6mY7SOMCx4O', '3fI6qQOr5gRn34YU0mXt']
    // });

    const accounts = await Accounts.all();
    await readFeeds( async article => {
        await processArticle(accounts, article, async (account, article, match) => {

            console.log(match);
            // await telegram.sendMessage(account.chatId, msg);
        });
    });

    return null;
};