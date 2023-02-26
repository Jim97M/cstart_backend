import { DataTypes } from "sequelize";
import { sequelize } from "../config/connectDb.js";
import Users from "./authModel.js";

const Tutorials = sequelize.define('Tutorials', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tutorial_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tutorial_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    type: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING
      },

})


export default Tutorials;

Tutorials.associations = (models) => {
    Tutorials.belongsTo(Users, {
        foreignKey: 'userId',
    })
    return Tutorials;
}
