// This file defines the actions of server for routes defined in ../routes/storeRoutes.js

// route: GET /stores 
exports.list_all_stores = (req, res) => {
    res.json({message: 'all stores'});
};

// route: POST /stores
exports.add_store = (req, res) => {
    res.json({message: 'not implemented'});
};