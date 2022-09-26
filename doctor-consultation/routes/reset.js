const express = require('express');
const Mailgun = require('mailgun.js');
const router = express.Router();
const formData = require('form-data');
const bcrypt = require('bcryptjs');
const patientModel = require('../models/patient.model');
const docModel = require('../models/doc.models');

router.post("/link", async (req, res) => {
    const { email } = req.body;
    let text;

    let existingPatient = await patientModel.findOne({ where: { email: email } });
    let existingDoctor = await docModel.findOne({ where: { email: email } });

    if (existingPatient === null && existingDoctor === null) {
        return res.status(400).send("Email doesnot exists");
    }

    if (existingPatient !== null) {
        text = `Please click the below link to reset your password: http://localhost:3000/resetpage/patient/:${existingPatient.id}`
    }

    if (existingDoctor !== null) {
        text = `Please click the below link to reset your password: http://localhost:3000/resetpage/doctor/:${existingDoctor.id}`
    }

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

    const messageData = {
        from: 'DocSeek <merikasharma2@gmail.com>',
        to: email,
        subject: 'Password Reset Link',
        text: text
    };

    mg.messages.create(process.env.MAILGUN_DOMAIN, messageData)
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.error(err);
        });
    return res.status(200).send('Password Successfully Changed')
})

router.post("/password/doc/:id", async (req, res) => {
    const { password, confirmPassword } = req.body;
    const { id } = req.params;

    let existingDoctor = await docModel.findOne({ where: { id: id.substring(1) } });

    if (password !== confirmPassword) {
        return res.status(400).send("Password doesnot match")
    }
    else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        existingDoctor.password = hash;
        try {
            let updateddoctor = await docModel.update({
                password: existingDoctor.password,
                updatedAt: Date.now()
            }, {
                where: {
                    id: id.substring(1)
                }
            })
            res.status(200).json(updateddoctor);
        }
        catch (e) { res.status(501).send(e) }
    }
})

router.post("/password/patient/:id", async (req, res) => {
    const { password, confirmPassword } = req.body;
    const { id } = req.params;

    let existingPatient = await patientModel.findOne({ where: { id: id.substring(1) } });

    if (password !== confirmPassword) {
        return res.status(400).send("Password doesnot match")
    }
    else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        existingPatient.password = hash;
        try {
            let updatedpatient = await patientModel.update({
                password: existingPatient.password,
                updatedAt: Date.now()
            }, {
                where: {
                    id: id.substring(1)
                }
            })
            res.status(200).json(updatedpatient);
        }
        catch (e) { res.status(501).send(e) }
    }
})

module.exports = router