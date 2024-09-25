const { Sequelize, DataTypes } = require('sequelize');

// Set up a connection to MySQL
const sequelize = new Sequelize('sample_db1', 'pineappleai', 'Lakshansql@1991', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    port: 3306
});

// Define the Adds model
const adds = sequelize.define('adds', {
    logo: {
        type: DataTypes.STRING,
        allowNull: false,  // Logo URL should not be null
    },
    href_link: {
        type: DataTypes.STRING,
        allowNull: false,  // Href link should not be null
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,  // Default status is 1 (visible)
    },
}, {
    timestamps: false // Disable automatic createdAt and updatedAt fields
});

module.exports = { sequelize, adds };
