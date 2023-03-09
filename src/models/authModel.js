import {DataTypes} from 'sequelize';
import { sequelize } from '../config/connectDb.js';
import Role from './role.js';

const Users = sequelize.define("Users", {
  roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 3
  },
  fullname: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone_number: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  image_type: {
    type: DataTypes.STRING,
   },
  image_name: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verificationToken: { 
    type: DataTypes.STRING
   },
  token: {
     type: DataTypes.STRING
     },
});

Users.associations = (models) => {
    Users.belongsTo(Role, {
        foreignKey: 'roleId',
        as: 'role',
    });
    return Users;
}

export default Users;
