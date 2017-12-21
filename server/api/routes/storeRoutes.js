// this file defines routes for Store use case
const express = require('express');
const stores_router = express.Router();
const controller = require('../controllers/storeController');

stores_router.route('/stores')
    .get(controller.list_all_stores) // delegates GET route to controller
    .post(controller.add_store); // delegates POST route to controller

module.exports = stores_router;