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
const session = require('express-session')
require('dotenv').config();
connectDB();
app.get('/ping', (req, res) => res.send('pong'));

//Middleware to parse json and form data
app.use(cookieParser()); // ⬅️ Must come before checkAuth
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false , maxAge: 30 * 60 * 1000}
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: ['http://localhost:5173', 'https://muthaharsmart.netlify.app'],
  credentials: true
}));


// app.get('/', (req,res) => {
//     res.send("Welcome to Ecom development");
// })
app.get('/test-session', (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }
  res.json({ views: req.session.views });
});

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
