const FormData = require('../models/FormData')

const FormDataCtrl = {
    createFormDataByUser: async (req, res) => {
        try {
            const {
                message, 
                image
            } = req.body;
            
            if(!message) return res.status(400),json({msg: "No message"});
            
            const newFormData = new FormData({
                message,
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
            
            const newFormData = new FormData({
                message,
                image
            })

            await newFormData.save()
            res.json({msg: "New data added."})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = FormDataCtrl