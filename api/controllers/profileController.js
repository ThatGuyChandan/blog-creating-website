const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.updateProfile = async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    const { username, password } = req.body;
    try {
      const userDoc = await User.findById(info.id);
      if (!userDoc) return res.status(404).json({ error: 'User not found' });
      if (username && username !== userDoc.username) {
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ error: 'Username already taken' });
        userDoc.username = username;
      }
      if (password && password.length > 0) {
        userDoc.password = bcrypt.hashSync(password, 10);
      }
      await userDoc.save();
      res.json({ id: userDoc._id, username: userDoc.username });
    } catch (e) {
      res.status(400).json({ error: 'Failed to update profile' });
    }
  });
};

exports.confirmPassword = async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    const { password } = req.body;
    try {
      const userDoc = await User.findById(info.id);
      if (!userDoc) return res.status(404).json({ error: 'User not found' });
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (!passOk) return res.status(401).json({ error: 'Incorrect password' });
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Failed to confirm password' });
    }
  });
};

exports.getProfile = async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    const userDoc = await User.findById(info.id);
    if (!userDoc) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: userDoc._id,
      username: userDoc.username,
      email: userDoc.email,
    });
  });
}; 