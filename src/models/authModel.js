import {DataTypes} from 'sequelize';
import { sequelize } from '../config/connectDb.js';
import VerificationToken from './verificationToken.js';

const Users = sequelize.define("Users", {
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
  }  
});

Users.associations = (models) => {
  Users.hasOne(VerificationToken, {
    as: 'verificationtoken',
    foreignKey: 'userId',
    foreignKeyConstraint: true
  })
}

export default Users;
