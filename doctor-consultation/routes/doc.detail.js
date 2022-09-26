const express = require('express');
const router = express.Router();
const multer = require('multer');
const docModel = require('../models/doc.models')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
})

const uploads = multer({ storage: storage });


router.post('/adddetail', uploads.single("image"), async (req, res) => {
    const { qualification, experience, hospital, address, cost, specialities } = req.body;
    let uploadedFile = process.env.BASE_URL + 'uploads/' + req.file.filename;
    console.log(req.body);
    console.log(req.file)
    let currentDoctor;

    try {
        currentDoctor = await docModel.update({
            qualification: qualification,
            experience: experience,
            hospital: hospital,
            location: address,
            speciality: [specialities],
            imageUrl: uploadedFile,
            price: parseInt(cost)
        }, { where: { id: req.userInfo.id } })
        res.status(200).send("Details Added")
    }
    catch (e) {
        console.log(e)
        res.status(501).send(e);
    }
})

router.post('/adddate', async (req, res) => {
    const { date } = req.body;
    console.log(req.body);

    let doctor = await docModel.findOne({
        where: {
            id: req.userInfo.id
        }
    })
    doctor.daysandtimeslot.push(date); 

    try {
        let updateddoctor = await docModel.update({
            daysandtimeslot: doctor.daysandtimeslot,
            updatedAt: Date.now()
        }, {
            where: {
                id: req.userInfo.id
            }
        })
        res.status(200).json(updateddoctor);
    }
    catch (e) { res.status(501).send(e) }
})

router.get('/list', async (req, res) => {
    try {
        const allDoctors = await docModel.findAll({});
        res.status(200).send(allDoctors);
    }
    catch (e) {
        res.status(501).send(e)
    }
})

router.get('/details/:id',async(req,res)=>{
    const {id} = req.params;
    try {
        let doctor = await docModel.findOne({
            where: {
                id: id.substring(1)
            }
        })
        res.status(200).send(doctor);
    }
    catch (err) { res.status(501).send(err) }

})


module.exports = router;