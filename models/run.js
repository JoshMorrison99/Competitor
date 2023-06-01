const mongoose = require('mongoose')

const runSchema = new mongoose.Schema({
    distance: {
        type: Number,
        default: 0
    },
    time: {
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model('Run', userSchema)