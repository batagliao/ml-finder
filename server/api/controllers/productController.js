// This file defines the actions of server for routes defined in ../routes/productRoutes.js

// route: GET /products 
exports.list_all_products = (req, res) => {
    res.json({message: 'all products'});
};

// route: GET /products?store=?
exports.list_all_products_by_store = (req, res) => {
    res.json({message: 'all products by store'});
}

// route: POST /products
exports.add_product = (req, res) => {
    res.json({message: 'not implemented'});
};