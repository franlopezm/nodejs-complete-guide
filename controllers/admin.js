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

  const product = new Product(title, imageUrl, description, price);
  product.save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(error => console.log(error));
}


exports.getEditProduct = (req, res, next) => {
  const editMode = /true/i.test(req.query.edit);
  const { productId } = req.params;

  if (!editMode) return res.redirect('/');

  Product.findById(productId, product => {
    if (!product) return res.redirect('/');

    res.render('admin/edit-product', {
      pageTitle: 'Edit product',
      path: '/admin/edit-product',
      editing: editMode,
      product
    });
  });
}


exports.postEditProduct = (req, res) => {
  const { body: { title, description, imageUrl, price, productId } } = req;

  const product = new Product(productId, title, imageUrl, description, price);
  product.save();

  res.redirect('/admin/products');
}


exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('admin/products', {
        prods: rows,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(error => console.log(error));
}


exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;

  Product.deleteById(productId);

  res.redirect('/admin/products');
}
