import { DataTypes } from "sequelize";
import { sequelize } from "../config/connectDb.js";
import Tutorials from "./tutorialModel.js";
import Users from "./authModel.js";

const Likes = sequelize.define('Likes', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    tutorialId: {
          type: DataTypes.INTEGER,
           references: {
          model: "Tutorials",
          key: "id",
     },
    onUpdate: "cascade",
    onDelete: "cascade",
         },
    userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
         },
         createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
         },
        updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
          },
})

export default Likes;

Likes.associations = (models) => {
    Likes.belongsTo(Tutorials, {
        foreignKey: "tutorialId",
        targetKey: "id",
    })
    Likes.belongsTo(Users, {
        foreignKey: "usersId",
        targetKey: "id",
    })
    Tutorials.hasMany(Likes, {
        foreignKey: 'tutotialId',
        targetKey: "id"
    })
    Users.hasMany(Likes, {
        foreignKey: 'userId',
        targetKey: "id"
    })
    return Likes;
}
