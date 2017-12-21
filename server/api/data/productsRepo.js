const db = require('diskdb');

db.loadCollections('products');

exports.add = (productmodel) => {
    db.products.save(productmodel);
};