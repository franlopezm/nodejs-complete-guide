const { Router } = require('express');

const adminCtrl = require('../controllers/admin');
const isAuth = require('../middlewares/is-auth');

const router = Router();

router.get('/add-product', isAuth, adminCtrl.getProduct);
router.post('/add-product', isAuth, adminCtrl.postAddProduct);

router.get('/products', isAuth, adminCtrl.getProducts);

router.get('/edit-product/:productId', isAuth, adminCtrl.getEditProduct);
router.post('/edit-product', isAuth, adminCtrl.postEditProduct);

router.post('/delete-product', isAuth, adminCtrl.postDeleteProduct);

module.exports = router;
