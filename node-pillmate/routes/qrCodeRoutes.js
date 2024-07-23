const express = require('express');
const authController = require('./../controllers/authController');
const qrCodeController = require('./../controllers/qrCodeController');

const router = express.Router();

router.post('/create', authController.protect, qrCodeController.createQRCode);

module.exports = router;
