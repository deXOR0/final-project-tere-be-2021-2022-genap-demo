"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Class extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, { foreignKey: "CreatedBy" });
            this.hasMany(models.Student, { foreignKey: "ClassID" });
        }
    }
    Class.init(
        {
            ClassID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            CreatedBy: DataTypes.INTEGER,
            ClassName: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Class",
        }
    );
    return Class;
};
