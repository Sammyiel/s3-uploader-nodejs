const dotenv  = require('dotenv');
dotenv.config();

const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(process.env.database, process.env.username, process.env.password, {
    host: process.env.host,
    dialect: 'mysql'
});

if (sequelize.authenticate()) {
    console.log('Connection has been established successfully.');
} else{
    console.error('Unable to connect to the database:', error);
}

// console.log('It works')

const Files = sequelize.define('files', {
    id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    file_name: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    file_link: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'files',
    timestamps: false,
    indexes: [{
        name: "PRIMARY",
        unique: true,
        fields: [
            { name: "id" }
        ]
    }]
});

// files.sync({ force: true });

module.exports = Files;
