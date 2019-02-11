const express = require('express');
const bodyParser = require('body-parser');
const { getPathView } = require('./utils/path');

const sequelize = require('./utils/database');
const Product = require('./models/products');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const { get404 } = require('./controllers/error');
const adminRoutes = require('./routes/admin').router;
const shopRoutes = require('./routes/shop');

const app = express();
// Remove Headers by security
app.disable('x-powered-by');
// Set view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Config
app.use(express.static(getPathView('', 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Get user to available in applications
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      // return a sequelize object
      req.user = user;

      next();
    })
    .catch(error => console.log(error));
})

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

// Relations between tables
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });


//Init database models, create tables and relations
sequelize
  //.sync({ force: true })
  .sync()
  .then(result => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Fran', email: 'test@test.com' });
    }

    return user;
  })
  .then(user => {
    //console.log('TCL: user', user)
    // Listen
    return user.createCart();
  })
  .then(cart => {
    app.listen(3000, () => console.log('Listening in PORT 3000'));
  })
  .catch(error => console.log('Init database error:', error));
