const Product = require('../models/products');
const Order = require('../models/order');


exports.getIndex = (req, res, next) => {
  Product
    .findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(error => console.log(error));
}


exports.getProducts = (req, res, next) => {
  Product
    .findAll()
    .then(products => {
      res.render('shop/products', {
        prods: products,
        pageTitle: 'All products',
        path: '/products'
      });
    })
    .catch(error => console.log(error));
}


exports.getProduct = (req, res, next) => {
  const { productId } = req.params;

  Product
    .findByPk(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(error => console.log(error));
}


exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => cart.getProducts())
    .then(products => {
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: products,
        //totalPrice: cart.totalPrice
      });
    })
    .catch(error => console.log(error));
}


exports.postCart = (req, res, next) => {
  const { productId } = req.body;

  let fetchedCart;
  let newQuantity = 1;

  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } })
    })
    .then(([product]) => {
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }

      return Product.findByPk(productId);
    })
    .then(product => {
      return fetchedCart
        .addProduct(product, { through: { quantity: newQuantity } });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(error => console.log(error));
}


exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then(([product]) => product.cartItem.destroy())
    .then(() => {
      res.redirect('/cart');
    })
    .catch(error => console.log(error));
}


exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders'
  });
}

exports.postOrder = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => cart.getProducts())
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity }
            return product;
          }))
        })
        .catch(error => console.log(error));
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(error => console.log(error));
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
}