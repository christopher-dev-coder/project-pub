const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // Is the token in the Authorization Header?
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access. Token does not exist!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Finding the user with ID
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found!' });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ message: 'The token is invalid!' });
  }
};
