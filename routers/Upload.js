const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authManager = require('../middleware/authManager')
const fs = require('fs')
const path = require('path')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

router.post('/upload', (req, res) => {
    try {
        //console.log(req.files)
        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({msg: 'No file were uploaded.'})

        const file = req.files.file;
        if(file.size > 1024*1024*10) {
            removeTemp(file.tempFilePath)
            return res.status(400).json({msg: "Size is too large"})
        } 

        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTemp(file.tempFilePath)
            return res.status(400).json({msg: "File format is incorrect"})
        }
        
        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "ABC company"}, async(err, result) => {
            if(err) throw err;

            removeTemp(file.tempFilePath)

            res.json({public_id: result.public_id, url: result.secure_url})
        })    
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
})

const removeTemp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err;
    })
}

module.exports = router