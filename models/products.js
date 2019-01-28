const fs = require('fs');
const { getPathView } = require('../utils/path');

const pathData = getPathView('products.json', 'data');

const getProductsFromFile = cb => {
  fs.readFile(pathData, (error, file) => {
    if (error) return cb([]);

    cb(JSON.parse(file));
  });
}


module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);

      fs.writeFile(pathData, JSON.stringify(products), (error) => {
        console.log('TCL: Product -> save -> error', error)
      });

    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
}