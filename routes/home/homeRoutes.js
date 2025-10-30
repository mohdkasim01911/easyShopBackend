const homeController = require('../../controllers/home/homeController');

const router = require('express').Router();

router.get('/get_categorys', homeController.get_categorys);

router.get('/get_products', homeController.get_products);

router.get('/price-range-latest-product', homeController.price_range_product);

router.get('/query-products',homeController.query_products)


module.exports = router;
