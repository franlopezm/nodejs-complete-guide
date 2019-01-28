const Product = require('../models/products');

exports.getProduct = (req, res, next) => {
  res.render('admin/add-product', {
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

  res.redirect('/admin');
}


exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
}