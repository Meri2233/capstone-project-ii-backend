const express = require('express');
const bcrypt = require('bcryptjs');
const docModel = require('../models/doc.models');
const jwt = require('jsonwebtoken');
const router = express.Router();


router.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).send("All Fields Are Required");
    }
    if (password !== confirmPassword) {
        return res.status(400).send("Password doesnot match");
    }

    try {
        existingDoctor = await docModel.findOne({ where: { email: email } });
    }
    catch (e) { console.log(e) }

    if (existingDoctor !== null) {
        return res.status(400).send("Email Already Exists. Please Login instead")
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    try {
        const newDoctor = await docModel.create({
            name: name,
            email: email,
            password: hash
        })
        res.status(200).send("Added new Doctor with id: " + newDoctor.id);
    }
    catch (e) {
        res.status(501).send(e.message);
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("All Fields required");
    }
    let existingDoctor;
    try {
        existingDoctor = await docModel.findOne({ where: { email: email } });
    }
    catch (e) { console.log(e) }
    console.log(existingDoctor);
    if (existingDoctor === null) {
        return res.status(400).send("Teacher doesnot exists");
    }
    if (!bcrypt.compareSync(password, existingDoctor.password)) {
        return res.status(400).send("Incorrect Pasword");
    }
    else {
        const payload = {
            id: existingDoctor.id,
            email: existingDoctor.email,
            name: existingDoctor.name
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