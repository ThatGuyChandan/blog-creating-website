const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (sendAdminNewUserEmail, salt) => async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
      email,
      status: 'pending',
    });
    await sendAdminNewUserEmail(userDoc);
    res.status(201).json({ message: 'Registration request submitted. Await admin approval.', user: { username: userDoc.username, email: userDoc.email } });
  } catch (error) {
    console.error(error);
    let msg = 'Failed to register';
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.email) msg = 'Email already in use';
      else if (error.keyPattern && error.keyPattern.username) msg = 'Username already in use';
    }
    res.status(400).json({ error: msg });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (!userDoc) {
    res.status(400).json({ error: 'User not found' });
    return;
  }
  if (userDoc.status === 'pending') {
    return res.status(403).json({ error: 'Your account is pending admin approval.' });
  }
  if (userDoc.status === 'rejected') {
    return res.status(403).json({ error: 'Your registration was rejected. Please contact the admin.' });
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign(
      { username, id: userDoc._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 60 * 60 * 1000,
        }).json({
          id: userDoc._id,
          username: userDoc.username,
          email: userDoc.email,
        });
      }
    );
  } else {
    res.status(400).json({ error: 'Password or username is wrong' });
  }
};

exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 0,
  }).json('ok');
}; 