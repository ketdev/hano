// client-side app for login proxy
const ProviderDB = require('../db/provider');
const { firebaseConfig } = require('../key/config');

exports.accountProviders = async (request, response) => {
    try {
        // build structure
        const providers = await ProviderDB.all();
        const blacklist = request.account.blacklistProviderIDs;

        const imageUrl = (imageName) => `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/provider-images%2F${imageName}?alt=media`;

        const ret = providers
            .filter(x => !blacklist.includes(x.id))
            .map(x => ({
                providerID: x.id,
                name: x.name,
                imageUrl: imageUrl(x.imageName)
            }));

        return response.json(ret);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: error.code });
    }
};
