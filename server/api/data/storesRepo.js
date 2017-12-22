const db = require('diskdb');

db.loadCollections('stores');

/**
 * Adds a store to database
 * @param {Store} storemodel - entity of type Store 
 */
exports.add = (storemodel) => {
    db.stores.save(storemodel);
};

/**
 * Gets an array of Stores from database
 * @param {*} criteria - Optional parameter indicating the criteria to filter. If not provided, gets all
 */
exports.get = (criteria) => {
    return db.stores.find(criteria);    
};

/**
 * Get only one Store from database
 * @param {*} criteria - Optional parameter indicating the criteria to filter. Id not provided, get the first
 */
exports.getOne = (criteria) => {
    return db.stores.findOne(criteria);
};

/**
 * Updates a store in the database
 * @param {*} criteria - The criteria to identify the Store to be updated
 * @param {Store} updatedStore - The updated Store object
 */
exports.update = (criteria, updatedStore) => {
    return db.stores.update(criteria, updatedStore);
};

/**
 * Removes one or more Stores from db based on criteria
 * @param {*} criteria  - the criteria to choose the Stores to be removed
 */
exports.delete = (criteria) => {
    return db.stores.remove(criteria);
};