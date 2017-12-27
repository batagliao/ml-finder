// imports
const express = require('express');
const db = require('diskdb');
const bodyparser = require('body-parser');

// setup db
// using diskdb to keep it simple
if(process.env.NODE_ENV  !== 'test'){
    db.connect('api/data');
}

// app imports
const store_routes = require('./api/routes/storeRoutes');
const product_router = require('./api/routes/productRoutes');

let app = express();
let port = process.env.PORT || 3000;

let router = express.Router();

// /api
router.get("/", function (req, res) {
    // welcome rout just to make sure routing is working
    res.json({message: "Welcome to Magalu Finder API"});
});

// define routes for /stores
router.use(store_routes);
// define routes for /products
router.use(product_router);

// body parser must come before routes
app.use(bodyparser.json());

// make server use the router
app.use('/api', router);
// serve static files
app.use(express.static(__dirname + '/public'));
// listen
app.listen(port);

console.log(`Magalu Finder RESTful API server started on ${port} port`);

// we need that for testing with mocha/chai
module.exports = app;