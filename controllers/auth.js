const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  const { isLoggedIn } = req.session;

  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  User
    .findById('5c68397bca46fa33a1fb50ba')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect('/');
    })
    .catch(error => console.log('Login error:', error));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) console.log('postLogout -> error', error);

    res.redirect('/');
  });
};
