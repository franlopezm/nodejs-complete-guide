const { Router } = require('express');

const shopCtrl = require('../controllers/shop');
const isAuth = require('../middlewares/is-auth');

const router = Router();

router.get('/', shopCtrl.getIndex);

router.get('/products', shopCtrl.getProducts);
router.get('/products/:productId', shopCtrl.getProduct);

router.get('/cart', isAuth, shopCtrl.getCart);
router.post('/cart', isAuth, shopCtrl.postCart);

router.post('/cart-delete-item', isAuth, shopCtrl.postCartDeleteProduct);

router.get('/orders', isAuth, shopCtrl.getOrders);

router.post('/create-order', isAuth, shopCtrl.postOrder);

router.get('/checkout', isAuth, shopCtrl.getCheckout);


module.exports = router;
