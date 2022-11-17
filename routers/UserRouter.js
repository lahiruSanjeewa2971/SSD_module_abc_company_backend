const router = require('express').Router()
const UserCtrl = require('../controllers/UserCtrl')
const auth = require('../middleware/auth')

router.post('/register', UserCtrl.register)

router.post('/login', UserCtrl.login)

router.get('/logout', UserCtrl.logout)

router.get('/refreshtoken', UserCtrl.refreshToken)

router.get('/infor', auth, UserCtrl.getUser)


module.exports = router