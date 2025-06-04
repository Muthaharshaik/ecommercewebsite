const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get current user's cart
// @route   GET /api/cart
async function getCart(req,res) {
    try {
        //if user is logged in get cart data from DB
        if(req.user && req.user.id) {
            const cart = await Cart.findOne({user:req.user.id}).populate('products.product', 'name price image');
            if(!cart) return res.status(200).json({products:[]});
            return res.status(200).json(cart)
        }
        //Guest user - session cart
        const sessionCart = req.session.cart;
        if (!sessionCart) return res.status(200).json({products:[]})
        // Populate product data manually for session cart
        const populatedProducts = await Promise.all(sessionCart.products.map(async (item) => {
            const product = await Product.findById(item.product, 'name price image');
            return {
              product,
              quantity: item.quantity
            };
        }));
        return res.status(200).json({products: populatedProducts})
    } catch(error) {
        res.status(500).json({message:'Server Error', error:error.message});
    }
}

// @desc    Add or update product in cart
// @route   POST /api/cart
async function addToCart(req,res) {
    const {productId, quantity} = req.body;
    try {
      if(req.user && req.user.id) {
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
        const populatedCart = await savedCart.populate('products.product');
        res.status(200).json(populatedCart);
        } else {
        //unregistred user
        if(!req.session.cart) {
            req.session.cart = {products:[]}
        }
        //if product existing in the session cart
        const existingProductIndex = req.session.cart.products.findIndex((item) =>
        item.product === productId)
        if(existingProductIndex > -1) {
            req.session.cart.products[existingProductIndex].quantity += quantity;
        } else {
            req.session.cart.products.push({ product: productId, quantity });
        }
        //pouplte all the product details before sedning the response
        const populatedProducts = await Promise.all(
            req.session.cart.products.map(async (item) => {
            const product = await Product.findById(item.product, 'name price image');
            return { product, quantity: item.quantity };
            })
        )
        return res.status(200).json({products: populatedProducts})}
    } catch(error) {
         res.status(500).json({message:'Server Error', error:error.message})
    }
}

// @desc    Update quantity of a product
// @route   PUT /api/cart
async function updateCartProduct(req,res) {
    const { productId, quantity } = req.body;
    try {
        if(req.user && req.user.id) {
            let cart = await Cart.findOne({user:req.user.id});
            if(!cart) {
                res.status(404).json({message:'Cart not found'});
            }
            let productIndex = cart.products.findIndex((product)=> product.product.toString() === productId)
            if (productIndex === -1) return res.status(404).json({ message: 'Product not found in cart' });
            cart.products[productIndex].quantity += quantity;
            const updatedCart = await cart.save();
            await updatedCart.populate('products.product');
            res.status(200).json(updatedCart)
        }
        if (!req.session.cart) return res.status(400).json({message:'Cart not found'})
        let productIndex = req.session.cart.products.findIndex((product) => 
         product.product === productId
        )
        if (productIndex === -1) return res.status(404).json({message: 'Product not found in the cart'})
        req.session.cart.products[productIndex].quantity += quantity
        const populatedProducts = await Promise.all(
            req.session.cart.products.map(async (item) => {
            const product = await Product.findById(item.product, 'name price image');
            return { product, quantity: item.quantity };
            }))
        return res.status(200).json({products: populatedProducts}) 
    } catch(error) {
        res.status(500).json({message:'Server Error', error:error.message})
    }
}

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
async function removeFromCart(req,res) {
    const productId = req.params.productId;
    try {
        if(req.user && req.user.id) {
           const cart = await Cart.findOne({user:req.user.id});
           if(!cart) res.status(400).json({message:'Cart not found'});
           cart.products = cart.products.filter((product) => product.product.toString() !== req.params.productId)
           const updatedCart = await cart.save()
           res.status(200).json(updatedCart)
        }
        if(!req.session.cart) {
            res.status(400).json({message:'Cart not found'})
        }
        req.session.cart.products = req.session.cart.products.filter(p => p.product !== productId);

        const populatedProducts = await Promise.all(req.session.cart.products.map(async (item) => {
        const product = await Product.findById(item.product, 'name price image');
        return { product, quantity: item.quantity };
        }));
        return res.status(200).json({products: populatedProducts})
    } catch(error) {
        res.status(500).json({message:'Server Error', error:error.message})
    }
}

//This function merges the guest cart into the logged-in user's database cart

async function mergeCartAfterLogin(req, userId) {
    try {
        if (!userId || !req.session.cart) return;

        const sessionCart = req.session.cart.products;
        let userCart = await Cart.findOne({ user: userId });

        if (!userCart) {
            userCart = new Cart({ user: userId, products: sessionCart });
        } else {
            for (let sessionItem of sessionCart) {
                const index = userCart.products.findIndex(
                    p => p.product.toString() === sessionItem.product
                );
                if (index !== -1) {
                    userCart.products[index].quantity += sessionItem.quantity;
                } else {
                    userCart.products.push(sessionItem);
                }
            }
        }

        await userCart.save();
        req.session.cart = null;

    } catch (error) {
        console.error('Error merging cart:', error.message);
        // You can optionally rethrow or just log
    }
}

module.exports = { mergeCartAfterLogin };


module.exports= {
    getCart,
    addToCart,
    updateCartProduct,
    removeFromCart,
    mergeCartAfterLogin
}