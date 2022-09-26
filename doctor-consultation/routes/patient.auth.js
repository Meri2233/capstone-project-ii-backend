const express = require('express');
const bcrypt = require('bcryptjs');
const patientModel = require('../models/patient.model');
const jwt = require('jsonwebtoken');

const router = express.Router();


router.post('/signup', async (req, res) => {
    const { name, email, contact, problem, bloodgroup, weight, sex, age, location, doctype, password, confirmPassword } = req.body;
    console.log(req.body)

    if (!name || !email || !contact || !password || !confirmPassword) {
        return res.status(400).send("These are the required fields");
    }
    if (password !== confirmPassword) {
        return res.status(400).send("Password doesnot match");
    }
    let existingPatient;

    try {
        existingPatient = await patientModel.findOne({ where: { email: email } });
    }
    catch (e) { console.log(e) }

    if (existingPatient !== null) {
        return res.status(400).send("You have already registered. Please login.")
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    try {
        const newPatient = await patientModel.create({
            name: name,
            email: email,
            contact: contact,
            password: hash,
            diseaseOrdiscomforts: problem,
            bloodgroup: null || bloodgroup,
            weight: null || weight,
            sex: sex,
            age: age,
            location: null || location,
            doctype: doctype
        })
        res.status(200).send("Added new Patient with id: " + newPatient.id);
    }
    catch (e) {
        res.status(501).send(e.message);
    }
})

router.get('/list', async (req, res) => {
    try {
        const allPatient = await patientModel.findAll({});
        res.status(200).send(allPatient);
    }
    catch (e) {
        res.status(501).send(e)
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("All Fields required");
    }
    let existingPatient;
    try {
        existingPatient = await patientModel.findOne({ where: { email: email } });
    }
    catch (e) { console.log(e) }
    console.log(existingPatient);
    
    if (existingPatient === null) {
        return res.status(400).send("You have not registered. Please register first.");
    }
    if (!bcrypt.compareSync(password, existingPatient.password)) {
        return res.status(400).send("Incorrect Pasword");
    }
    else {
        const payload = {
            id: existingPatient.id,
            email: existingPatient.email,
            name: existingPatient.name
        }
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
        return res.status(200).json({ accessToken, refreshToken });
    }
})

router.post('/token', (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).send("Please provide refresh token");
    }
    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        delete payload.exp;
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
        res.status(200).json({ accessToken });
    }
    catch (e) {
        res.status(501).send(e.message);
    }
})

module.exports = router; 