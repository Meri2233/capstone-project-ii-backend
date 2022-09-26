const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../db');


class Doctor extends Model { }

let doctorSchema = {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    qualification: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    experience: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    hospital: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    speciality: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue:[],
        allowNull: true,
    },
    daysandtimeslot: { 
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue:[],
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
    },
    ratings: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    price:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
}

Doctor.init(doctorSchema, {
    sequelize,
    modelName: "doctor"
})

module.exports = Doctor;