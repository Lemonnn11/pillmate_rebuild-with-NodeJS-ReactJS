const express = require('express');
const authController = require('./../controllers/authController');
const pharmacyController = require('./../controllers/pharmacyController');

const router = express.Router();

router.post('/sign-up', authController.signup);
router.post('/sign-in', authController.signin);
router.get('/log-out', authController.logout);

router.use(authController.protect);

router.get('/get-pharmacy', pharmacyController.getPharmacy);
router.patch('/update', pharmacyController.updatePharmacy);

module.exports = router;
