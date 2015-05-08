var rt = require('./realtimer.js');

module.exports = {
    setApiKey: function (apiKey)
    {
        return {
            listenToDoor: function (doorId, callback)
            {
                return rt.listenToCollection('Doors').withDocumentId(doorId, apiKey, function (document)
                {
                    callback(document);
                });
            }
        }
    }
};