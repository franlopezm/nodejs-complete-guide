const { Router } = require('express');

const authCtrl = require('../controllers/auth');
const router = Router();

router.get('/login', authCtrl.getLogin);


module.exports = router;