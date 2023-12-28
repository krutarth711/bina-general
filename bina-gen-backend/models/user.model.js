module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.ENUM('Super Admin', 'Admin', 'Employee'),
      defaultValue: 'Employee'
    },
  });

  return User;
};
