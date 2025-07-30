const User = require('../models/user');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.approveUser = (sendUserStatusEmail) => async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    await sendUserStatusEmail(user, 'active');
    res.json({ message: 'User approved', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve user' });
  }
};

exports.rejectUser = (sendUserStatusEmail) => async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    await sendUserStatusEmail(user, 'rejected');
    res.json({ message: 'User rejected', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject user' });
  }
}; 