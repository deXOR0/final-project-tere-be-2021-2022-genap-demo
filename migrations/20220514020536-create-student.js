"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Students", {
            StudentID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            ClassID: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "Class",
                        schema: "schema",
                    },
                    key: "ClassID",
                },
            },
            StudentName: {
                type: Sequelize.STRING,
            },
            StudentGender: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("Students");
    },
};
