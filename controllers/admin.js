const Product = require('../models/products');

exports.getProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editing: false
  });
}


exports.postAddProduct = (req, res) => {
  const { body: { title, description, imageUrl, price }, user } = req;

  const product = new Product({ title, description, imageUrl, price });

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

  req.user
    .getProducts({ where: { id: productId } })
    .then(products => {
      if (!products) return res.redirect('/');

      res.render('admin/edit-product', {
        pageTitle: 'Edit product',
        path: '/admin/edit-product',
        editing: editMode,
        product: products[0]
      });
    })
    .catch(error => console.log(error));
}


exports.postEditProduct = (req, res) => {
  const { body: { title, description, imageUrl, price, productId } } = req;

  Product
    .update(
      { title, description, price, imageUrl },
      { where: { id: productId } }
    )
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(error => console.log(error));
}


exports.getProducts = (req, res, next) => {
  req.user.getProducts()
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
    .destroy({ where: { id: productId } })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(error => console.log(error));
}
