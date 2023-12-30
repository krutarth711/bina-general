const db = require('../helpers/database');
const User = db.users;
const generateToken = require('../helpers/generateToken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    console.log('USER: ', user);

    var passwordIsValid = bcrypt.compareSync(
        password,
        user.password
    );

    if (!user || !passwordIsValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(user);

    res.json({ token, role: user.role, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login
};