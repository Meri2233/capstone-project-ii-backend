require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

require('./db')

const authRouterDoc = require('./routes/doc.auth');
const authRouterPatient = require('./routes/patient.auth');
const detailRouterDoc = require('./routes/doc.detail');
const consultationRouter = require('./routes/consultation');
const resetRouter = require('./routes/reset');
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.static('public'))

app.use('/reset', resetRouter)
app.use('/docauth', authRouterDoc);
app.use('/patientauth', authRouterPatient);

app.use(authenticateRequest)

app.use("/doc", detailRouterDoc);
app.use('/consultation', consultationRouter)

app.listen(7000 || process.env.PORT, () => {
    console.log("Server running")
});

function authenticateRequest(req, res, next) {
    const headerInfo = req.headers['authorization'];

    if (headerInfo === undefined) {
        return res.status(401).send('No token provided');
    }
    const token = headerInfo.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userInfo = payload;
        next()
    }
    catch (e) {
        res.status(401).send("Invalid token provided");
    }
}