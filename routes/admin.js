const { Router } = require('express');

const { getProduct, postAddProduct } = require('../controllers/products');
const router = Router();

router.get('/add-product', getProduct);
router.post('/add-product', postAddProduct);


module.exports = { router };
