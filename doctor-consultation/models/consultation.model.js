const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../db');


class Consultation extends Model { }

let consultationSchema = {
    patientname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    for: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    time: {
        type: DataTypes.STRING,
        allowNull: true, 
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true
    },
    prescribtions:{
        type: DataTypes.STRING,
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now,
    },
    docname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}

Consultation.init(consultationSchema, {
    sequelize,
    modelName: "appointment"
})

module.exports = Consultation;