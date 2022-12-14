const mongoose = require('mongoose')

const FormDataSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: Object
    }

})

module.exports = mongoose.model('FormData', FormDataSchema);