// imports
const express = require('express');
const db = require('diskdb');
const bodyparser = require('body-parser');

// app imports
const store_routes = require('./api/routes/storeRoutes');

// setup db
// using diskdb to keep it simple
if(process.env.NODE_ENV  !== 'test'){
    db.connect('api/data');
}

let app = express();
let port = process.env.PORT || 3000;

let router = express.Router();

// middleware to use for all requests
// just to make sure everything is working right
// router.use(function (req, res, next) {
//     //T ODO: check for DEV environment
//     // log
//     console.log("something is happening");
//     next(); // pass execution to middleware chain
// });

router.get("/", function (req, res) {
    // TODO: check for DEV environment
    // welcome rout just to make sure routing is working
    res.json({message: "Welcome to Magalu Finder API"});
});

// define routes for /stores
router.use(store_routes);

// body parser must come before routes
app.use(bodyparser.json());

// make server use the router
app.use('/api', router);

app.listen(port);

console.log(`Magalu Finder RESTful API server started on ${port} port`);

// we need that for testing with mocha/chai
module.exports = app;