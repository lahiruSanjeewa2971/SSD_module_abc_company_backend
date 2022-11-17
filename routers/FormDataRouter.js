const router = require('express').Router()
const FormDataCtrl = require('../controllers/FormDataCtrl')

const auth = require('../middleware/auth')
const authManager = require('../middleware/authManager')
const authUser = require('../middleware/authUser')

router.route('/userFormData')
    .post(auth, authUser, FormDataCtrl.createFormDataByUser)

router.route('/managerFormData')
    .post(auth, authManager, FormDataCtrl.createFormDataByManager)


module.exports = router