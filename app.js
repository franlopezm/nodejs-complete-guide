const MONGODB_URL = process.env.MONGODB_URL;

const { getPathView } = require('./utils/path');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');
const errorCtrl = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const app = express();
// Connect session to mongodb
const store = new MongoDBStore({ uri: MONGODB_URL, collection: 'sessions' });
const csrfProtection = csrf();

// Remove Headers by security
app.disable('x-powered-by');
// Set view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Config
app.use(express.static(getPathView('', 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware configuration
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store }));
app.use(csrfProtection);
app.use(flash());

// Get user to available in applications
app.use((req, res, next) => {
  if (!req.session.user) return next();

  const { user } = req.session;
  User
    .findById(user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(error => console.log(error));
});

// Fields set in every render.
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  next();
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorCtrl.get404);

// Connect to ddbb and run app
mongoose
  .connect(MONGODB_URL, { autoIndex: false, useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    app.listen(3000, () => console.log('Listening in PORT 3000'));
  })
  .catch(error => console.log('Connection ddbb Error::', error));
