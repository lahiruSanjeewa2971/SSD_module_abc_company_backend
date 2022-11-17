const Users = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


const UserCtrl = {
    register: async (req, res) => {
        try {
            const {fullName, userName, password} = req.body;

            const user = await Users.findOne({userName})
            if(user) 
                return res.status(400).json({msg: "The user name already exists."})

            if (password.length < 6)
                return res.status(400).json({msg: "Password should be at least 6 character long."})

            //password encryption
            const passwordHash = await bcrypt.hash(password, 10)

            const newUser = new Users({
                fullName, userName, password: passwordHash
            })

            await newUser.save()

            //create json web token to authentication
            const accesstoken = createAccessToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refreshtoken',
                maxAge: 7*24*60*60*1000     //7d
            })

            res.json({accesstoken})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    login: async (req, res) => {
        try {
            const {userName, password} = req.body;

            const user = await Users.findOne({userName})
            if(!user) return res.status(400).json({msg: "user does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Password incorrect."})

            //create json web token to authentication
            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refreshtoken',
                maxAge: 7*24*60*60*1000     //7d
            })

            res.json({accesstoken})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/user/refreshtoken'})
            return res.json({msg: "Logged Out"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }, 
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;

            if(!rf_token) return res.status(400).json({msg: "Please login again."})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return res.status(400).json({msg: "Please login."})

                const accesstoken = createAccessToken({id: user.id})
                
                res.json({accesstoken})
            })

            //res.json({rf_token})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({msg: "User does not exist."})

            res.json(user)
            //res.json(req.user)
        } catch (err) {
            return res.status(500).json({msg: error.message})
        }
    },
    encrypt: async (req, res) => {
        //console.log(crypto.getCurves());
        // encryption and decryption
        const admin = crypto.createECDH('secp256k1');
        admin.generateKeys();

        const user = crypto.createECDH('secp256k1');
        user.generateKeys();

        const adminPublicKeyBase64 = admin.getPublicKey().toString('base64');
        const userPublicKeyBase64 = user.getPublicKey().toString('base64');

        const adminSharedKey = admin.computeSecret(userPublicKeyBase64, 'base64', 'hex');
        console.log(adminSharedKey)
        const userSharedKey = user.computeSecret(adminPublicKeyBase64, 'base64', 'hex');

        console.log(adminSharedKey === userSharedKey)
        console.log("Admin shared key : ", adminSharedKey)
        console.log("User shared key : ", userSharedKey)
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'})
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'})
}

module.exports = UserCtrl