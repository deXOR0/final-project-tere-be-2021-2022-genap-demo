"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Class, { foreignKey: "CreatedBy" });
        }
    }
    User.init(
        {
            UserID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            FullName: DataTypes.STRING,
            Email: DataTypes.STRING,
            DOB: DataTypes.DATE,
            Gender: DataTypes.STRING,
            Password: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
