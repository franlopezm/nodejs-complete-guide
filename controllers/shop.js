const Product = require('../models/products');
const Cart = require('../models/cart');


exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([prods]) => {
      res.render('shop/index', {
        prods,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(error => console.log(error));
}


exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([prods]) => {
      res.render('shop/products', {
        prods,
        pageTitle: 'All products',
        path: '/products'
      });
    })
    .catch(error => console.log(error));
}


exports.getProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.findById(productId)
    .then(([product]) => {
      res.render('shop/product-detail', {
        product: product[0],
        pageTitle: product[0].title,
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