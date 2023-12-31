const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    user: {
      id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  };

  return jwt.sign(payload, 'your-secret-key', { expiresIn: '24h' });
};

module.exports = generateToken;
