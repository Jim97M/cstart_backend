'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    roleId: DataTypes.INTEGER,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    confirm_password: DataTypes.STRING,
    verificationToken: DataTypes.STRING,
    verified: DataTypes.DATE,
    resetToken: DataTypes.STRING,
    resetTokenExpires: DataTypes.DATE,
    passwordReset: DataTypes.DATE,
    isVerified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};