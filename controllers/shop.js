const Product = require('../models/products');
const Cart = require('../models/cart');


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
  Cart.getProducts(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];

      cart.products.forEach(cartProduct => {
        const product = products.find(p => p.id === cartProduct.id);

        if (product) {
          cartProducts.push({ product, qty: cartProduct.qty });
        }
      });

      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: cartProducts,
        totalPrice: cart.totalPrice
      });
    })
  })
}


exports.postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);

    res.redirect('/cart');
  });
}


exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price);

    res.redirect('/cart');
  });
}


exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders'
  });
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
}