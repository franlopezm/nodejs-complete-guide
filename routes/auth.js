const { Router } = require('express');

const authCtrl = require('../controllers/auth');
const router = Router();

router.get('/login', authCtrl.getLogin);
router.post('/login', authCtrl.postLogin);

router.get('/signup', authCtrl.getSignup);
router.post('/signup', authCtrl.postSignup);

router.post('/logout', authCtrl.postLogout);

router.get('/reset-password', authCtrl.getReset);
router.post('/reset-password', authCtrl.postReset);
router.get('/reset-password/:token', authCtrl.getNewPassword);

router.post('/new-password', authCtrl.postNewPassword);


module.exports = router;