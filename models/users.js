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
    fullname: DataTypes.TEXT,
    email: DataTypes.STRING,
    phone_number: DataTypes.INTEGER,
    image_type: DataTypes.STRING,
    image_name: DataTypes.STRING,
    password: DataTypes.STRING,
    verificationToken: DataTypes.STRING,
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};