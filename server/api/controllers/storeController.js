// This file defines the actions of server for routes defined in ../routes/storeRoutes.js

// route: GET /stores 
exports.list_all_stores = function(req, res){
    res.json({message: 'all stores'});
};

// route: POST /stores
exports.add_store = function(req, res){

};