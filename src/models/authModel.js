import {DataTypes} from 'sequelize';
import { sequelize } from '../config/connectDb.js';
import Role from './role.js';

const Users = sequelize.define("Users", {
  roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  confirm_password: {
    type: DataTypes.STRING
  },
  verificationToken: { 
    type: DataTypes.STRING
   },
  verified: { 
    type: DataTypes.DATE 
  },
  resetToken: {
     type: DataTypes.STRING
     },
  resetTokenExpires: {
     type: DataTypes.DATE
     },
  passwordReset: { 
    type: DataTypes.DATE 
  },
  isVerified: {
    type: DataTypes.VIRTUAL(DataTypes.BOOLEAN),
    get() { return !!(this.verified || this.passwordReset); }
}
});

Users.associations = (models) => {
    Users.belongsTo(Role, {
        foreignKey: 'roleId',
        as: 'role',
    });
    return Users;
}

export default Users;
