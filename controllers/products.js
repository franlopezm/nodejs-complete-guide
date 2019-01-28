const Product = require('../models/products');

exports.getProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
}


exports.postAddProduct = (req, res) => {
  const { body: { title } } = req;

  const product = new Product(title);
  product.save();

  res.redirect('/');
}


exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
}
