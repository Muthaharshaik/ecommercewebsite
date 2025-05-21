const Product = require('../models/Product');

//All products
//@route   GET /api/products
async function getAllProducts(req,res) {
    try {
       const products = await Product.find().populate('category','name');
       //The populate is used to fetch the category document , but it will include only name
       res.json(products);
    } catch(e) {
       res.status(500).json({message:'Server Error', error:e.message})
    }
}

//Single product by its ID
// @route   GET /api/products/:id
async function getProductById(req,res) {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if(!product) res.status(404).json({message:'Product not found'})
    res.json(product);
  } catch(error) {
    res.status(500).json({message:'Server Error', error:error.message})
  }
}


//Creating a product(protected route only by admin)
// @route   POST /api/products
async function createProduct(req,res) {
    try {
        const {name, description, image, price, category, stock} = req.body
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: "Product with this name already exists" });
        }
        const newProduct = await new Product({
            name,
            description,
            image,
            price,
            category,
            stock
        })
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch(error) {
        res.status(500).json({message:'Failed to create a product', error:error.message})
    }
}

//Updating a product(protected route only by admin)
// @route   PUT /api/products/:id
async function updateProduct(req,res) {
    try {
      const {name, description, image, price, category, stock} = req.body
      const product = await Product.findById(req.params.id);
      if(!product) res.status(404).json({message:'Product not found'})
    
      product.name = name || product.name, 
      product.description = description || product.description,
      product.image = image || product.image,
      product.price = price || product.price,
      product.category = category || product.category,
      product.stock = stock ?? product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct)
    } catch(error) {
        res.status(500).json({message:'Failed to update the product', error:error.message});
    }
}

//Deleting a product(protected route only by admin)
// @route   DELETE /api/products/:id
async function deleteProduct(req,res) {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) res.status(404).json({message:'Product not found'});
        await product.remove();
        res.status(201).json({message:'Product deleted Successfully'})
    } catch(error) {
        res.status(500).json({message:'Server Error',error:error.message})
    }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}