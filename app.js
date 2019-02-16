const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { getPathView } = require('./utils/path');

const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorCtrl = require('./controllers/error');

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
  User
    .findById('5c68397bca46fa33a1fb50ba')
    .then(user => {
      req.user = user;

      next();
    })
    .catch(error => console.log(error));
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorCtrl.get404);

// Connect to ddbb and run app
mongoose
  .connect('mongodb://localhost:27017', { dbName: 'node-complete', autoIndex: false, useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    User
      .findOne()
      .then(user => {
        if (!user) {
          const user = new User({ name: "Fran", email: "fran@test.com", cart: { items: [] } })
          user.save();
        }
        app.listen(3000, () => console.log('Listening in PORT 3000'));
      })
  })
  .catch(error => console.log('Connection ddbb Error::', error));
