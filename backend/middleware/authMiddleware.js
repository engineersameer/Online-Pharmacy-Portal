const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

module.exports = {
  verifyToken
}; 