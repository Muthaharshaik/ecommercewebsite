const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: [
        {
            product: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'Product',
            },
            quantity: {
                required: true,
                type: Number
            }
        }
    ],
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        address: String,
        city: String,
        state: String,
        zip: String,
        country: String,
    },
    createdAt: { 
       type: Date,
       default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;