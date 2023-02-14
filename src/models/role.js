import { DataTypes } from "sequelize";
import { sequelize } from "../config/connectDb.js";

const Role = sequelize.define('Role', {
    rolename: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    }
   }
)

export default Role;
