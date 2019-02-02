const fs = require('fs');
const { getPathView } = require('../utils/path');

const pathData = getPathView('cart.json', 'data');


module.exports = class Cart {
  static addProduct(id, productPrice) {
    //Fetch the previous cart
    fs.readFile(pathData, (error, file) => {
      let cart = { products: [], totalPrice: 0 };
      if (!error) {
        cart = JSON.parse(file);
      }

      // Analyze the cart => find existing product
      const indexProduct = cart.products.findIndex(p => p.id === id);
      if (indexProduct > -1) {
        //Update Cart Product
        const existingProduct = cart.products[indexProduct];
        const oldQty = existingProduct.qty;

        cart.products[indexProduct].qty = oldQty + 1;
      } else {
        //Add new Product
        const newProduct = { id: id, qty: 1 };

        cart.products = [...cart.products, newProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;

      fs.writeFile(pathData, JSON.stringify(cart), (err) => {
        console.log('TCL: Cart -> staticaddProduct -> err', err)
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(pathData, (error, file) => {
      if (error) return;
      const cart = JSON.parse(file);

      const updateCart = { ...cart };
      const product = updateCart.products.find(p => p.id === id);
      if (!product) return;

      const productQty = product.qty;
      updateCart.products = updateCart.products.filter(p => p.id !== id);
      updateCart.totalPrice = updateCart.totalPrice - productPrice * productQty;

      fs.writeFile(pathData, JSON.stringify(updateCart), (err) => {
        console.log('TCL: Cart -> staticaddProduct -> err', err)
      });
    });
  }

  static getProducts(cb) {
    fs.readFile(pathData, (error, file) => {
      if (error) return cb(null);

      const cart = JSON.parse(file);
      cb(cart);
    });
  }
}