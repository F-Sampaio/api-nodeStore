const express = require('express');
const router = express.Router();
const authService = require('../services/auth-service');
const controller = require('../controllers/customer-controller');

router.post('/', controller.post);
router.post('/authenticate', controller.authenticate);
router.post('/refresh-token', authService.authorize, controller.refreshToken);
 
module.exports = router;