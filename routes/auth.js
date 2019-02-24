const { Router } = require('express');

const authCtrl = require('../controllers/auth');
const router = Router();

router.get('/login', authCtrl.getLogin);
router.post('/login', authCtrl.postLogin);

router.get('/signup', authCtrl.getSignup);
router.post('/signup', authCtrl.postSignup);

router.post('/logout', authCtrl.postLogout);

module.exports = router;