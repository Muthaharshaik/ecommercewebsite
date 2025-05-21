const Category = require('../models/Category');
const Product = require('../models/Product');

//creating a new category
async function createCategory(req,res) {
    try {
        const {name} = req.body
        const newCategory = await Category.create({
            name
        })
        res.status(201).json(newCategory)
    } catch(error) {
        res.status(500).json({message:'Failed to create a category', error:error.message})
    }
}

//Get all categories
async function getAllCategories(req,res) {
    try {
        const categories = await Category.find({});
        res.json(categories)
    } catch(error) {
        res.status(500).json({message:'Failed to fetch the categories', error:error.message})
    }
}

//Get category By Name
async function getCategoryByName(req, res) {
  try {
    const name = req.params.name.toLowerCase();
    const category = await Category.findOne({ name });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const products = await Product.find({ category: category._id });

    res.json({
      category,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch the category',
      error: error.message,
    });
  }
}


module.exports = {
    createCategory,
    getAllCategories,
    getCategoryByName
}

