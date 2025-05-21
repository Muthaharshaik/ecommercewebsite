const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//Registering a new user('/api/users/register)

async function registerUser(req,res) {
    const {name, email, password, role} = req.body;

    try {
        //check if user already exists
        const userExists = await User.findOne({email})
        if(userExists) {
            return res.status(400).json({message:"User already exists"})
        } 

        const hashedPassword = await bcrypt.hash(password,10);

        //create new user
        const user = await User.create({
            name,
            password : hashedPassword,
            email,
            role:role || 'user'
        });
        
        //creating a token
        const token = jwt.sign({ id: user._id , role: user.role}, process.env.JWT_SECRET,{
            expiresIn: "1h"
        });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000
        })
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        })

    } catch(error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

//Login user( /api/users/login)
async function loginUser(req,res) {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid username or password" });
          }
          
        //creating jwt token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000
        })

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        })
        
    } catch(error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


async function getUserProfile(req, res) {
    try {
        const user = await User.findById(req.user.id).select('-password');// we are excluding pssword here
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

//update user profile 
async function updateUserProfile(req,res) {
    try {
    const user = await User.findById(req.user.id);
    if(!user) {
        res.status(404).json({message:"user not found"})
    }
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if(req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10)
    }
    const updatedUser = await user.save()
    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
    }) }
    catch(error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

//Logout (clearing the cookie)
async function logoutUser(req,res) {
   res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
   })

   res.status(200).json({ message: 'Logged out successfully' });
}
module.exports = {
   registerUser,
   loginUser,
   getUserProfile,
   updateUserProfile,
   logoutUser
}