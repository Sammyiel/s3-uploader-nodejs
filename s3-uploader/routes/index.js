const express = require('express')
const router = express.Router()
const Files = require('../models/files.model');
const { v4 } = require('uuid');
const multer = require("multer");
const AWS = require("aws-sdk");

// Rendering the ejs template routes


// Get files page route
router.get('/api/v1', (req,res) => {
    res.render('home')
})

// Get files page route
router.post('/upload', (req,res) => {
    res.render('home')
})


const BUCKET_NAME = 'alu-sowc-rdb';
const AWS_ACCESS_ID = process.env.AWS_ACCESS_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
})


const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({ storage, dest: 'upload/' }).single('file')


// API routes

// upload a file
router.post('/upload', upload, async (req,res) => {
    let myFile = req.file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]

    const params = {
        Bucket: BUCKET_NAME,
        Key: `${v4()}.${fileType}`,
        Body: req.file.buffer
    }

    s3.upload(params, (error, data) => {
        if (error) {
            res.status(500).send(error)
        } else {
            res.status(200).send({
                success: true,
                message: "File uploaded successfully",
                data: data
            })
        }
    })

    try {
        let File = await Files.create(req.body);
        if (File) {
            res.status(200).json({
                success: true,
                message: "File added successfully",
                data: File
            })
        } else {
            res.status(200).json({
                success: false,
                message: "File could not be added at this time"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: `Oops! Something went wrong...${err}`,
        })
    }
})


// Get all files
router.get('/file', async (req,res) => {
    try {
        let files = await Files.findAll();
        if (files) {

            const s3Client = s3.s3Client;
            const params = s3.downloadParams;

            params.Key = req.params.filename;

            s3Client.getObject(params)
                .createReadStream()
                .on('error', function(err) {
                    res.status(500).json({ error: "Error -> " + err });
                }).pipe(res);

            // res.status(200).json({
            //     success: true,
            //     message: "File(s) retrieved successfully",
            //     data: files
            // })

        } else {
            res.status(200).json({
                success: false,
                message: "File(s) could not be retrieved at this time"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: `Oops! Something went wrong...${err}`,
        })
    }
})


module.exports = router;