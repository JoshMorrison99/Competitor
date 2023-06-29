const mongoose = require('mongoose')

const runSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },            
    distance: { type: Number, required: true },   
	duration: { type: Number, required: true },   
	date: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Run', userSchema)