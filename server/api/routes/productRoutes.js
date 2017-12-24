// this file defines routes for Product use case
const express = require('express');
const products_router = express.Router();
const controller = require('../controllers/productController');

products_router.route('/products/:id')
    .get(controller.get_product_by_code); // delegate GET route to controller

products_router.route('/products')
    .get(controller.list_all_products) // delegates GET route to controller
    .post(controller.add_product); // delegates POST route to controller

module.exports = products_router;