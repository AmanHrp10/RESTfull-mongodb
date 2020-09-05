const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    productImage: {
        type: String,
        required: true
    }
    
})

module.exports = mongoose.model('Product', productSchema)