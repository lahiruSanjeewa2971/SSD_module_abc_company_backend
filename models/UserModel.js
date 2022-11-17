const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String
    },
    role: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema);