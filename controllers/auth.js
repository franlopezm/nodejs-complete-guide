const crypto = require('crypto');
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

exports.getReset = (req, res, next) => {
  const message = req.flash('error');

  res.render('auth/reset-password', {
    pageTitle: 'Reset Password',
    path: '/reset-password',
    errorMessage: message.length > 0 ? message : undefined
  });
};

exports.postReset = (req, res, next) => {
  const { email } = req.body;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) return res.redirect('/reset-password');

    const token = buffer.toString('hex');
    User
      .findOne({ email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset-password');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // Expire in 1 hour

        return user.save();
      })
      .then(result => {
        transporter
          .sendMail({
            to: email,
            from: "shop@prueba.com",
            subject: "Password reset",
            html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password.</p>
            `
          })
          .catch(error => console.log('Send mail Error', error));

        res.redirect('/');
      })
      .catch(error => console.log(error));
  });
}

exports.getNewPassword = (req, res, next) => {
  const { token } = req.params;
  User
    .findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid token');
        return res.redirect('/login');
      }

      const message = req.flash('error');

      res.render('auth/new-password', {
        pageTitle: 'New Password',
        path: '/new-password',
        errorMessage: message.length > 0 ? message : undefined,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(error => console.log(error));
}

exports.postNewPassword = (req, res, next) => {
  const { userId, passwordToken, newPassword } = req.body;

  let resetUser;
  User
    .findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid token');
        return res.redirect('/login');
      }

      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hash => {
      resetUser.password = hash;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(error => console.log(error));
}