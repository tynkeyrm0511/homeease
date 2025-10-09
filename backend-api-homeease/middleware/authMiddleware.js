const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

//Middleware to verify JWT token
const authenticateToken = (req,res) => {
    const authHeader = req.headers['authorization'];
    //Token format: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({
            error: `Access denied. No token provided`
        })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; //Attach user info to request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err);
        return res.status(403).json({
            error: `Invalid or expired token.`
        })
    }
};

//Middleware to check if user is an ADMIN
const authorizeAdmin = (req,res,next) => {
    if(req.user.role !== 'admin'){
        return res.status(403).json({
            error: 'Admin access required'
        });
    }
    next();
}

//Middleware to check if user is the RESIDENT or an ADMIN
const authorizeSelfOrAdmin = (req,res,next) => {
    const residentId = Number(req.params.id) // Get resident ID from routes params
    if(req.user.role === 'admin' || req.user.userId === residentId){
        return next();
    }
    return res.status(403).json({
        error: `Access denied.`
    })
}
module.exports = {authenticateToken, authorizeAdmin, authorizeSelfOrAdmin};