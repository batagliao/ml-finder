const db = require('diskdb');

db.loadCollections(['products']);


/**
 * Adds a Product to database
 * @param {Product} productmodel - entity of type Product 
 */
exports.add = (productmodel) => {
    db.products.save(productmodel);
};

/**
 * Gets an array of Products from database
 * @param {*} criteria - Optional parameter indicating the criteria to filter. If not provided, gets all
 */
exports.get = (criteria) => {
    return db.products.find(criteria);    
};

/**
 * Get only one Product from database
 * @param {*} criteria - Optional parameter indicating the criteria to filter. Id not provided, get the first
 */
exports.getOne = (criteria) => {
    return db.products.findOne(criteria);
};

/**
 * Updates a Product in the database
 * @param {*} criteria - The criteria to identify the Product to be updated
 * @param {Store} updatedProduct - The updated Product object
 */
exports.update = (criteria, updatedProduct) => {
    return db.products.update(criteria, updatedProduct);
};

/**
 * Removes one or more Products from db based on criteria
 * @param {*} critesria  - the criteria to choose the Products to be removed
 */
exports.delete = (criteria) => {
    return db.products.remove(criteria);
};