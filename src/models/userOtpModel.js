import { DataTypes } from "sequelize";
import validator from "validator";
import { sequelize } from "../config/connectDb.js";

const UserOtp = sequelize.define('UserOtp', {
    email: {
        type: DataTypes.STRING,
        validate: (value) =>  {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }   
            
        }
    },
    otp: {
        type: DataTypes.INTEGER,
    }
});

UserOtp.associations = (models) => {
    UserOtp.belongsTo(models.User, {
        foreignKey: 'Id',
        as: 'userotp'
    });
}

