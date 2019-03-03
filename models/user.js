const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }]
  }
});

// Add product to cart
userSchema.methods.addToCart = function (product) {
  const cartProductIdx = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());

  let newQuantity = 1;
  const updateCartItems = [...this.cart.items];

  if (cartProductIdx > -1) {
    newQuantity = this.cart.items[cartProductIdx].quantity + 1;
    updateCartItems[cartProductIdx].quantity = newQuantity;
  } else {
    updateCartItems.push({ productId: product, quantity: newQuantity });
  }

  this.cart = { items: updateCartItems };

  return this.save();
};

// Delete product
userSchema.methods.removeFromCart = function (productId) {
  const updateCartItems = this.cart.items.filter(cp => cp.productId.toString() !== productId.toString());

  this.cart.items = updateCartItems;
  return this.save();
};

// Clear all cart
userSchema.methods.clearCart = function () {
  this.cart = { items: [] };

  return this.save();
};


module.exports = mongoose.model('User', userSchema);
