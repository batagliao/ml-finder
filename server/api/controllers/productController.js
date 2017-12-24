// This file defines the actions of server for routes defined in ../routes/productRoutes.js

const repo = require('../data/productsRepo');

// route: GET /products 
// route: GET /products?store=
exports.list_all_products = (req, res) => {
    var queryStore = req.query['store'] || 0;
    var productDescriptionFilter = req.query['description'] || '';    

    try {
        var products = repo.get();
        if(queryStore != 0){
            // filter products by store
            var store = parseInt(queryStore);
            products = products.filter(contains_store(store));
        }

        if(productDescriptionFilter != ''){
            products = products.filter(starts_with(productDescriptionFilter));            
        }

        res.json(products);
        return;
    }
    catch (err) {
        res.json(err);
    }
};

/**
 * Evaluates filter for product based in store
 * @param {Integer} store - The store code to look for
 */
function contains_store(store){    
    return function(product){
        return product.stores.includes(store);
    }
}

/**
 * Evaluate filter for product based on its description
 * @param {string} desc - description to filter
 */
function starts_with(desc){
    return function(product){
        return product.description.startsWith(desc);
    }
}

// route: POST /products
exports.add_product = (req, res) => {
    if (req.header('x-admin') != 'true') {
        res.status(403).send();
        return;
    }

    var product = req.body;

    if (!isValid_Product(product)) {
        res.status(400).send();
        return;
    }

    if (product_already_exists(product)) {
        res.status(500).json(`duplicated product ${product.code}`);
        return;
    }

    try {
        repo.add(product);
        res.status(200).send();
    }
    catch (err) {
        res.status(500).json(err).send();
    }
    return;
};

/**
 * Validates a Product object
 * @param {Product} product - The Product object to be validated
 */
function isValid_Product(product) {
    // just to make sure no value is undefined
    product.code = product.code || 0;
    product.description = product.description || '';
    product.price = product.price || 0;
    product.atores = product.stores || [];

    if (product.code !== 0
        && product.description !== ''
        && product.price !== 0
        && product.stores.length > 0) {
        return true;
    }
    return false;
}

/**
 * Checks if a product already exists
 * @param {Product} product - the product to be checked
 */
function product_already_exists(product) {
    var existingProduct = repo.getOne({ code: product.code });
    return existingProduct;
}