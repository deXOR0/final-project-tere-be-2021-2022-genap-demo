"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Class, { foreignKey: "ClassID" });
        }
    }
    Student.init(
        {
            StudentID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            ClassID: DataTypes.INTEGER,
            StudentName: DataTypes.STRING,
            StudentGender: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Student",
        }
    );
    return Student;
};
