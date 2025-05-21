//This will store the products a user adds to their shopping cart before proceeding to checkout.

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
    }],
    createdAt: {
        type: Date, 
        default: Date.now 
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;