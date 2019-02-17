const { Router } = require('express');

const authCtrl = require('../controllers/auth');
const router = Router();

router.get('/login', authCtrl.getLogin);
router.post('/login', authCtrl.postLogin);


module.exports = router;