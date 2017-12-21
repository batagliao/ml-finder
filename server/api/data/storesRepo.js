const db = require('diskdb');

db.loadCollections('stores');

exports.add = (storemodel) => {
    db.stores.save(storemodel);
};