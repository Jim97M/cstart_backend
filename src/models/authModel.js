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
  status: {
    type: DataTypes.ENUM,
    values: ['Pending', 'Active'],
     defaultValue: 'Pending',
     allowNull: true
  },
  confirmationCode: {
    type: DataTypes.STRING,
    unique: true,
  },
  phone_number: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
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
