"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Users", {
            UserID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            FullName: {
                type: Sequelize.STRING,
            },
            Email: {
                type: Sequelize.STRING,
            },
            DOB: {
                type: Sequelize.DATE,
            },
            Gender: {
                type: Sequelize.STRING,
            },
            Password: {
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
        await queryInterface.dropTable("Users");
    },
};
