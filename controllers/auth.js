const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const { password, email } = req.body;

  User
    .findOne({ email })
    .then(user => {
      if (!user) return res.redirect('/login');

      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (!doMatch) return res.redirect('/login');

          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save((error) => {
            if (error) console.log('Create session error', error);

            res.redirect('/');
          });
        })
        .catch(error => res.redirect('/login'));
    })
    .catch(error => console.log('Login error:', error));
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    isAuthenticated: false
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  User
    .findOne({ email })
    .then(userDoc => {
      if (userDoc) return res.redirect('/signup');

      return bcrypt
        .hash(password, 12)
        .then(hash => {
          const user = new User({ email, password: hash, cart: { items: [] } });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
        })
    })
    .catch(error => console.log(error));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) console.log('postLogout -> error', error);

    res.redirect('/');
  });
};
