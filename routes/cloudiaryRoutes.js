const express = require('express');
const router = express.Router();
const fileUploader = require('../cloudinary.config');

router.get('/',(req, res, next) => {
    res.json('ok')
})

router.post('/cloudinary-upload', fileUploader.single('file'), (req, res, next) => {
    if (!req.file) {
        next(new Error('No file uploaded!'));
        return;
    }
    res.json({ secure_url: req.file.path });
});

module.exports = router;