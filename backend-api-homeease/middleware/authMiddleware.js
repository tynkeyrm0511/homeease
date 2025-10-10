const jwt = require('jsonwebtoken');

// Authentication middleware - verify the token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  console.log('Auth check - Token received:', token ? 'Yes' : 'No');
  
  if (!token) {
    console.log('Auth check - No token provided');
    return res.status(401).json({ message: 'Không có token xác thực' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth check - Decoded user:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Auth check - Invalid token:', error.message);
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

// Another implementation of authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Không có token xác thực' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

// Admin authorization middleware
const authorizeAdmin = (req, res, next) => {
  console.log('Admin check - User:', req.user); 
  console.log('Admin check - Role:', req.user?.role);
  
  if (req.user && req.user.role === 'admin') {
    console.log('Access granted: Admin role verified');
    next();
  } else {
    console.log('Access denied: Admin role required, but user has role:', req.user?.role);
    res.status(403).json({ message: 'Access denied: Admin role required' });
  }
};

// Self or admin authorization middleware
const authorizeSelfOrAdmin = (req, res, next) => {
  const userId = parseInt(req.params.id) || parseInt(req.params.userId);
  
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  // Allow access if user is admin or if they're accessing their own data
  if (req.user.role === 'admin' || req.user.id === userId) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Not authorized' });
  }
};

module.exports = { 
  authMiddleware, 
  authenticateToken,
  authorizeAdmin,
  authorizeSelfOrAdmin
};