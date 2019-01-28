const { Router } = require('express');

const adminCtrl = require('../controllers/admin');
const router = Router();

router.get('/add-product', adminCtrl.getProduct);

router.post('/add-product', adminCtrl.postAddProduct);

router.get('/products', adminCtrl.getProducts);



module.exports = { router };
