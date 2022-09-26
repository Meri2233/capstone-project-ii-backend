const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../db');


class Patient extends Model { }

let patientSchema = {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contact:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    diseaseOrdiscomforts: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bloodgroup: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    weight: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sex: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    age: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    doctype:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
}

Patient.init(patientSchema, {
    sequelize,
    modelName: "patient"
})

module.exports = Patient;