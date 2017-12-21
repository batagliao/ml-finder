let db = require('diskdb');

db.loadCollections('stores');

exports.add = function(storemodel){
    db.stores.save(storemodel);
};