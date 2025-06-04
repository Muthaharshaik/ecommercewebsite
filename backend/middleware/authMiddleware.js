const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(403).json({ message: "Token is invalid or expired" });
        }

        req.user = decoded; // store decoded info if needed later
        next();
    })
}
const checkAuth = (req,res,next) => {
    const token = req.cookies.token;
    if(!token) {
        return next();
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (!error) {
            req.user = decoded;
        }
    next(); // continue regardless of verification success
    });
}
const admin = (req,res,next) => {
    if (req.user && req.user.role === 'admin') {
        next(); 
    } else {
        res.status(403).json({ message: 'Access denied, admin only' });
    }
}
module.exports = {
    verifyAuth,
    admin,
    checkAuth
};