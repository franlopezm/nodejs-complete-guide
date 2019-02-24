const Product = require('../models/products');

exports.getProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editing: false
  });
}


exports.postAddProduct = (req, res) => {
  const { body: { title, description, imageUrl, price } } = req;

  const product = new Product({ title, description, imageUrl, price, userId: req.user });

  product
    .save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(error => console.log(error));
}


exports.getEditProduct = (req, res, next) => {
  const editMode = /true/i.test(req.query.edit);
  const { productId } = req.params;

  if (!editMode) return res.redirect('/');

  Product
    .findOne({ _id: productId, userId: req.user })
    .then(product => {
      if (!product) return res.redirect('/');

      res.render('admin/edit-product', {
        pageTitle: 'Edit product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(error => console.log(error));
}


exports.postEditProduct = (req, res) => {
  const { body: { title, description, imageUrl, price, productId } } = req;

  Product
    .findOneAndUpdate({ _id: productId, userId: req.user }, { $set: { title, description, imageUrl, price } })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(error => console.log(error));
}


exports.getProducts = (req, res, next) => {
  Product
    .find({ userId: req.user })
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(error => console.log(error));
}


exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;

  Product
    .findOneAndDelete({ _id: productId, userId: req.user })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(error => console.log(error));
}
