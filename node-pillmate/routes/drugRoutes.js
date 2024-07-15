const express = require('express');
const drugController = require('./../controllers/drugController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(drugController.getAllDrugs);

router.get('/drug-categories', drugController.getCategories);

module.exports = router;
