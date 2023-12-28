const { User } = require('../models');
const generateToken = require('../utils/generateToken');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user || !(await user.validPassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(user);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login
};