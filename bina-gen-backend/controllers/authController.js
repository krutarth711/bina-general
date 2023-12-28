const db = require('../helpers/database');
const User = db.users;
const generateToken = require('../helpers/generateToken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    var passwordIsValid = bcrypt.compareSync(
        password,
        user.password
    );
    console.log('############################## 1');

    if (!user || !passwordIsValid) {
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