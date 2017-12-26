// This file defines the actions of server for routes defined in ../routes/storeRoutes.js

const repo = require('../data/storesRepo');

// route: GET /stores 
exports.list_all_stores = (req, res) => {
    var codes = req.query.code;
    var lat = parseFloat(req.query.lat || 0);
    var lng = parseFloat(req.query.lng || 0);

    try {
        var stores = repo.get();
        if(codes){ // filter
            // if only 1 store came, we need it to be an array, so lets ensure it
            if(!Array.isArray(codes)){
                codes = Array.of(codes);
            }

            stores = stores.filter(inArray(codes));
        }

        if(lat != 0 && lng != 0){ // sort ascending by distance

        }
        res.json(stores);
        return;
    } catch (err) {
        res.status(500).json(err).send();
    }
    return;
};

/**
 * Filter an array of stores by an array of its codes
 * @param {*Array} subject - an array of stores codes
 */
function inArray (subject){
    return function (store) {
        return subject.indexOf(store.code.toString()) >= 0;
    }
}

// route: POST /stores
exports.add_store = (req, res) => {

    if (req.header('x-admin') != 'true') {
        res.status(403).send();
        return;
    }

    var store = req.body;

    if (!isValid_Store(store)) {
        res.status(400).send();
        return;
    }

    if (store_already_exists(store)) {
        res.status(500).json(`duplicated store ${store.code}`).send();
        return;
    }

    try {
        repo.add(store);
        res.status(200).send();
    }
    catch (err) {
        res.status(500).json(err).send();
    }
    return;
};

/**
 * Validates a Store object
 * @param {Store} store - The Store object to be validated
 */
function isValid_Store(store) {
    // just to make sure no value is undefined
    store.code = store.code || 0;
    store.description = store.description || '';
    store.postalcode = store.postalcode || 0;

    if (store.code !== 0
        && store.description !== ''
        && store.postalcode !== 0) {
        return true;
    }
    return false;
}

/**
 * Checks if a store already exists
 * @param {*} store - the store to be checked
 */
function store_already_exists(store) {
    var exisitngStore = repo.getOne({ code: store.code });
    return exisitngStore;
}