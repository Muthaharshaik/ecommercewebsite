const express = require('express');
const connectDB = require('./config/db');
const app = express();
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cors = require('cors');
require('dotenv').config();

connectDB();

//Middleware to parse json and form data
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'https://muthaharsmart.netlify.app'],
  credentials: true // if using cookies/auth
}));


app.get('/', (req,res) => {
    res.send("Welcome to Ecom development");
})

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes)

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`server started at PORT ${PORT}`);  
})
