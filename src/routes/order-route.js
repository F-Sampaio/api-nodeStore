const express = require('express');
const router = express.Router();
const authService = require('../services/auth-service');
const controller = require('../controllers/order-controller')

router.post('/', authService.authorize, controller.post);
router.get('/', authService.authorize, controller.get);

module.exports = router; 