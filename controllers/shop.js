const Product = require('../models/products');
const Cart = require('../models/cart');


exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
}


exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/products', {
      prods: products,
      pageTitle: 'All products',
      path: '/products'
    });
  });
}


exports.getProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.findById(productId, product => {
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products'
    });
  });
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