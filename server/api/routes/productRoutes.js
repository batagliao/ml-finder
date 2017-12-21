// this file defines routes for Product use case
const express = require('express');
const stores_router = express.Router();
const controller = require('../controllers/productController');

products_router.route('/products?store=:store')
    .get(controller.list_all_products_by_store);

products_router.route('/products')
    .get(controller.list_all_products) // delegates GET route to controller
    .post(controller.add_product); // delegates POST route to controller

module.exports = products_router;