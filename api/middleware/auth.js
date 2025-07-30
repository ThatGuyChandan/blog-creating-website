const User = require('../models/user');
const jwt = require('jsonwebtoken');

async function adminAuthMiddleware(req, res, next) {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err || !info) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(info.id);
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }
    req.user = user;
    next();
  });
}

module.exports = adminAuthMiddleware;
