const User = require('../models/UserModel')

const authUser = async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.user.id
        })
        if(user.role === 1)
            return res.status(400).json({msg: "User resources access denied."})

        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authUser