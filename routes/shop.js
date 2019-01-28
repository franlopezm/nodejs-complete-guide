const { Router } = require('express');

const shopCtrl = require('../controllers/shop');
const router = Router();

router.get('/', shopCtrl.getIndex);

router.get('/products', shopCtrl.getProducts);

router.get('/cart', shopCtrl.getCart);

router.get('/orders', shopCtrl.getOrders);

router.get('/checkout', shopCtrl.getCheckout);


module.exports = router;
