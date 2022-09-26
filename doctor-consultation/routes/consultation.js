const express = require('express');
const router = express.Router();
const consultationModel = require('../models/consultation.model');

router.post('/create', async (req, res) => {
    const { purpose, price, docname, time, todaysdate } = req.body
    try {
        const newConsultation = await consultationModel.create({
            patientname: req.userInfo.name,
            for: purpose,
            todaysdate: todaysdate,
            time: time,
            price: price,
            status: "pending",
            docname: docname,
        })
        res.status(200).send("Added new appointment with id: " + newConsultation.id);
    }
    catch (e) {
        res.status(501).send(e.message);
    }
})

router.post("/markdone/:id",async(req,res)=>{
    const{id} = req.params
    const {notes, prescribtions} = req.body

    let currentConsultation;

    try {
        currentConsultation = await consultationModel.update({
            notes: notes,
            prescribtions: prescribtions,
            status: "completed",
        }, { where: { id: id.substring(1) } })
        res.status(200).send("Consultation marked done")
    }
    catch (e) {
        console.log(e)
        res.status(501).send(e);
    }

})

router.get('/patient/upcoming/list', async (req, res) => {
    try {
        const lists = await consultationModel.findAll({
            where: {
                patientname: req.userInfo.name,
                status: 'pending'
            }
        })
        res.status(200).send(lists);
    }
    catch (e) {
        res.status(501).send(e)
    }
})

router.get('/patient/past/list', async (req, res) => {
    try {
        const lists = await consultationModel.findAll({
            where: {
                patientname: req.userInfo.name,
                status: 'completed'
            }
        })
        res.status(200).send(lists);
    }
    catch (e) {
        res.status(501).send(e)
    }
})

router.get('/doctor/upcoming/list', async (req, res) => {
    try {
        const lists = await consultationModel.findAll({
            where: {
                docname: req.userInfo.name,
                status: 'pending'
            }
        })
        res.status(200).send(lists);
    }
    catch (e) {
        res.status(501).send(e)
    }
})

router.get('/doctor/past/list', async (req, res) => {
    try {
        const lists = await consultationModel.findAll({
            where: {
                docname: req.userInfo.name,
                status: 'completed'
            }
        })
        res.status(200).send(lists);
    }
    catch (e) {
        res.status(501).send(e)
    }
})

router.get('/doctor/today/list', async (req, res) => {
    let date = new Date();

    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let year = date.getFullYear();

    let todaysdate = year + '-' + month + '-' + day;

    try {
        const lists = await consultationModel.findAll({
            where: {
                docname: req.userInfo.name,
                status: 'pending',
                date: todaysdate
            }
        })
        res.status(200).send(lists);
    }
    catch (e) {
        res.status(501).send(e)
    }
})

module.exports = router;