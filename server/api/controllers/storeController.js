// This file defines the actions of server for routes defined in ../routes/storeRoutes.js

const repo = require('../data/storesRepo');

// route: GET /stores 
exports.list_all_stores = (req, res) => {
    try {
        var stores = repo.get();
        res.json(stores);
        return;
    } catch (err) {
        res.status(500).json(err).send();
    }
    return;
};

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