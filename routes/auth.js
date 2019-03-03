const { Router } = require('express');
const { check, body } = require('express-validator/check');

const User = require('../models/user');
const authCtrl = require('../controllers/auth');
const router = Router();

router.get('/login', authCtrl.getLogin);
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.'),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
  ],
  authCtrl.postLogin
);

router.get('/signup', authCtrl.getSignup);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User
          .findOne({ email: value })
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('Email exists already, please pick a different one.');
            }
          });
      }),
    body('password', 'Please enter a password with only numbers and text and at least 5 characters.')
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value === req.body.password) return true;

      throw new Error('Password have to match!');
    })
  ],
  authCtrl.postSignup
);

router.post('/logout', authCtrl.postLogout);

router.get('/reset-password', authCtrl.getReset);
router.post('/reset-password', authCtrl.postReset);
router.get('/reset-password/:token', authCtrl.getNewPassword);

router.post('/new-password', authCtrl.postNewPassword);


module.exports = router;