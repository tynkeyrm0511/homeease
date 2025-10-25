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
    // Normalize token payload: some code expects `req.user.id` while tokens contain `userId`
    req.user = decoded;
    if (!req.user.id && req.user.userId) {
      req.user.id = req.user.userId;
    }
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
    // Normalize payload: some tokens include `userId` while handlers expect `id`.
    req.user = decoded;
    if (!req.user.id && req.user.userId) {
      req.user.id = req.user.userId;
    }
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
const prisma = require('../prismaClient');

// Authorize if user is admin OR owner of the resource.
// For routes that pass userId as a param/query we compare directly.
// For routes that pass a resource id (e.g. request/:id) we load the resource and check ownership.
const authorizeSelfOrAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role === 'admin') {
    return next();
  }

  // If caller provided a userId param/query, allow if it matches the token user id
  const paramUserId = Number(req.params.userId || req.query.userId);
  if (Number.isFinite(paramUserId) && req.user.id === paramUserId) {
    return next();
  }

  // If route provides an `id` param, try to resolve the underlying resource and check ownership.
  const id = Number(req.params.id);
  if (Number.isFinite(id)) {
    try {
      // Currently we only need this for `Request` resources. Try to load a request record.
      const record = await prisma.request.findUnique({ where: { id } });
      if (record && record.userId === req.user.id) {
        return next();
      }
      return res.status(403).json({ message: 'Access denied: Not authorized' });
    } catch (err) {
      console.error('authorizeSelfOrAdmin error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // No matching ownership found
  return res.status(403).json({ message: 'Access denied: Not authorized' });
};

module.exports = { 
  authMiddleware, 
  authenticateToken,
  authorizeAdmin,
  authorizeSelfOrAdmin
};