var connection = require('./configure.js');

module.exports = {
    listenToCollection: function (collection)
    {
        return {
            withDocumentId: function (doorId, apiKey, callback)
            {
                connection._connect.subscribe('DoorInfoForDoorId', doorId, apiKey);

                var col = connection._connect.getCollection(collection);
                var rq = col.reactiveQuery({});

                return rq.on('change', function (_id)
                {
                    callback(rq._set._items[_id]);
                });
            }
        }
    }
};