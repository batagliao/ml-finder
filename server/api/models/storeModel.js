let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// store schema definition
let StoreSchema = new Schema({
    code: {type: Number, required: true },
    description: { type: String, required: true },
    postalCode: { type: Number, required: true }
});

module.exports = mongoose.model('store', StoreSchema);
