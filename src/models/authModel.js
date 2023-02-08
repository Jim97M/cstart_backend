import {DataTypes} from 'sequelize';
import { sequelize } from '../config/connectDb.js';

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

export default Users;
