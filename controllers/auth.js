const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_KEY
  }
}));

exports.getLogin = (req, res, next) => {
  const message = req.flash('error');

  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message.length > 0 ? message : undefined
  });
};

exports.postLogin = (req, res, next) => {
  const { password, email } = req.body;

  User
    .findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }

      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (!doMatch) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
          }

          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save((error) => {
            if (error) console.log('Create session error', error);

            res.redirect('/');
          });
        })
        .catch(error => {
          req.flash('error', 'Invalid email or password.');
          return res.redirect('/login');
        });
    })
    .catch(error => console.log('Login error:', error));
};

exports.getSignup = (req, res, next) => {
  const message = req.flash('error');

  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMessage: message.length > 0 ? message : undefined
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  User
    .findOne({ email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Email exists already, please pick a different one.');
        return res.redirect('/signup');
      }

      return bcrypt
        .hash(password, 12)
        .then(hash => {
          const user = new User({ email, password: hash, cart: { items: [] } });
          return user.save();
        })
        .then(result => {
          transporter.sendMail({
            to: email,
            from: "shop@prueba.com",
            subject: "Signup success",
            html: "<h1>You successfully signed up!</h1>"
          }).catch(error => console.log('Send mail Error', error));

          res.redirect('/login');
        })
    })
    .catch(error => {
      req.flash('error', 'Email exists already, please pick a different one.');
      return res.redirect('/signup');
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) console.log('postLogout -> error', error);

    res.redirect('/');
  });
};
