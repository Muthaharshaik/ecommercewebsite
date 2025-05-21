const Cart = require('../models/Cart');
const product = require('../models/Product');

// @desc    Get current user's cart
// @route   GET /api/cart
async function getCart(req,res) {
    try {
    const cart = await Cart.findOne({user:req.user.id}).populate('products.product', 'name price image');
    if(!cart)res.status(200).json({products:[]});
    res.status(200).json(cart)
    } catch(error) {
        res.status(500).json({message:'Server Error', error:error.message});
    }
}

// @desc    Add or update product in cart
// @route   POST /api/cart
async function addToCart(req,res) {
    const {productId, quantity} = req.body;
    try {
      let cart = await Cart.findOne({user:req.user.id});
      if(!cart) { //create a new cart if there is no cart
        cart = new Cart({
            user : req.user.id,
            products : [{ product: productId, quantity }]
        })} else { //update existing cart
            let existingProductIndex =  cart.products.findIndex((product) => product.product.toString() === productId)
            if(existingProductIndex > -1) {
                // Product exists, update quantity
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                //New product
                cart.products.push({ product: productId, quantity })
            }
        }
        const savedCart = await cart.save();
        res.status(200).json(savedCart);
    } catch(error) {
         res.status(500).json({message:'Server Error', error:error.message})
    }
}

// @desc    Update quantity of a product
// @route   PUT /api/cart
async function updateCartProduct(req,res) {
    const { productId, quantity } = req.body;
    try {
       let cart = await Cart.findOne({user:req.user.id});
       if(!cart) {
          res.status(404).json({message:'Cart not found'});
       }
       let productIndex = cart.products.findIndex((product)=> product.product.toString() === productId)
       if (productIndex === -1) return res.status(404).json({ message: 'Product not found in cart' });
       cart.products[productIndex].quantity += quantity;
       const updatedCart = await cart.save();
       res.status(200).json(updatedCart)
    } catch(error) {
        res.status(500).json({message:'Server Error', error:error.message})
    }
}

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
async function removeFromCart(req,res) {
    try {
       const cart = await Cart.findOne({user:req.user.id});
       if(!cart) res.status(400).json({message:'Cart not found'});
       cart.products = cart.products.filter((product) => product.product.toString() !== req.params.productId)
       const updatedCart = await cart.save()
       res.status(200).json(updatedCart)
    } catch(error) {
        res.status(500).json({message:'Server Error', error:error.message})
    }
}

module.exports= {
    getCart,
    addToCart,
    updateCartProduct,
    removeFromCart
}