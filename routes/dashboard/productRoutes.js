
const productController = require('../../controllers/dashboard/productController');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const router = require('express').Router();

router.post('/product-add', authMiddleware, productController.add_product);
router.get('/products-get', authMiddleware, productController.products_get);
router.get('/product-get/:id', authMiddleware, productController.product_get);
router.post('/product-update', authMiddleware, productController.update_product);
router.post('/product-image-update', authMiddleware, productController.update_image_product);

module.exports = router;
