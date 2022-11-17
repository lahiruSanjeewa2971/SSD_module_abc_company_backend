const FormData = require('../models/FormData')
const crypto = require('crypto');
const admin = crypto.createECDH('secp256k1');

admin.generateKeys();

const user = crypto.createECDH('secp256k1');
user.generateKeys();

const manager = crypto.createECDH('secp256k1');
manager.generateKeys();

const adminPublicKeyBase64 = admin.getPublicKey().toString('base64');
const userPublicKeyBase64 = user.getPublicKey().toString('base64');
const managerPublicKeyBase64 = manager.getPublicKey().toString('base64');
const adminSharedKey = admin.computeSecret(userPublicKeyBase64, 'base64', 'hex');
const adminManagerSharedKey = admin.computeSecret(managerPublicKeyBase64, 'base64', 'hex')
console.log(adminSharedKey)
console.log(adminManagerSharedKey)
const userSharedKey = user.computeSecret(adminPublicKeyBase64, 'base64', 'hex');
const managerSharedKey =  manager.computeSecret(adminPublicKeyBase64, 'base64', 'hex');
console.log(adminSharedKey === userSharedKey)
console.log(adminManagerSharedKey == managerSharedKey)
console.log("Admin shared key : ", adminSharedKey)
console.log("User shared key : ", userSharedKey)
console.log("Manager shared key: ", managerSharedKey)
console.log("Admin Manager shared key: ", adminManagerSharedKey)

const FormDataCtrl = {
    
    createFormDataByUser: async (req, res) => {
        try {
            const {
                message, 
                image
            } = req.body;
            
            if(!message) return res.status(400),json({msg: "No message"});
            const IV = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(
              'aes-256-gcm',
              Buffer.from(userSharedKey, 'hex'),
              IV
            );
            
            let encrypted = cipher.update(message, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            const auth_tag = cipher.getAuthTag().toString('hex');
            
            console.table({
              IV: IV.toString('hex'),
              encrypted: encrypted,
              auth_tag: auth_tag
            });
            
            const payload = IV.toString('hex') + encrypted + auth_tag;
            
            const upayload64 = Buffer.from(payload, 'hex').toString('base64');
            console.log(payload64);
            
            const newFormData = new FormData({
                message:upayload64,
                image
            })

            await newFormData.save()
            res.json({msg: "New data added."})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createFormDataByManager: async(req, res) => {
        try {
            const {
                message, 
                image
            } = req.body;
            
            if(!message) return res.status(400),json({msg: "No message"});
            const IV = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(
              'aes-256-gcm',
              Buffer.from(managerSharedKey, 'hex'),
              IV
            );
            
            let encrypted = cipher.update(message, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            const auth_tag = cipher.getAuthTag().toString('hex');
            
            console.table({
              IV: IV.toString('hex'),
              encrypted: encrypted,
              auth_tag: auth_tag
            });
            
            const payload = IV.toString('hex') + encrypted + auth_tag;
            
            const mpayload64 = Buffer.from(payload, 'hex').toString('base64');
            console.log(payload64);
            
            const newFormData = new FormData({
                message:mpayload64,
                image
            })
            

            await newFormData.save()
            res.json({msg: "New data added."})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getFormDataofUsers : async(req, res) =>{
        try{
                const formdata = await FormData.find()
                res.json(formdata)
            }catch(err){
                return res.status(500).json({msg: err.message})
            }

        const user_payload = Buffer.from(upayload64, 'base64').toString('hex');

        const user_iv = user_payload.substr(0, 32);
        const user_encrypted = user_payload.substr(32, manager_payload.length - 32 - 32);
        const user_auth_tag = user_payload.substr(manager_payload.length - 32, 32);
        
        console.table({ user_iv, user_encrypted, user_auth_tag });
        
        try {
          const decipher = crypto.createDecipheriv(
            'aes-256-gcm',
            Buffer.from(userSharedKey, 'hex'),
            Buffer.from(user_iv, 'hex')
          );
        
          decipher.setAuthTag(Buffer.from(user_auth_tag, 'hex'));
        
          let decrypted = decipher.update(user_encrypted, 'hex', 'utf8');
          decrypted += decipher.final('utf8');
        
          console.table({ DecyptedMessage: decrypted });
        } catch (error) {
          console.log(error.message);
        }
    }

}

module.exports = FormDataCtrl