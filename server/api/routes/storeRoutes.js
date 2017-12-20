// this file defines routes for Store use case
let express = require('express');
let stores_router = express.Router();
let controller = require('../controllers/storeController');

stores_router.route('/stores')
    .get(controller.list_all_stores) // delegates GET route to controller
    .post(controller.add_store); // delegates POST route to controller

module.exports = stores_router;