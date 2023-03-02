import { DataTypes } from "sequelize";
import { sequelize } from "../config/connectDb.js";

const TokenModel = sequelize.define('TokenModel', {
  userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
  email: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
  token: {
        type: DataTypes.STRING,
        required: true,
    },   
  used: {
     type: DataTypes.INTEGER,
     required: true,
   }
     },
    {
    timestamps: false, 

    });

TokenModel.associations = (models) => {
  TokenModel.belongsTo(Users, {
      foreignKey: 'userId', 
  })
  return TokenModel;
}

export default TokenModel;
