const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = require('express').Router();

router.post('/admin_login', authController.admin_login);

router.get('/get-user', authMiddleware , authController.getUser);

router.post('/seller_register', authController.seller_register);

router.post('/seller_login', authController.seller_login);

module.exports = router;
