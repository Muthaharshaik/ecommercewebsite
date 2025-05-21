const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    price: {
        required: true,
        type: Number
    },
    description: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    image: {
        type: String
    },
    stock: {
        type: Number,
        default: 0
    },
    createdAt: { type: Date, default: Date.now },
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;