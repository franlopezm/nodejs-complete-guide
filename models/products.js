const fs = require('fs');
const { getPathView } = require('../utils/path');
const Cart = require('./cart');

const pathData = getPathView('products.json', 'data');

const getProductsFromFile = cb => {
  fs.readFile(pathData, (error, file) => {
    if (error) return cb([]);

    cb(JSON.parse(file));
  });
}


module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      const newProducts = [...products];

      if (this.id) {
        // Update
        const index = products.findIndex(p => p.id === this.id);

        newProducts[index] = this;
      } else {
        // Add new
        this.id = Math.random().toString();

        newProducts.push(this);
      }

      fs.writeFile(pathData, JSON.stringify(newProducts), (error) => {
        console.log('TCL: Product -> save -> error', error)
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);

      cb(product);
    });
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      const updateProducts = products.filter(p => p.id !== id);

      fs.writeFile(pathData, JSON.stringify(updateProducts), (error) => {
        if (!error) {
          Cart.deleteProduct(id, product.price);
        } else {
          console.log('TCL: Product -> save -> error', error)
        }
      });
    });
  }
}